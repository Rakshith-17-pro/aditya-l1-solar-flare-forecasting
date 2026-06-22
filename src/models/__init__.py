"""Model definitions for solar flare nowcasting and forecasting."""

from .baselines import ThresholdNowcaster, FluxRiseForecaster
from .cnn import CNN1D
from .lstm import LSTMClassifier, LSTMForecaster
from .transformer import FlareTransformer

__all__ = [
    "ThresholdNowcaster",
    "FluxRiseForecaster",
    "CNN1D",
    "LSTMClassifier",
    "LSTMForecaster",
    "FlareTransformer",
]
