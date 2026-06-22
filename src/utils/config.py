"""Configuration management."""

from typing import Any, Dict

import yaml


def load_config(path: str) -> Dict[str, Any]:
    """Load a YAML configuration file.

    Args:
        path: Path to the YAML config file.

    Returns:
        Dictionary of configuration parameters.
    """
    with open(path, "r") as f:
        config = yaml.safe_load(f)
    return config
