#!/usr/bin/env python3
"""Run inference on new data using a trained model."""

import argparse

import torch
from loguru import logger


def parse_args():
    parser = argparse.ArgumentParser(description="Run inference with a trained model")
    parser.add_argument("--checkpoint", type=str, required=True,
                        help="Path to model checkpoint")
    parser.add_argument("--input", type=str, required=True,
                        help="Path to input data")
    parser.add_argument("--output", type=str, default="predictions.csv",
                        help="Path to save predictions")
    parser.add_argument("--device", type=str, default="cuda" if torch.cuda.is_available() else "cpu",
                        help="Device to use")
    return parser.parse_args()


def main():
    args = parse_args()
    logger.info(f"Running inference with model from {args.checkpoint}")

    # TODO: Implement inference pipeline
    logger.warning("Inference scaffold — replace with actual prediction logic.")

    logger.info(f"Predictions saved to {args.output}")


if __name__ == "__main__":
    main()
