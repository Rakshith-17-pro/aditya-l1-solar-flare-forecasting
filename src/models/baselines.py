"""Baseline models for nowcasting and forecasting.

These serve as minimal reference implementations that participants
should aim to outperform.
"""

import numpy as np


class ThresholdNowcaster:
    """Simple threshold-based nowcasting baseline.

    Detects flares by comparing the HXR flux against a running baseline.
    When the ratio exceeds a threshold, a flare is declared.
    """

    def __init__(self, threshold: float = 3.0, baseline_window: int = 60):
        self.threshold = threshold
        self.baseline_window = baseline_window

    def predict(self, hel1os_flux: np.ndarray) -> np.ndarray:
        """Predict flare activity for each time step.

        Args:
            hel1os_flux: HEL1OS hard X-ray flux (time,).

        Returns:
            Binary array indicating flare detection.
        """
        detections = np.zeros(len(hel1os_flux), dtype=bool)
        for t in range(self.baseline_window, len(hel1os_flux)):
            baseline = np.median(hel1os_flux[t - self.baseline_window : t])
            if baseline > 0 and (hel1os_flux[t] / baseline) > self.threshold:
                detections[t] = True
        return detections


class FluxRiseForecaster:
    """Simple flux-rise-rate-based forecasting baseline.

    Predicts flare class based on the rate of rise of the SXR flux
    during the early phase of the event.
    """

    # Flux rise rate thresholds for each class (empirical)
    CLASS_THRESHOLDS = {
        "C": (1.5, 5.0),
        "M": (5.0, 20.0),
        "X": (20.0, float("inf")),
    }

    def __init__(self, window: int = 30):
        self.window = window

    def predict(self, solexs_flux: np.ndarray) -> str:
        """Predict flare class from the rising SXR flux.

        Args:
            solexs_flux: SoLEXS soft X-ray flux (time,) during pre-peak phase.

        Returns:
            Predicted flare class: "C", "M", or "X".
        """
        if len(solexs_flux) < self.window:
            return "C"
        rise_rate = (solexs_flux[-1] - solexs_flux[-self.window]) / self.window
        for cls, (lo, hi) in self.CLASS_THRESHOLDS.items():
            if lo <= rise_rate < hi:
                return cls
        return "C"
