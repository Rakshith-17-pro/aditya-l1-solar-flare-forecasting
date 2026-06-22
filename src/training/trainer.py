"""Generic trainer for PyTorch models."""

from typing import Callable, Optional

import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from tqdm import tqdm


class Trainer:
    """General-purpose PyTorch model trainer.

    Handles the training loop, validation, checkpointing, and early stopping.
    """

    def __init__(
        self,
        model: nn.Module,
        train_loader: DataLoader,
        val_loader: DataLoader,
        optimizer: torch.optim.Optimizer,
        criterion: nn.Module,
        device: str = "cuda",
        scheduler: Optional[Callable] = None,
        max_epochs: int = 100,
        patience: int = 10,
        checkpoint_path: str = "best_model.pt",
    ):
        self.model = model.to(device)
        self.train_loader = train_loader
        self.val_loader = val_loader
        self.optimizer = optimizer
        self.criterion = criterion
        self.device = device
        self.scheduler = scheduler
        self.max_epochs = max_epochs
        self.patience = patience
        self.checkpoint_path = checkpoint_path

        self.best_val_loss = float("inf")
        self.epochs_without_improvement = 0
        self.history = {"train_loss": [], "val_loss": [], "val_accuracy": []}

    def train(self) -> dict:
        """Run the full training loop.

        Returns:
            Training history dictionary.
        """
        for epoch in range(1, self.max_epochs + 1):
            train_loss = self._train_epoch()
            val_loss, val_acc = self._validate()

            self.history["train_loss"].append(train_loss)
            self.history["val_loss"].append(val_loss)
            self.history["val_accuracy"].append(val_acc)

            if self.scheduler:
                self.scheduler.step(val_loss)

            print(
                f"Epoch {epoch:3d}/{self.max_epochs} | "
                f"Train Loss: {train_loss:.4f} | "
                f"Val Loss: {val_loss:.4f} | "
                f"Val Acc: {val_acc:.4f}"
            )

            # Checkpoint
            if val_loss < self.best_val_loss:
                self.best_val_loss = val_loss
                self.epochs_without_improvement = 0
                torch.save(self.model.state_dict(), self.checkpoint_path)
            else:
                self.epochs_without_improvement += 1

            # Early stopping
            if self.epochs_without_improvement >= self.patience:
                print(f"Early stopping triggered after {epoch} epochs.")
                break

        # Restore best weights
        self.model.load_state_dict(torch.load(self.checkpoint_path))
        return self.history

    def _train_epoch(self) -> float:
        self.model.train()
        total_loss = 0.0
        for batch in tqdm(self.train_loader, desc="Training", leave=False):
            solexs = batch["solexs"].to(self.device)
            hel1os = batch["hel1os"].to(self.device)
            labels = batch["label"].to(self.device)

            self.optimizer.zero_grad()
            outputs = self.model(solexs, hel1os)
            loss = self.criterion(outputs, labels)
            loss.backward()
            self.optimizer.step()

            total_loss += loss.item()

        return total_loss / len(self.train_loader)

    def _validate(self) -> tuple:
        self.model.eval()
        total_loss = 0.0
        correct = 0
        total = 0

        with torch.no_grad():
            for batch in tqdm(self.val_loader, desc="Validating", leave=False):
                solexs = batch["solexs"].to(self.device)
                hel1os = batch["hel1os"].to(self.device)
                labels = batch["label"].to(self.device)

                outputs = self.model(solexs, hel1os)
                loss = self.criterion(outputs, labels)

                total_loss += loss.item()
                _, predicted = outputs.max(1)
                total += labels.size(0)
                correct += predicted.eq(labels).sum().item()

        return total_loss / len(self.val_loader), correct / total
