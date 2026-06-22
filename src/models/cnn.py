"""1D-CNN model for flare nowcasting and forecasting."""

import torch
import torch.nn as nn


class CNN1D(nn.Module):
    """1D Convolutional Neural Network for multi-channel time-series.

    Processes co-temporal SoLEXS and HEL1OS flux channels through
    stacked 1D convolutions for flare classification.
    """

    def __init__(
        self,
        n_solexs_channels: int = 4,
        n_hel1os_channels: int = 4,
        n_classes: int = 4,  # quiet, C, M, X
        hidden_dims: list = None,
        kernel_size: int = 7,
        dropout: float = 0.3,
    ):
        super().__init__()
        hidden_dims = hidden_dims or [32, 64, 128]
        n_input_channels = n_solexs_channels + n_hel1os_channels

        layers = []
        in_channels = n_input_channels
        for h_dim in hidden_dims:
            layers.extend([
                nn.Conv1d(in_channels, h_dim, kernel_size, padding=kernel_size // 2),
                nn.BatchNorm1d(h_dim),
                nn.ReLU(),
                nn.MaxPool1d(2),
                nn.Dropout(dropout),
            ])
            in_channels = h_dim

        self.conv_block = nn.Sequential(*layers)
        self.adaptive_pool = nn.AdaptiveAvgPool1d(1)
        self.classifier = nn.Linear(in_channels, n_classes)

    def forward(self, solexs: torch.Tensor, hel1os: torch.Tensor) -> torch.Tensor:
        """Forward pass.

        Args:
            solexs: SoLEXS flux (batch, n_solexs_channels, time).
            hel1os: HEL1OS flux (batch, n_hel1os_channels, time).

        Returns:
            Logits (batch, n_classes).
        """
        x = torch.cat([solexs, hel1os], dim=1)  # (B, C, T)
        x = self.conv_block(x)
        x = self.adaptive_pool(x).squeeze(-1)   # (B, C)
        return self.classifier(x)               # (B, n_classes)
