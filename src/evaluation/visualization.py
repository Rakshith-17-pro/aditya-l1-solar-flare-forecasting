"""Visualization utilities for flare events and model predictions."""

import matplotlib.pyplot as plt
import numpy as np


def plot_flare_event(
    solexs_flux: np.ndarray,
    hel1os_flux: np.ndarray,
    annotation: dict = None,
    title: str = "Flare Event",
    save_path: str = None,
):
    """Plot a solar flare event showing SoLEXS and HEL1OS lightcurves.

    Args:
        solexs_flux: SoLEXS soft X-ray flux (time, n_channels).
        hel1os_flux: HEL1OS hard X-ray flux (time, n_channels).
        annotation: Dict with 'onset', 'peak', 'end' time indices.
        title: Plot title.
        save_path: Optional path to save the figure.
    """
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 6), sharex=True)

    time = np.arange(solexs_flux.shape[0])

    # SoLEXS (SXR)
    if solexs_flux.ndim == 1:
        ax1.plot(time, solexs_flux, "b-", label="SoLEXS (SXR)")
    else:
        for i in range(solexs_flux.shape[1]):
            ax1.plot(time, solexs_flux[:, i], label=f"SoLEXS bin {i}")
    ax1.set_ylabel("Soft X-ray Flux")
    ax1.set_title(title)
    ax1.legend()
    ax1.grid(True, alpha=0.3)

    # HEL1OS (HXR)
    if hel1os_flux.ndim == 1:
        ax2.plot(time, hel1os_flux, "r-", label="HEL1OS (HXR)")
    else:
        for i in range(hel1os_flux.shape[1]):
            ax2.plot(time, hel1os_flux[:, i], label=f"HEL1OS bin {i}")
    ax2.set_xlabel("Time (seconds)")
    ax2.set_ylabel("Hard X-ray Flux")
    ax2.legend()
    ax2.grid(True, alpha=0.3)

    # Annotation markers
    if annotation:
            onset = annotation.get("onset")
            peak = annotation.get("peak")
            end = annotation.get("end")
            color = annotation.get("color", "orange")
            for ax in [ax1, ax2]:
                if onset is not None:
                    ax.axvline(onset, color="green", linestyle="--", alpha=0.7, label="Onset")
                if peak is not None:
                    ax.axvline(peak, color=color, linestyle="-.", alpha=0.7, label="Peak")
                if end is not None:
                    ax.axvline(end, color="red", linestyle=":", alpha=0.7, label="End")

    plt.tight_layout()
    if save_path:
        plt.savefig(save_path, dpi=150, bbox_inches="tight")
    plt.show()


def plot_prediction_vs_ground_truth(
    predictions: np.ndarray,
    ground_truth: np.ndarray,
    time: np.ndarray = None,
    title: str = "Predictions vs Ground Truth",
    save_path: str = None,
):
    """Compare model predictions against ground truth labels.

    Args:
        predictions: Model predictions.
        ground_truth: Ground truth labels.
        time: Optional time array.
        title: Plot title.
        save_path: Optional path to save the figure.
    """
    fig, ax = plt.subplots(figsize=(12, 4))
    if time is None:
        time = np.arange(len(ground_truth))

    ax.plot(time, ground_truth, "k-", label="Ground Truth", alpha=0.8)
    ax.plot(time, predictions, "r--", label="Prediction", alpha=0.8)
    ax.set_xlabel("Time")
    ax.set_ylabel("Flare Class")
    ax.set_title(title)
    ax.legend()
    ax.grid(True, alpha=0.3)

    plt.tight_layout()
    if save_path:
        plt.savefig(save_path, dpi=150, bbox_inches="tight")
    plt.show()
