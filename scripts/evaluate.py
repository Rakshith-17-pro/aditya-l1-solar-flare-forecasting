#!/usr/bin/env python3
"""Evaluate a trained model on a test set."""

import argparse
import json

import torch
from loguru import logger
from torch.utils.data import DataLoader

from src.data.dataset import FlareDataset
from src.evaluation.metrics import compute_classification_metrics
from src.utils.config import load_config


def parse_args():
    parser = argparse.ArgumentParser(description="Evaluate a trained model")
    parser.add_argument("--config", type=str, required=True,
                        help="Path to configuration file")
    parser.add_argument("--checkpoint", type=str, required=True,
                        help="Path to model checkpoint")
    parser.add_argument("--device", type=str, default="cuda" if torch.cuda.is_available() else "cpu",
                        help="Device to use")
    parser.add_argument("--output", type=str, default="evaluation_results.json",
                        help="Path to save results")
    return parser.parse_args()


def main():
    args = parse_args()
    logger.info(f"Evaluating model from {args.checkpoint}")

    cfg = load_config(args.config)

    # TODO: Initialize model from config and load checkpoint
    logger.warning("Model loading not yet implemented — add model initialization logic.")

    # Placeholder evaluation
    results = {"status": "evaluation scaffold — replace with actual model evaluation"}
    with open(args.output, "w") as f:
        json.dump(results, f, indent=2)
    logger.info(f"Results saved to {args.output}")


if __name__ == "__main__":
    main()
