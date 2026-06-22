"""LSTM-based models for flare nowcasting and forecasting."""

import torch
import torch.nn as nn


class LSTMClassifier(nn.Module):
    """LSTM-based nowcasting model.

    Processes the combined SoLEXS + HEL1OS time-series through
    stacked LSTMs and produces a flare class prediction at each step.
    """

    def __init__(
        self,
        input_size: int = 8,
        hidden_size: int = 128,
        num_layers: int = 2,
        n_classes: int = 4,
        dropout: float = 0.3,
        bidirectional: bool = True,
    ):
        super().__init__()
        self.lstm = nn.LSTM(
            input_size=input_size,
            hidden_size=hidden_size,
            num_layers=num_layers,
            dropout=dropout if num_layers > 1 else 0,
            bidirectional=bidirectional,
            batch_first=True,
        )
        lstm_out = hidden_size * (2 if bidirectional else 1)
        self.classifier = nn.Sequential(
            nn.Linear(lstm_out, 64),
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
        lstm_out, (h_n, _) = self.lstm(x)
        # Use final hidden states from both directions
        out = lstm_out[:, -1, :]  # (B, hidden * 2)
        return self.classifier(out)


class LSTMForecaster(nn.Module):
    """LSTM-based forecasting model.

    Takes the pre-peak time-series and predicts the eventual peak flux
    (regression) and flare class (classification).
    """

    def __init__(
        self,
        input_size: int = 8,
        hidden_size: int = 128,
        num_layers: int = 2,
        dropout: float = 0.3,
    ):
        super().__init__()
        self.lstm = nn.LSTM(
            input_size=input_size,
            hidden_size=hidden_size,
            num_layers=num_layers,
            dropout=dropout if num_layers > 1 else 0,
            batch_first=True,
        )
        self.peak_regressor = nn.Sequential(
            nn.Linear(hidden_size, 64),
            nn.ReLU(),
            nn.Linear(64, 1),
        )
        self.class_classifier = nn.Sequential(
            nn.Linear(hidden_size, 64),
            nn.ReLU(),
            nn.Linear(64, 4),
        )

    def forward(self, solexs: torch.Tensor, hel1os: torch.Tensor) -> tuple:
        """Forward pass.

        Args:
            solexs: Pre-peak SoLEXS flux (batch, time, n_solexs_channels).
            hel1os: Pre-peak HEL1OS flux (batch, time, n_hel1os_channels).

        Returns:
            (predicted_peak_flux, class_logits) tuple.
        """
        x = torch.cat([solexs, hel1os], dim=-1)
        _, (h_n, _) = self.lstm(x)
        out = h_n[-1]  # last layer hidden state
        peak_flux = self.peak_regressor(out).squeeze(-1)
        class_logits = self.class_classifier(out)
        return peak_flux, class_logits
