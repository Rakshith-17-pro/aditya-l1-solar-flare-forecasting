"""Data augmentation strategies for lightcurve data.

Augmentations help improve model robustness by creating synthetic variations
of the limited set of annotated flare events.
"""

import numpy as np


def add_gaussian_noise(
    solexs: np.ndarray,
    hel1os: np.ndarray,
    noise_level: float = 0.01,
) -> tuple:
    """Add Gaussian noise to simulate instrument noise.

    Args:
        solexs: SoLEXS flux array.
        hel1os: HEL1OS flux array.
        noise_level: Standard deviation of noise as fraction of signal range.

    Returns:
        (noisy_solexs, noisy_hel1os) tuple.
    """
    s_range = solexs.max() - solexs.min()
    h_range = hel1os.max() - hel1os.min()
    solexs_noise = np.random.normal(0, noise_level * s_range, solexs.shape)
    hel1os_noise = np.random.normal(0, noise_level * h_range, hel1os.shape)
    return solexs + solexs_noise, hel1os + hel1os_noise


def time_warp(
    solexs: np.ndarray,
    hel1os: np.ndarray,
    stretch_factor: float = 1.1,
) -> tuple:
    """Apply a random time-stretching to simulate temporal variability.

    Args:
        solexs: SoLEXS flux array.
        hel1os: HEL1OS flux array.
        stretch_factor: Maximum stretch/compress factor.

    Returns:
        (warped_solexs, warped_hel1os) tuple.
    """
    T = solexs.shape[0]
    factor = np.random.uniform(1.0 / stretch_factor, stretch_factor)
    new_T = min(int(T * factor), len(solexs))
    indices = np.linspace(0, T - 1, new_T).astype(int)
    return solexs[indices], hel1os[indices]


def amplitude_scale(
    solexs: np.ndarray,
    hel1os: np.ndarray,
    scale_range: tuple = (0.8, 1.2),
) -> tuple:
    """Randomly scale amplitude to simulate flux variability.

    Args:
        solexs: SoLEXS flux array.
        hel1os: HEL1OS flux array.
        scale_range: (min_scale, max_scale) for uniform sampling.

    Returns:
        (scaled_solexs, scaled_hel1os) tuple.
    """
    s_scale = np.random.uniform(*scale_range)
    h_scale = np.random.uniform(*scale_range)
    return solexs * s_scale, hel1os * h_scale
