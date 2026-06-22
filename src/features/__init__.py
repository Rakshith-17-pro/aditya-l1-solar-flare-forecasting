"""Feature engineering and flare signature extraction modules."""

from .extractors import (
    extract_statistical_features,
    extract_spectral_features,
    extract_time_domain_features,
)
from .flare_signatures import (
    compute_rise_rate,
    detect_hxr_spikes,
    compute_flux_ratio,
)

__all__ = [
    "extract_statistical_features",
    "extract_spectral_features",
    "extract_time_domain_features",
    "compute_rise_rate",
    "detect_hxr_spikes",
    "compute_flux_ratio",
]
