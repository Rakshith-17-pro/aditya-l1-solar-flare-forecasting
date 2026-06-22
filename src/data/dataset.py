"""FlareDataset — load real SoLEXS and HEL1OS organizer data.

This module is the Phase-1 ingestion contract for the project. It converts CSV
and HDF5 inputs into a common internal representation, aligns SoLEXS and HEL1OS
on a shared time axis, handles bad/missing data, and creates windowed samples.

Schema assumptions
------------------
* Data path may be a single CSV/HDF5 file or a directory of files.
* Timestamp columns/datasets are detected from common names: ``timestamp``,
  ``time``, ``datetime``, ``date_time``, ``utc``, ``date``.
* SoLEXS/HEL1OS channel columns should contain ``solexs`` or ``hel1os``/``helios``
  in their name. If a file name contains an instrument name, numeric non-metadata
  columns in that file are assigned to that instrument.
* Default common cadence is 1 second. Duplicate timestamps are averaged.
* Bad values: +/-inf and negative flux values become NaN; values are interpolated
  along the shared time axis; windows whose pre-interpolation missingness exceeds
  ``max_missing_ratio`` (default 20%) are dropped.
* Annotation files are optional. If present, they should include start/onset,
  end/stop, and flare class columns. Window label = highest severity overlapping
  event; no overlap = quiet (0). If annotations are absent, labels default to 0
  and metadata records ``labels_defaulted=True``.
"""

from __future__ import annotations

import csv
import logging
import math
import re
import warnings
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable, Optional

import h5py
import numpy as np
import torch
from torch.utils.data import Dataset


LOGGER = logging.getLogger(__name__)

LABEL_MAP = {"C": 1, "M": 2, "X": 3}
TIMESTAMP_NAMES = ("timestamp", "time", "datetime", "date_time", "utc", "date", "t")
METADATA_TOKENS = ("time", "flag", "label", "id", "class", "peak")
DATA_EXTENSIONS = {".csv", ".h5", ".hdf5", ".hdf"}


@dataclass
class _LoadedStream:
    timestamps_ns: np.ndarray
    solexs: Optional[np.ndarray]
    hel1os: Optional[np.ndarray]
    source_file: str


