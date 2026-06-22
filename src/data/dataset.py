"""FlareDataset — Load and preprocess combined SoLEXS and HEL1OS data."""

from typing import Optional, Tuple

import h5py
import numpy as np
import pandas as pd
import torch
from torch.utils.data import Dataset


class FlareDataset(Dataset):
    """PyTorch Dataset for combined SoLEXS + HEL1OS time-series data.

    Each sample contains a co-temporal window of soft X-ray (SoLEXS) and
    hard X-ray (HEL1OS) flux values, along with the associated flare
    annotation (class label, onset/peak/end times, peak flux).
    """

    def __init__(
        self,
        data_path: str,
        window_size: int = 512,
        stride: int = 128,
        transform=None,
        target_transform=None,
    ):
        self.data_path = data_path
        self.window_size = window_size
        self.stride = stride
        self.transform = transform
        self.target_transform = target_transform

        # Load data — implemented by participants
        self.samples = self._load_data()

    def _load_data(self):
        """Load data from HDF5 / CSV and generate sliding windows.
        To be implemented by participants.
        """
        raise NotImplementedError(
            "Participants must implement data loading from the provided dataset. "
            "See data/raw/ for sample files."
        )

    def __len__(self) -> int:
        return len(self.samples)

    def __getitem__(self, idx: int):
        sample = self.samples[idx]

        solexs_flux = sample["solexs_flux"]   # shape: (window_size, n_energy_bins)
        hel1os_flux = sample["hel1os_flux"]   # shape: (window_size, n_energy_bins)
        label = sample["label"]                # flare class: 0=quiet, 1=C, 2=M, 3=X
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
