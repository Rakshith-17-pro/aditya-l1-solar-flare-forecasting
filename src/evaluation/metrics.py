"""Evaluation metrics for nowcasting and forecasting tasks."""

from typing import Dict, List, Tuple

import numpy as np
from sklearn.metrics import accuracy_score, confusion_matrix, f1_score, precision_score, recall_score


def compute_classification_metrics(
    y_true: np.ndarray,
    y_pred: np.ndarray,
    labels: List[str] = None,
) -> Dict[str, float]:
    """Compute comprehensive classification metrics.

    Args:
        y_true: Ground truth labels (0=quiet, 1=C, 2=M, 3=X).
        y_pred: Predicted labels.
        labels: Class name mapping.

    Returns:
        Dictionary of metrics.
    """
    labels = labels or ["Quiet", "C-class", "M-class", "X-class"]
    return {
        "accuracy": float(accuracy_score(y_true, y_pred)),
        "f1_macro": float(f1_score(y_true, y_pred, average="macro")),
        "f1_weighted": float(f1_score(y_true, y_pred, average="weighted")),
        "precision_macro": float(precision_score(y_true, y_pred, average="macro", zero_division=0)),
        "recall_macro": float(recall_score(y_true, y_pred, average="macro", zero_division=0)),
        "confusion_matrix": confusion_matrix(y_true, y_pred).tolist(),
    }


def compute_detection_latency(
    detection_times: np.ndarray,
    onset_times: np.ndarray,
) -> Dict[str, float]:
    """Compute detection latency for nowcasting.

    Args:
        detection_times: Array of times when the model detected a flare.
        onset_times: Array of ground truth flare onset times.

    Returns:
        Dictionary {mean_latency, median_latency, std_latency}.
    """
    latencies = []
    for onset in onset_times:
        later_detections = detection_times[detection_times >= onset]
        if len(later_detections) > 0:
            latencies.append(later_detections[0] - onset)

    if not latencies:
        return {"mean_latency": float("nan"), "median_latency": float("nan"), "std_latency": float("nan")}

    return {
        "mean_latency": float(np.mean(latencies)),
        "median_latency": float(np.median(latencies)),
        "std_latency": float(np.std(latencies)),
    }


def compute_peak_flux_error(
    predicted_flux: np.ndarray,
    true_flux: np.ndarray,
) -> Dict[str, float]:
    """Compute error metrics for peak flux forecasting.

    Args:
        predicted_flux: Predicted peak flux values.
        true_flux: True peak flux values.

    Returns:
        Dictionary {mae, rmse, mape}.
    """
    mae = np.mean(np.abs(predicted_flux - true_flux))
    rmse = np.sqrt(np.mean((predicted_flux - true_flux) ** 2))
    mape = np.mean(np.abs((true_flux - predicted_flux) / (true_flux + 1e-10))) * 100

    return {"mae": float(mae), "rmse": float(rmse), "mape": float(mape)}


def heidke_skill_score(y_true: np.ndarray, y_pred: np.ndarray) -> float:
    """Heidke Skill Score (HSS).

    Measures the accuracy of predictions relative to random chance.
    HSS = 1 for perfect forecast, 0 for no skill, negative for worse than random.

    Args:
        y_true: Binary ground truth (flare / no-flare).
        y_pred: Binary predictions.

    Returns:
        HSS value.
    """
    cm = confusion_matrix(y_true, y_pred)
    if cm.shape != (2, 2):
        # Multi-class: compute per-class HSS and average
        scores = []
        for c in range(cm.shape[0]):
            binary_true = (y_true == c).astype(int)
            binary_pred = (y_pred == c).astype(int)
            scores.append(heidke_skill_score(binary_true, binary_pred))
        return float(np.mean(scores))

    tn, fp, fn, tp = cm.ravel()
    total = tn + fp + fn + tp
    correct = tn + tp
    expected_correct = ((tn + fp) * (tn + fn) + (fn + tp) * (fp + tp)) / total
    denominator = total - expected_correct
    if denominator == 0:
        return 0.0
    return float((correct - expected_correct) / denominator)


def true_skill_score(y_true: np.ndarray, y_pred: np.ndarray) -> float:
    """True Skill Score (TSS) / Hanssen-Kuipers Discriminant.

    TSS = TPR - FPR, ranges from -1 to 1. 1 = perfect, 0 = no skill.

    Args:
        y_true: Binary ground truth (flare / no-flare).
        y_pred: Binary predictions.

    Returns:
        TSS value.
    """
    cm = confusion_matrix(y_true, y_pred)
    if cm.shape != (2, 2):
        scores = []
        for c in range(cm.shape[0]):
            binary_true = (y_true == c).astype(int)
            binary_pred = (y_pred == c).astype(int)
            scores.append(true_skill_score(binary_true, binary_pred))
        return float(np.mean(scores))

    tn, fp, fn, tp = cm.ravel()
    tpr = tp / (tp + fn) if (tp + fn) > 0 else 0.0
    fpr = fp / (fp + tn) if (fp + tn) > 0 else 0.0
    return float(tpr - fpr)
