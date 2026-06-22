"""Preprocessing utilities for lightcurve data."""

from typing import Optional, Tuple

import numpy as np

try:
    from scipy import ndimage
except ImportError:  # pragma: no cover - fallback for minimal environments
    ndimage = None


def normalize_flux(
    flux: np.ndarray,
    method: str = "minmax",
    eps: float = 1e-10,
) -> np.ndarray:
    """Normalize flux values.

    Args:
        flux: Raw flux array (time x energy_bins).
        method: 'minmax' or 'zscore'.
        eps: Small constant to avoid division by zero.

    Returns:
        Normalized flux array.
    """
    if method == "minmax":
        f_min = flux.min(axis=0, keepdims=True)
        f_max = flux.max(axis=0, keepdims=True)
        return (flux - f_min) / (f_max - f_min + eps)
    elif method == "zscore":
        mean = flux.mean(axis=0, keepdims=True)
        std = flux.std(axis=0, keepdims=True)
        return (flux - mean) / (std + eps)
    else:
        raise ValueError(f"Unknown normalization method: {method}")


def resample_to_cadence(
    time: np.ndarray,
    flux: np.ndarray,
    target_cadence: float = 1.0,
) -> Tuple[np.ndarray, np.ndarray]:
    """Resample lightcurve to a uniform cadence.

    Args:
        time: Original time stamps (seconds).
        flux: Original flux values.
        target_cadence: Desired time step in seconds.

    Returns:
        (uniform_time, resampled_flux) tuple.
    """
    uniform_time = np.arange(time[0], time[-1], target_cadence)
    resampled_flux = np.zeros((len(uniform_time), flux.shape[1]))
    for i in range(flux.shape[1]):
        resampled_flux[:, i] = np.interp(uniform_time, time, flux[:, i])
    return uniform_time, resampled_flux


def apply_gaussian_filter(
    flux: np.ndarray,
    sigma: float = 2.0,
) -> np.ndarray:
    """Apply Gaussian smoothing to reduce high-frequency noise.

    Args:
        flux: Flux array.
        sigma: Standard deviation of the Gaussian kernel.

    Returns:
        Smoothed flux array.
    """
    if ndimage is not None:
        return ndimage.gaussian_filter1d(flux, sigma=sigma, axis=0)

    # Lightweight fallback when scipy is unavailable. This is not a true
    # Gaussian, but preserves the preprocessing contract for smoke tests and
    # minimal runtime environments.
    radius = max(1, int(round(2 * sigma)))
    kernel = np.ones(2 * radius + 1, dtype=float)
    kernel /= kernel.sum()
    padded = np.pad(flux, ((radius, radius), (0, 0)), mode="edge")
    smoothed = np.empty_like(flux, dtype=float)
    for col in range(flux.shape[1]):
        smoothed[:, col] = np.convolve(padded[:, col], kernel, mode="valid")
    return smoothed


def preprocess_lightcurves(
    solexs_flux: np.ndarray,
    hel1os_flux: np.ndarray,
    normalize: bool = True,
    smooth: bool = True,
    sigma: float = 2.0,
    method: str = "minmax",
) -> Tuple[np.ndarray, np.ndarray]:
    """End-to-end preprocessing pipeline for combined lightcurves.

    Args:
        solexs_flux: Raw SoLEXS flux.
        hel1os_flux: Raw HEL1OS flux.
        normalize: Whether to normalize flux.
        smooth: Whether to apply Gaussian smoothing.
        sigma: Smoothing kernel width.
        method: Normalization method.

    Returns:
        (processed_solexs, processed_hel1os) tuple.
    """
    if smooth:
        solexs_flux = apply_gaussian_filter(solexs_flux, sigma)
        hel1os_flux = apply_gaussian_filter(hel1os_flux, sigma)

    if normalize:
        solexs_flux = normalize_flux(solexs_flux, method)
        hel1os_flux = normalize_flux(hel1os_flux, method)

    return solexs_flux, hel1os_flux
