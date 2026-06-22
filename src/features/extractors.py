"""Feature extraction utilities for time-series data."""

import numpy as np
from scipy import signal, stats


def extract_statistical_features(flux: np.ndarray) -> dict:
    """Extract statistical descriptors from a flux time-series.

    Args:
        flux: Shape (time, energy_bins) or (time,).

    Returns:
        Dictionary of statistical features.
    """
    if flux.ndim == 1:
        flux = flux[:, np.newaxis]

    features = {}
    for i in range(flux.shape[1]):
        col = flux[:, i]
        features.update({
            f"mean_bin{i}": float(np.mean(col)),
            f"std_bin{i}": float(np.std(col)),
            f"skew_bin{i}": float(stats.skew(col)),
            f"kurtosis_bin{i}": float(stats.kurtosis(col)),
            f"min_bin{i}": float(np.min(col)),
            f"max_bin{i}": float(np.max(col)),
            f"p95_bin{i}": float(np.percentile(col, 95)),
            f"p05_bin{i}": float(np.percentile(col, 5)),
        })
    return features


def extract_spectral_features(flux: np.ndarray, fs: float = 1.0) -> dict:
    """Extract spectral/FFT-based features.

    Args:
        flux: Shape (time, energy_bins).
        fs: Sampling frequency (Hz).

    Returns:
        Dictionary of spectral features.
    """
    if flux.ndim == 1:
        flux = flux[:, np.newaxis]

    features = {}
    for i in range(flux.shape[1]):
        f, Pxx = signal.welch(flux[:, i], fs=fs, nperseg=min(256, len(flux[:, i])))
        total_power = np.sum(Pxx)
        features.update({
            f"total_power_bin{i}": float(total_power),
            f"peak_freq_bin{i}": float(f[np.argmax(Pxx)]),
            f"peak_power_bin{i}": float(np.max(Pxx)),
        })
        if total_power > 0:
            cumsum = np.cumsum(Pxx) / total_power
            features[f"median_freq_bin{i}"] = float(f[np.searchsorted(cumsum, 0.5)])
    return features


def extract_time_domain_features(flux: np.ndarray) -> dict:
    """Extract time-domain features like zero-crossings, AUC, etc.

    Args:
        flux: Shape (time, energy_bins).

    Returns:
        Dictionary of time-domain features.
    """
    if flux.ndim == 1:
        flux = flux[:, np.newaxis]

    features = {}
    for i in range(flux.shape[1]):
        col = flux[:, i]
        features.update({
            f"auc_bin{i}": float(np.trapz(col)),
            f"rise_rate_bin{i}": float(np.gradient(col).max()),
            f"decay_rate_bin{i}": float(np.gradient(col).min()),
        })
    return features
