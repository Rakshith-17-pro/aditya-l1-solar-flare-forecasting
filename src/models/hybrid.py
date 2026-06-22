"""Hybrid CNN-LSTM and CNN-Transformer models."""

import torch
import torch.nn as nn


class CNNLSTM(nn.Module):
    """CNN-LSTM hybrid for flare nowcasting.

    Uses CNN layers for local feature extraction followed by
    LSTM for temporal sequence modeling.
    """

    def __init__(
        self,
        n_solexs_channels: int = 4,
        n_hel1os_channels: int = 4,
        cnn_channels: list = None,
        lstm_hidden: int = 128,
        lstm_layers: int = 2,
        n_classes: int = 4,
        dropout: float = 0.3,
    ):
        super().__init__()
        cnn_channels = cnn_channels or [32, 64, 128]
        n_input = n_solexs_channels + n_hel1os_channels

        # CNN feature extractor
        cnn_layers = []
        in_c = n_input
        for out_c in cnn_channels:
            cnn_layers.extend([
                nn.Conv1d(in_c, out_c, kernel_size=7, padding=3),
                nn.BatchNorm1d(out_c),
                nn.ReLU(),
                nn.MaxPool1d(2),
                nn.Dropout(dropout),
            ])
            in_c = out_c
        self.cnn = nn.Sequential(*cnn_layers)

        # LSTM temporal model
        self.lstm = nn.LSTM(
            input_size=cnn_channels[-1],
            hidden_size=lstm_hidden,
            num_layers=lstm_layers,
            dropout=dropout if lstm_layers > 1 else 0,
            batch_first=True,
        )
        self.classifier = nn.Linear(lstm_hidden, n_classes)

    def forward(self, solexs: torch.Tensor, hel1os: torch.Tensor) -> torch.Tensor:
        """Forward pass.

        Args:
            solexs: SoLEXS flux (batch, n_solexs_channels, time).
            hel1os: HEL1OS flux (batch, n_hel1os_channels, time).

        Returns:
            Logits (batch, n_classes).
        """
        x = torch.cat([solexs, hel1os], dim=1)       # (B, C, T)
        x = self.cnn(x)                              # (B, out_c, T')
        x = x.transpose(1, 2)                        # (B, T', out_c)
        lstm_out, _ = self.lstm(x)
        out = lstm_out[:, -1, :]                     # (B, lstm_hidden)
        return self.classifier(out)
