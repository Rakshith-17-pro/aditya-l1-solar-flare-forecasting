"""Transformer-based model for flare nowcasting and forecasting."""

import math

import torch
import torch.nn as nn


class PositionalEncoding(nn.Module):
    """Sinusoidal positional encoding for transformer input."""

    def __init__(self, d_model: int, max_len: int = 5000):
        super().__init__()
        pe = torch.zeros(max_len, d_model)
        position = torch.arange(0, max_len, dtype=torch.float).unsqueeze(1)
        div_term = torch.exp(
            torch.arange(0, d_model, 2).float() * (-math.log(10000.0) / d_model)
        )
        pe[:, 0::2] = torch.sin(position * div_term)
        pe[:, 1::2] = torch.cos(position * div_term)
        pe = pe.unsqueeze(0)  # (1, max_len, d_model)
        self.register_buffer("pe", pe)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return x + self.pe[:, : x.size(1), :]


class FlareTransformer(nn.Module):
    """Transformer encoder for solar flare time-series.

    Processes concatenated SoLEXS + HEL1OS channels through
    a transformer encoder with classification head.
    """

    def __init__(
        self,
        input_size: int = 8,
        d_model: int = 128,
        nhead: int = 4,
        num_layers: int = 4,
        dim_feedforward: int = 512,
        n_classes: int = 4,
        dropout: float = 0.3,
        max_len: int = 2000,
    ):
        super().__init__()
        self.input_proj = nn.Linear(input_size, d_model)
        self.pos_encoder = PositionalEncoding(d_model, max_len)
        encoder_layer = nn.TransformerEncoderLayer(
            d_model=d_model,
            nhead=nhead,
            dim_feedforward=dim_feedforward,
            dropout=dropout,
            activation="gelu",
            batch_first=True,
        )
        self.transformer_encoder = nn.TransformerEncoder(
            encoder_layer, num_layers=num_layers
        )
        self.classifier = nn.Sequential(
            nn.Linear(d_model, 64),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(64, n_classes),
        )

    def forward(self, solexs: torch.Tensor, hel1os: torch.Tensor) -> torch.Tensor:
        """Forward pass.

        Args:
            solexs: SoLEXS flux (batch, time, n_solexs_channels).
            hel1os: HEL1OS flux (batch, time, n_hel1os_channels).

        Returns:
            Logits (batch, n_classes).
        """
        x = torch.cat([solexs, hel1os], dim=-1)  # (B, T, C)
        x = self.input_proj(x)                   # (B, T, d_model)
        x = self.pos_encoder(x)
        x = self.transformer_encoder(x)          # (B, T, d_model)
        # Use [CLS] token equivalent — mean pool over time
        x = x.mean(dim=1)                        # (B, d_model)
        return self.classifier(x)                # (B, n_classes)
