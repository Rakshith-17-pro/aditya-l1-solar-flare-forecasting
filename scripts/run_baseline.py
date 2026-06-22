#!/usr/bin/env python3
"""Run a baseline model for nowcasting or forecasting."""

import argparse
import json

import numpy as np
from loguru import logger

from src.data.preprocessing import preprocess_lightcurves
from src.evaluation.metrics import (
    compute_classification_metrics,
    compute_detection_latency,
    heidke_skill_score,
    true_skill_score,
)
from src.features.flare_signatures import compute_rise_rate
from src.models.baselines import FluxRiseForecaster, ThresholdNowcaster


def parse_args():
    parser = argparse.ArgumentParser(description="Run baseline model for flare nowcasting/forecasting")
    parser.add_argument("--task", type=str, required=True, choices=["nowcast", "forecast"],
                        help="Task type: nowcast or forecast")
    parser.add_argument("--model", type=str, required=True, choices=["threshold", "cnn_lstm"],
                        help="Model type")
    parser.add_argument("--data-path", type=str, default="data/raw/sample_event.h5",
                        help="Path to input data")
    parser.add_argument("--output", type=str, default="results.json",
                        help="Path to save results")
    return parser.parse_args()


def main():
    args = parse_args()
    logger.info(f"Running baseline: task={args.task}, model={args.model}")

    # TODO: Replace with actual data loading
    logger.warning("Using synthetic data — replace with actual dataset loading.")
    n_samples = 1000
    solexs_flux = np.random.randn(n_samples, 4) + 1.0
    hel1os_flux = np.random.randn(n_samples, 4) + 0.5
    true_labels = np.random.randint(0, 4, size=n_samples)

    # Preprocess
    solexs_flux, hel1os_flux = preprocess_lightcurves(solexs_flux, hel1os_flux)

    if args.task == "nowcast":
        model = ThresholdNowcaster(threshold=3.0, baseline_window=60)
        predictions = model.predict(hel1os_flux[:, 0])  # Use first energy bin
        predictions = predictions.astype(int)

        metrics = compute_classification_metrics(true_labels, predictions)
        metrics["hss"] = heidke_skill_score((true_labels > 0).astype(int), (predictions > 0).astype(int))
        metrics["tss"] = true_skill_score((true_labels > 0).astype(int), (predictions > 0).astype(int))

    elif args.task == "forecast":
        model = FluxRiseForecaster(window=30)
        rise_rates = compute_rise_rate(solexs_flux[:, 0], window=30)
        predictions = np.array([model.predict(solexs_flux[max(0, t - 30) : t + 1, 0])
                                for t in range(len(solexs_flux))])
        # Map class strings to integers
        class_map = {"C": 1, "M": 2, "X": 3}
        pred_int = np.array([class_map.get(p, 0) for p in predictions])

        metrics = compute_classification_metrics(true_labels, pred_int)
        metrics["hss"] = heidke_skill_score((true_labels > 0).astype(int), (pred_int > 0).astype(int))
        metrics["tss"] = true_skill_score((true_labels > 0).astype(int), (pred_int > 0).astype(int))

    logger.info(f"Results: {json.dumps(metrics, indent=2)}")

    with open(args.output, "w") as f:
        json.dump(metrics, f, indent=2)
    logger.info(f"Results saved to {args.output}")


if __name__ == "__main__":
    main()
