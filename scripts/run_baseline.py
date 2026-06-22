#!/usr/bin/env python3
"""Run baseline models on real FlareDataset windows."""

import argparse
import json
import logging
import sys
from pathlib import Path

import numpy as np

try:
    from loguru import logger
except ImportError:  # pragma: no cover - fallback for minimal environments
    logging.basicConfig(level=logging.INFO, format="%(levelname)s:%(name)s:%(message)s")
    logger = logging.getLogger("run_baseline")

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from src.data.dataset import FlareDataset
from src.data.preprocessing import preprocess_lightcurves
try:
    from src.evaluation.metrics import (
        compute_classification_metrics,
        heidke_skill_score,
        true_skill_score,
    )
except ModuleNotFoundError:  # pragma: no cover - fallback when sklearn is unavailable

    def compute_classification_metrics(y_true, y_pred, labels=None):
        labels_present = sorted(set(y_true.tolist()) | set(y_pred.tolist()))
        accuracy = float(np.mean(y_true == y_pred)) if len(y_true) else 0.0
        f1_scores = []
        precisions = []
        recalls = []
        confusion = np.zeros((max(labels_present, default=0) + 1, max(labels_present, default=0) + 1), dtype=int)
        for truth, pred in zip(y_true, y_pred):
            confusion[int(truth), int(pred)] += 1
        for cls in labels_present:
            tp = int(((y_true == cls) & (y_pred == cls)).sum())
            fp = int(((y_true != cls) & (y_pred == cls)).sum())
            fn = int(((y_true == cls) & (y_pred != cls)).sum())
            precision = tp / max(tp + fp, 1)
            recall = tp / max(tp + fn, 1)
            f1 = 2 * precision * recall / max(precision + recall, 1e-12)
            precisions.append(precision)
            recalls.append(recall)
            f1_scores.append(f1)
        return {
            "accuracy": accuracy,
            "f1_macro": float(np.mean(f1_scores)) if f1_scores else 0.0,
            "f1_weighted": float(np.mean(f1_scores)) if f1_scores else 0.0,
            "precision_macro": float(np.mean(precisions)) if precisions else 0.0,
            "recall_macro": float(np.mean(recalls)) if recalls else 0.0,
            "confusion_matrix": confusion.tolist(),
        }

    def _binary_counts(y_true, y_pred):
        tn = int(((y_true == 0) & (y_pred == 0)).sum())
        fp = int(((y_true == 0) & (y_pred == 1)).sum())
        fn = int(((y_true == 1) & (y_pred == 0)).sum())
        tp = int(((y_true == 1) & (y_pred == 1)).sum())
        return tn, fp, fn, tp

    def heidke_skill_score(y_true, y_pred):
        tn, fp, fn, tp = _binary_counts(y_true, y_pred)
        total = tn + fp + fn + tp
        if total == 0:
            return 0.0
        expected = ((tn + fp) * (tn + fn) + (fn + tp) * (fp + tp)) / total
        denominator = total - expected
        return float(((tn + tp) - expected) / denominator) if denominator else 0.0

    def true_skill_score(y_true, y_pred):
        tn, fp, fn, tp = _binary_counts(y_true, y_pred)
        tpr = tp / (tp + fn) if tp + fn else 0.0
        fpr = fp / (fp + tn) if fp + tn else 0.0
        return float(tpr - fpr)
from src.models.baselines import FluxRiseForecaster, ThresholdNowcaster


def parse_args():
    parser = argparse.ArgumentParser(description="Run baseline model for flare nowcasting/forecasting")
    parser.add_argument(
        "--task",
        type=str,
        required=True,
        choices=["nowcast", "forecast"],
        help="Task type: nowcast or forecast",
    )
    parser.add_argument(
        "--model",
        type=str,
        required=True,
        choices=["threshold", "flux-rise"],
        help="Baseline model type",
    )
    parser.add_argument(
        "--data-path",
        type=str,
        default="data/raw/sample_event.h5",
        help="Path to organizer CSV/HDF5 data file or directory",
    )
    parser.add_argument(
        "--annotation-path",
        type=str,
        default=None,
        help="Optional CSV/HDF5 flare annotation file or directory",
    )
    parser.add_argument("--window-size", type=int, default=512, help="Dataset window size")
    parser.add_argument("--stride", type=int, default=128, help="Dataset window stride")
    parser.add_argument("--cadence", type=str, default="1s", help="Common cadence for stream alignment")
    parser.add_argument("--output", type=str, default="results.json", help="Path to save results")
    return parser.parse_args()


def _predict_nowcast(sample, model: ThresholdNowcaster) -> int:
    solexs = sample["solexs"].numpy()
    hel1os = sample["hel1os"].numpy()
    solexs, hel1os = preprocess_lightcurves(solexs, hel1os)
    detections = model.predict(hel1os[:, 0])
    return int(np.any(detections))


def _predict_forecast(sample, model: FluxRiseForecaster) -> int:
    solexs = sample["solexs"].numpy()
    hel1os = sample["hel1os"].numpy()
    solexs, _ = preprocess_lightcurves(solexs, hel1os)
    predicted_class = model.predict(solexs[:, 0])
    return {"C": 1, "M": 2, "X": 3}.get(predicted_class, 0)


def main():
    args = parse_args()
    logger.info(f"Running baseline: task={args.task}, model={args.model}")
    logger.info(f"Loading real dataset from {args.data_path}")

    dataset = FlareDataset(
        data_path=args.data_path,
        annotation_path=args.annotation_path,
        window_size=args.window_size,
        stride=args.stride,
        cadence=args.cadence,
    )
    logger.info(f"Loaded {len(dataset)} real windows")

    if args.task == "nowcast":
        if args.model != "threshold":
            raise ValueError("Nowcast baseline currently supports --model threshold")
        model = ThresholdNowcaster(threshold=3.0, baseline_window=min(60, max(1, args.window_size // 4)))
        predictions = np.array([_predict_nowcast(sample, model) for sample in dataset], dtype=int)

    else:
        if args.model != "flux-rise":
            raise ValueError("Forecast baseline currently supports --model flux-rise")
        model = FluxRiseForecaster(window=min(30, max(1, args.window_size // 4)))
        predictions = np.array([_predict_forecast(sample, model) for sample in dataset], dtype=int)

    true_labels = np.array([int(dataset[i]["label"].item()) for i in range(len(dataset))], dtype=int)

    metrics = compute_classification_metrics(true_labels, predictions)
    metrics["hss"] = heidke_skill_score((true_labels > 0).astype(int), (predictions > 0).astype(int))
    metrics["tss"] = true_skill_score((true_labels > 0).astype(int), (predictions > 0).astype(int))

    payload = {
        "task": args.task,
        "model": args.model,
        "data_path": args.data_path,
        "annotation_path": args.annotation_path,
        "n_samples": len(dataset),
        "label_counts": {str(label): int(count) for label, count in zip(*np.unique(true_labels, return_counts=True))},
        "metrics": metrics,
        "example_metadata": dataset[0]["metadata"],
    }

    logger.info(f"Results: {json.dumps(payload, indent=2)}")

    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2)
    logger.info(f"Results saved to {args.output}")


if __name__ == "__main__":
    main()