class FlareDataset(Dataset):
    """PyTorch Dataset for combined SoLEXS + HEL1OS time-series data.

    Each sample contains a co-temporal window of soft X-ray (SoLEXS) and
    hard X-ray (HEL1OS) flux values, along with a flare class label.
    """

    def __init__(
        self,
        data_path: str,
        window_size: int = 512,
        stride: int = 128,
        transform=None,
        target_transform=None,
        annotation_path: Optional[str] = None,
        cadence: str = "1s",
        max_missing_ratio: float = 0.20,
    ):
        if window_size <= 0:
            raise ValueError("window_size must be positive")
        if stride <= 0:
            raise ValueError("stride must be positive")
        if not 0.0 <= max_missing_ratio <= 1.0:
            raise ValueError("max_missing_ratio must be between 0 and 1")

        self.data_path = data_path
        self.window_size = int(window_size)
        self.stride = int(stride)
        self.transform = transform
        self.target_transform = target_transform
        self.annotation_path = annotation_path
        self.cadence = cadence
        self.cadence_ns = self._parse_cadence_ns(cadence)
        self.max_missing_ratio = float(max_missing_ratio)

        self.samples = self._load_data()

    def _load_data(self):
        """Load CSV/HDF5 data and generate aligned sliding windows."""
        data_files = self._discover_data_files(Path(self.data_path))
        if not data_files:
            raise FileNotFoundError(f"No CSV/HDF5 files found at data_path={self.data_path!r}")

        streams = [self._load_file(path) for path in data_files]
        aligned = self._align_streams(streams)
        annotations = self._load_annotations()
        samples = self._generate_windows(aligned, annotations)
        if not samples:
            raise ValueError(
                "No valid windows generated. Check window_size/stride, file schema, "
                "timestamp coverage, or max_missing_ratio."
            )
        return samples

    def _load_file(self, path: Path) -> _LoadedStream:
        suffix = path.suffix.lower()
        if suffix == ".csv":
            return self._load_csv(path)
        if suffix in {".h5", ".hdf5", ".hdf"}:
            return self._load_hdf5(path)
        raise ValueError(f"Unsupported data format: {path}")

    def _load_csv(self, path: Path) -> _LoadedStream:
        """Load a CSV file and normalize SoLEXS/HEL1OS columns."""
        with path.open("r", encoding="utf-8-sig", newline="") as fh:
            rows = list(csv.DictReader(fh))
        if not rows:
            raise ValueError(f"CSV file is empty or missing a header: {path}")

        columns = list(rows[0].keys())
        timestamp_col = self._find_timestamp_column(columns)
        if timestamp_col is None:
            raise ValueError(
                f"Could not find timestamp column in {path}. Expected one of {TIMESTAMP_NAMES}; "
                f"available columns={columns}"
            )

        solexs_cols, hel1os_cols = self._detect_channel_columns(columns, path)
        if not solexs_cols and not hel1os_cols:
            raise ValueError(
                f"No SoLEXS/HEL1OS flux columns detected in {path}. Use names like "
                "solexs_bin_0 or hel1os_flux_0, or include the instrument name in the file name."
            )

        timestamps_ns = np.array([self._parse_timestamp(row.get(timestamp_col), path) for row in rows], dtype=np.int64)
        valid_time = timestamps_ns > 0
        solexs = self._rows_to_matrix(rows, solexs_cols)[valid_time] if solexs_cols else None
        hel1os = self._rows_to_matrix(rows, hel1os_cols)[valid_time] if hel1os_cols else None
        return _LoadedStream(timestamps_ns[valid_time], solexs, hel1os, str(path))

    def _load_hdf5(self, path: Path) -> _LoadedStream:
        """Load HDF5 by inspecting datasets dynamically."""
        arrays: dict[str, np.ndarray] = {}
        with h5py.File(path, "r") as h5:

            def visit(name: str, obj: Any) -> None:
                if isinstance(obj, h5py.Dataset):
                    arr = np.asarray(obj)
                    if arr.ndim in (1, 2):
                        arrays[name] = arr

            h5.visititems(visit)

        if not arrays:
            raise ValueError(f"HDF5 file contains no 1D/2D datasets: {path}")

        timestamp_key = self._find_timestamp_column(arrays.keys())
        if timestamp_key is None:
            raise ValueError(f"Could not find timestamp dataset in {path}. Available keys={sorted(arrays)}")

        raw_timestamps = arrays[timestamp_key]
        timestamps_ns = np.array([self._parse_timestamp(value, path) for value in raw_timestamps], dtype=np.int64)
        valid_time = timestamps_ns > 0

        solexs_parts: list[np.ndarray] = []
        hel1os_parts: list[np.ndarray] = []
        for key, arr in arrays.items():
            if key == timestamp_key or len(arr) != len(timestamps_ns):
                continue
            clean = self._clean_name(key)
            if any(token in clean for token in METADATA_TOKENS):
                continue
            matrix = arr.reshape(len(arr), 1) if arr.ndim == 1 else arr
            matrix = self._sanitize_flux(matrix.astype(float, copy=False))[valid_time]
            if "solexs" in clean:
                solexs_parts.append(matrix)
            elif "hel1os" in clean or "helios" in clean:
                hel1os_parts.append(matrix)
            elif "solexs" in path.stem.lower():
                solexs_parts.append(matrix)
            elif "hel1os" in path.stem.lower() or "helios" in path.stem.lower():
                hel1os_parts.append(matrix)

        solexs = np.concatenate(solexs_parts, axis=1) if solexs_parts else None
        hel1os = np.concatenate(hel1os_parts, axis=1) if hel1os_parts else None
        if solexs is None and hel1os is None:
            raise ValueError(
                f"No SoLEXS/HEL1OS datasets detected in {path}. Available keys={sorted(arrays)}"
            )
        return _LoadedStream(timestamps_ns[valid_time], solexs, hel1os, str(path))

    def _align_streams(self, streams: list[_LoadedStream]) -> dict[str, Any]:
        """Align SoLEXS and HEL1OS streams on a shared cadence axis."""
        n_solexs_bins = max((s.solexs.shape[1] for s in streams if s.solexs is not None), default=0)
        n_hel1os_bins = max((s.hel1os.shape[1] for s in streams if s.hel1os is not None), default=0)
        if n_solexs_bins == 0:
            raise ValueError("No SoLEXS channels found after loading data files")
        if n_hel1os_bins == 0:
            raise ValueError("No HEL1OS channels found after loading data files")

        grouped: dict[int, dict[str, Any]] = {}
        for stream in streams:
            for row_idx, ts in enumerate(stream.timestamps_ns):
                slot = grouped.setdefault(int(ts), {"solexs": [], "hel1os": [], "sources": set()})
                slot["sources"].add(stream.source_file)
                if stream.solexs is not None:
                    slot["solexs"].append(self._pad_vector(stream.solexs[row_idx], n_solexs_bins))
                if stream.hel1os is not None:
                    slot["hel1os"].append(self._pad_vector(stream.hel1os[row_idx], n_hel1os_bins))

        if not grouped:
            raise ValueError("All rows were dropped because timestamps could not be parsed")

        start_ns = min(grouped)
        end_ns = max(grouped)
        timestamps_ns = np.arange(start_ns, end_ns + self.cadence_ns, self.cadence_ns, dtype=np.int64)
        time_index = {int(ts): idx for idx, ts in enumerate(timestamps_ns)}

        solexs = np.full((len(timestamps_ns), n_solexs_bins), np.nan, dtype=float)
        hel1os = np.full((len(timestamps_ns), n_hel1os_bins), np.nan, dtype=float)
        source_file = np.array(["" for _ in timestamps_ns], dtype=object)

        for ts, slot in grouped.items():
            snapped = int(round((ts - start_ns) / self.cadence_ns) * self.cadence_ns + start_ns)
            if snapped not in time_index or abs(snapped - ts) > self.cadence_ns / 2:
                continue
            idx = time_index[snapped]
            if slot["solexs"]:
                solexs[idx] = self._nanmean_no_warning(np.vstack(slot["solexs"]))
            if slot["hel1os"]:
                hel1os[idx] = self._nanmean_no_warning(np.vstack(slot["hel1os"]))
            source_file[idx] = ";".join(sorted(slot["sources"]))

        missing_ratio = np.concatenate([np.isnan(solexs), np.isnan(hel1os)], axis=1).mean(axis=1)
        return {
            "timestamps_ns": timestamps_ns,
            "solexs_flux": self._interpolate_matrix(solexs),
            "hel1os_flux": self._interpolate_matrix(hel1os),
            "missing_ratio": missing_ratio,
            "source_file": source_file,
        }

    def _load_annotations(self) -> list[dict[str, Any]]:
        annotation_files = self._discover_annotation_files()
        if not annotation_files:
            warnings.warn("No flare annotations found; labels default to quiet/no-flare (0).", RuntimeWarning)
            return []

        events: list[dict[str, Any]] = []
        for path in annotation_files:
            if path.suffix.lower() == ".csv":
                records = self._read_csv_records(path)
            elif path.suffix.lower() in {".h5", ".hdf5", ".hdf"}:
                records = self._read_hdf5_records(path)
            else:
                continue
            if not records:
                continue

            columns = list(records[0].keys())
            start_col = self._find_first_column(columns, ("start_time", "onset", "begin", "event_start", "start"))
            end_col = self._find_first_column(columns, ("end_time", "end", "event_end", "stop"))
            class_col = self._find_first_column(columns, ("flare_class", "class", "goes_class", "label"))
            if start_col is None or end_col is None or class_col is None:
                raise ValueError(
                    f"Annotation file {path} must contain start/end/class columns; columns={columns}"
                )
            event_id_col = self._find_first_column(columns, ("event_id", "flare_id", "id"))
            peak_col = self._find_first_column(columns, ("peak_flux", "flux_peak", "peak"))

            for idx, row in enumerate(records):
                flare_class = self._class_token(row.get(class_col))
                events.append(
                    {
                        "start_time": self._parse_timestamp(row.get(start_col), path),
                        "end_time": self._parse_timestamp(row.get(end_col), path),
                        "label": LABEL_MAP.get(flare_class, 0),
                        "flare_class": None if flare_class == "quiet" else flare_class,
                        "event_id": row.get(event_id_col, str(idx)) if event_id_col else str(idx),
                        "peak_flux": self._parse_float(row.get(peak_col)) if peak_col else None,
                    }
                )
        return [e for e in events if e["start_time"] > 0 and e["end_time"] > 0]

    def _assign_window_label(self, start_ns: int, end_ns: int, annotations: list[dict[str, Any]]) -> tuple[int, dict[str, Any]]:
        if not annotations:
            return 0, {}
        overlapping = [event for event in annotations if event["start_time"] <= end_ns and event["end_time"] >= start_ns]
        if not overlapping:
            return 0, {}
        best = max(overlapping, key=lambda event: int(event.get("label", 0)))
        return int(best.get("label", 0)), best

    def _generate_windows(self, aligned: dict[str, Any], annotations: list[dict[str, Any]]) -> list[dict[str, Any]]:
        timestamps_ns = aligned["timestamps_ns"]
        solexs_flux = aligned["solexs_flux"]
        hel1os_flux = aligned["hel1os_flux"]
        missing_ratio = aligned["missing_ratio"]
        source_file = aligned["source_file"]
        labels_defaulted = len(annotations) == 0

        samples: list[dict[str, Any]] = []
        last_start = len(timestamps_ns) - self.window_size
        for start_idx in range(0, last_start + 1, self.stride):
            end_idx = start_idx + self.window_size
            window_missing_ratio = float(np.nanmean(missing_ratio[start_idx:end_idx]))
            if window_missing_ratio > self.max_missing_ratio:
                continue

            solexs_window = solexs_flux[start_idx:end_idx].astype(np.float32)
            hel1os_window = hel1os_flux[start_idx:end_idx].astype(np.float32)
            if np.isnan(solexs_window).any() or np.isnan(hel1os_window).any():
                continue

            start_ns = int(timestamps_ns[start_idx])
            end_ns = int(timestamps_ns[end_idx - 1])
            label, event = self._assign_window_label(start_ns, end_ns, annotations)
            sources = sorted({src for src in source_file[start_idx:end_idx] if src})
            samples.append(
                {
                    "solexs_flux": solexs_window,
                    "hel1os_flux": hel1os_window,
                    "label": int(label),
                    "metadata": {
                        "start_time": self._iso_from_ns(start_ns),
                        "end_time": self._iso_from_ns(end_ns),
                        "event_id": event.get("event_id"),
                        "flare_class": event.get("flare_class"),
                        "peak_flux": event.get("peak_flux"),
                        "source_file": ";".join(sources),
                        "quality_flags": {
                            "missingness_ratio": window_missing_ratio,
                            "interpolation_used": bool(window_missing_ratio > 0),
                            "labels_defaulted": labels_defaulted,
                        },
                    },
                }
            )
        return samples

    def __len__(self) -> int:
        return len(self.samples)

    def __getitem__(self, idx: int):
        sample = self.samples[idx]

        solexs_flux = sample["solexs_flux"]
        hel1os_flux = sample["hel1os_flux"]
        label = sample["label"]
        metadata = sample.get("metadata", {})

        if self.transform:
            solexs_flux, hel1os_flux = self.transform(solexs_flux, hel1os_flux)

        if self.target_transform:
            label = self.target_transform(label)

        return {
            "solexs": torch.tensor(solexs_flux, dtype=torch.float32),
            "hel1os": torch.tensor(hel1os_flux, dtype=torch.float32),
            "label": torch.tensor(label, dtype=torch.long),
            "metadata": metadata,
        }

    def _discover_data_files(self, data_path: Path) -> list[Path]:
        if data_path.is_file():
            return [data_path]
        if not data_path.exists():
            raise FileNotFoundError(f"data_path does not exist: {data_path}")
        return sorted(
            path
            for path in data_path.rglob("*")
            if path.suffix.lower() in DATA_EXTENSIONS and not self._looks_like_annotation(path)
        )

    def _discover_annotation_files(self) -> list[Path]:
        if self.annotation_path:
            path = Path(self.annotation_path)
            if path.is_file():
                return [path]
            if not path.exists():
                raise FileNotFoundError(f"annotation_path does not exist: {path}")
            return sorted(p for p in path.rglob("*") if p.suffix.lower() in DATA_EXTENSIONS)

        data_path = Path(self.data_path)
        search_root = data_path.parent if data_path.is_file() else data_path
        if not search_root.exists():
            return []
        return sorted(
            path
            for path in search_root.rglob("*")
            if path.suffix.lower() in DATA_EXTENSIONS and self._looks_like_annotation(path)
        )

    @staticmethod
    def _read_csv_records(path: Path) -> list[dict[str, Any]]:
        with path.open("r", encoding="utf-8-sig", newline="") as fh:
            return list(csv.DictReader(fh))

    @staticmethod
    def _read_hdf5_records(path: Path) -> list[dict[str, Any]]:
        columns: dict[str, np.ndarray] = {}
        with h5py.File(path, "r") as h5:

            def visit(name: str, obj: Any) -> None:
                if isinstance(obj, h5py.Dataset):
                    arr = np.asarray(obj)
                    if arr.ndim == 1:
                        columns[Path(name).name] = arr

            h5.visititems(visit)
        if not columns:
            return []
        n_rows = min(len(values) for values in columns.values())
        records: list[dict[str, Any]] = []
        for i in range(n_rows):
            record: dict[str, Any] = {}
            for name, values in columns.items():
                value = values[i]
                record[name] = value.decode("utf-8", errors="ignore") if isinstance(value, bytes) else value
            records.append(record)
        return records

    @staticmethod
    def _detect_channel_columns(columns: Iterable[str], path: Path) -> tuple[list[str], list[str]]:
        cols = list(columns)
        clean = {col: FlareDataset._clean_name(col) for col in cols}
        solexs = [col for col in cols if "solexs" in clean[col] and not any(tok in clean[col] for tok in METADATA_TOKENS)]
        hel1os = [col for col in cols if ("hel1os" in clean[col] or "helios" in clean[col]) and not any(tok in clean[col] for tok in METADATA_TOKENS)]
        fallback = [col for col in cols if not any(tok in clean[col] for tok in METADATA_TOKENS)]
        stem = path.stem.lower()
        if not solexs and "solexs" in stem:
            solexs = fallback
        if not hel1os and ("hel1os" in stem or "helios" in stem):
            hel1os = fallback
        return sorted(solexs, key=FlareDataset._natural_key), sorted(hel1os, key=FlareDataset._natural_key)

    @staticmethod
    def _rows_to_matrix(rows: list[dict[str, Any]], columns: list[str]) -> np.ndarray:
        matrix = np.array([[FlareDataset._parse_float(row.get(col)) for col in columns] for row in rows], dtype=float)
        return FlareDataset._sanitize_flux(matrix)

    @staticmethod
    def _sanitize_flux(values: np.ndarray) -> np.ndarray:
        values = values.astype(float, copy=True)
        values[~np.isfinite(values)] = np.nan
        values[values < 0] = np.nan
        return values

    @staticmethod
    def _interpolate_matrix(values: np.ndarray) -> np.ndarray:
        output = values.copy()
        x = np.arange(len(output))
        for col in range(output.shape[1]):
            series = output[:, col]
            valid = np.isfinite(series)
            if valid.all():
                continue
            if valid.sum() == 0:
                continue
            output[:, col] = np.interp(x, x[valid], series[valid])
        return output

    @staticmethod
    def _nanmean_no_warning(values: np.ndarray) -> np.ndarray:
        counts = np.isfinite(values).sum(axis=0)
        sums = np.nansum(values, axis=0)
        output = np.full(values.shape[1], np.nan, dtype=float)
        np.divide(sums, counts, out=output, where=counts > 0)
        return output

    @staticmethod
    def _pad_vector(values: np.ndarray, size: int) -> np.ndarray:
        output = np.full(size, np.nan, dtype=float)
        output[: min(size, len(values))] = values[:size]
        return output

    @staticmethod
    def _find_timestamp_column(columns: Iterable[str]) -> Optional[str]:
        return FlareDataset._find_first_column(columns, TIMESTAMP_NAMES)

    @staticmethod
    def _find_first_column(columns: Iterable[str], candidates: Iterable[str]) -> Optional[str]:
        cols = list(columns)
        cleaned = {col: FlareDataset._clean_name(col) for col in cols}
        for candidate in candidates:
            candidate_clean = FlareDataset._clean_name(candidate)
            for original, clean in cleaned.items():
                if clean == candidate_clean or candidate_clean in clean:
                    return original
        return None

    @staticmethod
    def _parse_timestamp(value: Any, source: Path) -> int:
        if isinstance(value, bytes):
            value = value.decode("utf-8", errors="ignore")
        if isinstance(value, np.datetime64):
            return int(value.astype("datetime64[ns]").astype(np.int64))
        text = str(value).strip()
        if not text:
            return 0
        try:
            numeric = float(text)
            if math.isfinite(numeric):
                seconds = numeric / 1000.0 if numeric > 10_000_000_000 else numeric
                return int(seconds * 1_000_000_000)
        except ValueError:
            pass
        try:
            normalized = text.replace("Z", "+00:00")
            parsed = datetime.fromisoformat(normalized)
            if parsed.tzinfo is None:
                parsed = parsed.replace(tzinfo=timezone.utc)
            return int(parsed.timestamp() * 1_000_000_000)
        except ValueError:
            LOGGER.debug("Failed to parse timestamp %r from %s", value, source)
            return 0

    @staticmethod
    def _parse_float(value: Any) -> float:
        try:
            return float(value)
        except (TypeError, ValueError):
            return float("nan")

    @staticmethod
    def _class_token(value: Any) -> str:
        match = re.search(r"[CMX]", str(value).upper())
        return match.group(0) if match else "quiet"

    @staticmethod
    def _clean_name(name: str) -> str:
        return re.sub(r"[^a-zA-Z0-9_]+", "_", str(name).strip().lower()).strip("_")

    @staticmethod
    def _natural_key(name: str) -> tuple[str, int]:
        match = re.search(r"(\d+)(?!.*\d)", name)
        return name, int(match.group(1)) if match else -1

    @staticmethod
    def _looks_like_annotation(path: Path) -> bool:
        return any(token in path.stem.lower() for token in ("annot", "label", "flare", "event", "catalog"))

    @staticmethod
    def _parse_cadence_ns(cadence: str) -> int:
        match = re.fullmatch(r"\s*(\d+)\s*(ms|s|min|m|h)\s*", cadence.lower())
        if not match:
            raise ValueError("cadence must be like '1s', '500ms', '1min', or '1h'")
        value = int(match.group(1))
        unit = match.group(2)
        factors = {
            "ms": 1_000_000,
            "s": 1_000_000_000,
            "min": 60_000_000_000,
            "m": 60_000_000_000,
            "h": 3_600_000_000_000,
        }
        return value * factors[unit]

    @staticmethod
    def _iso_from_ns(ns: int) -> str:
        return datetime.fromtimestamp(ns / 1_000_000_000, tz=timezone.utc).isoformat().replace("+00:00", "Z")
