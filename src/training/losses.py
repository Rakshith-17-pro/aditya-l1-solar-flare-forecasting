"""Custom loss functions for imbalanced flare classification."""

import torch
import torch.nn as nn
import torch.nn.functional as F


class FocalLoss(nn.Module):
    """Focal Loss for handling class imbalance.

    Down-weights easy examples and focuses on hard, misclassified ones.
    Particularly useful for rare-event classification like M/X-class flares.
    """

    def __init__(self, alpha: torch.Tensor = None, gamma: float = 2.0, reduction: str = "mean"):
        """
        Args:
            alpha: Class weights (tensor of shape (n_classes,)).
            gamma: Focusing parameter (>=0). Higher values focus more on hard examples.
            reduction: 'mean' or 'sum'.
        """
        super().__init__()
        self.alpha = alpha
        self.gamma = gamma
        self.reduction = reduction

    def forward(self, logits: torch.Tensor, targets: torch.Tensor) -> torch.Tensor:
        ce_loss = F.cross_entropy(logits, targets, reduction="none")
        pt = torch.exp(-ce_loss)
        focal_loss = (1 - pt) ** self.gamma * ce_loss

        if self.alpha is not None:
            alpha_t = self.alpha.to(logits.device)[targets]
            focal_loss = alpha_t * focal_loss

        if self.reduction == "mean":
            return focal_loss.mean()
        elif self.reduction == "sum":
            return focal_loss.sum()
        return focal_loss


class WeightedCrossEntropyLoss(nn.Module):
    """Weighted Cross-Entropy for imbalanced datasets."""

    def __init__(self, class_weights: list = None):
        super().__init__()
        self.class_weights = (
            torch.tensor(class_weights, dtype=torch.float32) if class_weights else None
        )

    def forward(self, logits: torch.Tensor, targets: torch.Tensor) -> torch.Tensor:
        return F.cross_entropy(logits, targets, weight=self.class_weights.to(logits.device) if self.class_weights is not None else None)
