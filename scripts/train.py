#!/usr/bin/env python3
"""Train a deep learning model for flare nowcasting/forecasting."""

import argparse

import torch
import torch.nn as nn
from loguru import logger
from torch.utils.data import DataLoader

from src.data.dataset import FlareDataset
from src.models import CNN1D, LSTMClassifier, FlareTransformer
from src.training import FocalLoss, Trainer
from src.utils.config import load_config


MODEL_REGISTRY = {
    "cnn1d": CNN1D,
    "lstm": LSTMClassifier,
    "transformer": FlareTransformer,
}


def parse_args():
    parser = argparse.ArgumentParser(description="Train a flare nowcasting/forecasting model")
    parser.add_argument("--config", type=str, required=True,
                        help="Path to YAML configuration file")
    parser.add_argument("--model", type=str, default="lstm", choices=MODEL_REGISTRY.keys(),
                        help="Model architecture")
    parser.add_argument("--device", type=str, default="cuda" if torch.cuda.is_available() else "cpu",
                        help="Device to use")
    return parser.parse_args()


def main():
    args = parse_args()
    cfg = load_config(args.config)
    logger.info(f"Loaded configuration from {args.config}")

    # Data
    train_dataset = FlareDataset(
        data_path=cfg["data"]["path"],
        window_size=cfg["data"]["window_size"],
        stride=cfg["data"]["stride"],
    )
    val_dataset = FlareDataset(
        data_path=cfg["data"]["val_path"],
        window_size=cfg["data"]["window_size"],
        stride=cfg["data"]["stride"],
    )

    train_loader = DataLoader(
        train_dataset,
        batch_size=cfg["training"]["batch_size"],
        shuffle=True,
        num_workers=cfg["dataloader"]["num_workers"],
        pin_memory=cfg["dataloader"]["pin_memory"],
    )
    val_loader = DataLoader(
        val_dataset,
        batch_size=cfg["training"]["batch_size"],
        shuffle=False,
        num_workers=cfg["dataloader"]["num_workers"],
        pin_memory=cfg["dataloader"]["pin_memory"],
    )

    logger.info(f"Train samples: {len(train_dataset)}, Val samples: {len(val_dataset)}")

    # Model
    model_class = MODEL_REGISTRY[args.model]
    model = model_class(**cfg["model"])
    logger.info(f"Model: {model_class.__name__}")

    # Optimizer and loss
    optimizer = torch.optim.AdamW(
        model.parameters(),
        lr=cfg["training"]["learning_rate"],
        weight_decay=cfg["training"]["weight_decay"],
    )
    criterion = FocalLoss(gamma=2.0)

    # Trainer
    trainer = Trainer(
        model=model,
        train_loader=train_loader,
        val_loader=val_loader,
        optimizer=optimizer,
        criterion=criterion,
        device=args.device,
        max_epochs=cfg["training"]["max_epochs"],
        patience=cfg["training"]["patience"],
    )

    history = trainer.train()
    logger.info(f"Training complete. Best val loss: {trainer.best_val_loss:.4f}")


if __name__ == "__main__":
    main()
