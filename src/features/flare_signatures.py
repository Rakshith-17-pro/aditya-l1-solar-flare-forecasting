"""Flare-specific signature extraction from combined SXR + HXR lightcurves."""

import numpy as np


def compute_rise_rate(
    flux: np.ndarray,
    window: int = 10,
) -> np.ndarray:
    """Compute the rate of flux rise over a sliding window.

    A sharp rise in HXR flux is a key early indicator of flare onset.

    Args:
        flux: Time-series flux array (time,).
        window: Number of time steps for gradient computation.

    Returns:
        Array of rise rates.
    """
    gradient = np.gradient(flux)
    # Smooth gradient over window
    kernel = np.ones(window) / window
    return np.convolve(gradient, kernel, mode="same")


def detect_hxr_spikes(
    flux: np.ndarray,
    threshold_factor: float = 3.0,
    min_spacing: int = 10,
) -> np.ndarray:
    """Detect impulsive spikes in HXR lightcurves.

    Hard X-ray emission is characterized by rapid, spiky variations at flare onset.
    This function identifies spike events relative to a running baseline.

    Args:
        flux: HXR flux time-series.
        threshold_factor: Multiple of local MAD to use as threshold.
        min_spacing: Minimum time steps between distinct spikes.

    Returns:
        Boolean array marking spike positions.
    """
    # Compute running median baseline
    baseline = np.zeros_like(flux)
    half_window = 50
    for t in range(len(flux)):
        lo = max(0, t - half_window)
        hi = min(len(flux), t + half_window)
        baseline[t] = np.median(flux[lo:hi])

    # Compute running MAD as robust estimate of noise
    mad = np.median(np.abs(flux - baseline))
    threshold = threshold_factor * mad

    # Detect spikes above threshold
    spikes = (flux - baseline) > threshold

    # Enforce minimum spacing
    spike_indices = np.where(spikes)[0]
    if len(spike_indices) > 1:
        diffs = np.diff(spike_indices)
        keep = np.ones(len(spike_indices), dtype=bool)
        for i in range(1, len(spike_indices)):
            if spike_indices[i] - spike_indices[i - 1] < min_spacing:
                keep[i] = False
        result = np.zeros_like(spikes)
        result[spike_indices[keep]] = True
        return result

    return spikes


def compute_flux_ratio(
    solexs_flux: np.ndarray,
    hel1os_flux: np.ndarray,
) -> np.ndarray:
    """Compute the SXR/HXR flux ratio.

    The ratio of soft to hard X-ray flux provides insight into the
    thermal vs. non-thermal emission components during a flare.

    Args:
        solexs_flux: SoLEXS soft X-ray flux.
        hel1os_flux: HEL1OS hard X-ray flux.

    Returns:
        Ratio array (handles division by zero).
    """
    eps = 1e-10
    return solexs_flux / (hel1os_flux + eps)
