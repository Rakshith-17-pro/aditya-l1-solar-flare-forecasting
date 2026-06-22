# ☀️ Challenge 15: Solar Flare Forecasting & Nowcasting with Aditya-L1

> **Forecasting and/or Nowcasting of Solar Flares using combined Soft and Hard X-ray data from Aditya-L1**
>
> ISRO Hackathon — Space Weather Track

---

## Table of Contents

- [Overview](#overview)
- [Scientific Background](#scientific-background)
- [Problem Statement](#problem-statement)
- [Mission & Payloads](#mission--payloads)
  - [Aditya-L1 Mission](#aditya-l1-mission)
  - [SoLEXS (Soft X-ray)](#solexs-soft-x-ray)
  - [HEL1OS (Hard X-ray)](#hel1os-hard-x-ray)
- [Objectives](#objectives)
  - [Nowcasting Task](#nowcasting-task)
  - [Forecasting Task](#forecasting-task)
- [Dataset](#dataset)
- [Evaluation Metrics](#evaluation-metrics)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Quick Start](#quick-start)
- [Repository Structure](#repository-structure)
- [Submission Guidelines](#submission-guidelines)
- [Judging Criteria](#judging-criteria)
- [Resources & References](#resources--references)
- [License](#license)

---

## Overview

Solar flares are sudden, intense bursts of electromagnetic radiation originating from the release of magnetic energy stored in the solar atmosphere. These events can trigger severe space weather disruptions that impact Earth-bound satellite communications, GPS navigation systems, and power grid infrastructure. **Anticipating these disruptions is critical for safeguarding modern technological infrastructure.**

This challenge invites participants to build **automated algorithmic pipelines** that leverage the combined time-series data from two X-ray payloads aboard ISRO's **Aditya-L1** mission — the first Indian space-based solar observatory — to **detect (nowcast)** or **predict (forecast)** solar flares.

---

## Scientific Background

### What are Solar Flares?

Solar flares are classified into categories based on their peak soft X-ray flux (1–8 Å) as measured by GOES satellites:

| Class | Peak Flux (W/m²) | Description |
|-------|------------------|-------------|
| **A** | < 10⁻⁷ | Minor |
| **B** | 10⁻⁷ – 10⁻⁶ | Small |
| **C** | 10⁻⁶ – 10⁻⁵ | Moderate |
| **M** | 10⁻⁵ – 10⁻⁴ | Strong — can cause radio blackouts |
| **X** | ≥ 10⁻⁴ | Extreme — major space weather events |

Each class has a logarithmic scale from 1 to 9 (e.g., M5.0 is five times stronger than M1.0). X-class flares beyond X9 have been recorded during extreme solar events.

### Why Soft and Hard X-rays?

- **Soft X-rays (SXR):** Emitted by plasma heated to tens of millions of Kelvin during the flare's impulsive and gradual phases. They provide a smooth, integrated measure of flare energy release.
- **Hard X-rays (HXR):** Produced by high-energy electrons (tens of keV to MeV) accelerated during magnetic reconnection. They exhibit rapid, spiky time profiles and are the earliest observable signature of particle acceleration.

**Combining SXR and HXR** gives a more complete picture of flare onset, evolution, and intensity — enabling both:
- **Nowcasting**: Real-time detection of flares as they happen using the fast-rise signature in HXR.
- **Forecasting**: Predictive models that use precursor patterns in the rising SXR flux and early HXR spikes to anticipate flare magnitude minutes before peak emission.

---

## Mission & Payloads

### Aditya-L1 Mission

ISRO's **Aditya-L1** is India's first dedicated solar mission, placed in a halo orbit around the **Sun-Earth Lagrange Point L1** (1.5 million km from Earth). This vantage point provides continuous, uninterrupted observation of the Sun without occultation.

### SoLEXS (Soft X-ray)

**Solar Low Energy X-ray Spectrometer**

- **Measurement**: Soft X-ray flux in the **1–55 keV** energy range
- **Role**: Tracks the gradual rise and decay of flare thermal emission
- **Cadence**: High temporal resolution (sub-second)
- **Science**: Provides the baseline SXR flux curve used for flare classification

### HEL1OS (Hard X-ray)

**High Energy L1 Orbiting X-ray Spectrometer**

- **Measurement**: Hard X-ray flux in the **10–150 keV** energy range
- **Role**: Captures the impulsive, non-thermal emission from accelerated electrons
- **Cadence**: High temporal resolution
- **Science**: Resolves fast variations at flare onset — a key signature for early nowcasting

---

## Objectives

Participants are required to build a machine learning / signal processing pipeline that ingests **co-temporal time-series data** from both SoLEXS and HEL1OS and performs one or both of the following tasks:

### Nowcasting Task

**Goal**: Detect and classify solar flares in **real-time** as they occur.

- Given a streaming window of SoLEXS + HEL1OS flux values, determine if a flare is in progress.
- If a flare is ongoing, classify its magnitude (C-class, M-class, X-class).
- **Key challenge**: Minimize detection latency while maintaining low false-positive rates.

**Output**: For each time step or window, a tuple `(is_flare: bool, flare_class: str | None, confidence: float)`.

### Forecasting Task

**Goal**: Predict the **peak flux and class** of a solar flare **before it reaches its maximum**.

- Using the early-phase signals from the rising SXR and the initial HXR spikes, forecast the eventual flare magnitude.
- The prediction window is defined as the time from first detectable onset to the expected peak (typically 5–20 minutes for most flares).
- **Key challenge**: Extracting predictive precursors from pre-peak noise and variability.

**Output**: For each detected flare onset, a prediction `(predicted_peak_flux: float, predicted_class: str, lead_time: float, confidence: float)`.

---

## Dataset

The dataset is constructed from archival and simulated Aditya-L1 observations, with annotations derived from co-temporal GOES flare catalogs.

| Component | Description |
|-----------|-------------|
| **SoLEXS Lightcurves** | Time-series of soft X-ray flux in multiple energy bins (1–55 keV) |
| **HEL1OS Lightcurves** | Time-series of hard X-ray flux in multiple energy bins (10–150 keV) |
| **Flare Annotations** | Onset, peak, end times + GOES peak flux + flare class |
| **Quiet-Sun Intervals** | Periods of minimal solar activity (negative samples) |
| **Metadata** | Date/time stamps, energy bin edges, instrument state flags |

Data is provided in **HDF5** or **CSV** format with standardized column naming.

> **Note**: Specific dataset files and download links will be provided upon hackathon registration.

---

## Evaluation Metrics

### Nowcasting Metrics

| Metric | Description |
|--------|-------------|
| **Detection Latency** | Time delay between flare onset and first correct classification |
| **Precision & Recall** | Classification performance for each flare class |
| **F1 Score** | Harmonic mean of precision and recall |
| **False Alarm Rate (FAR)** | Rate of false positive flare detections |
| **Heidke Skill Score (HSS)** | Skill score accounting for correct rejections |

### Forecasting Metrics

| Metric | Description |
|--------|-------------|
| **Peak Flux MAE / RMSE** | Error in predicted peak flux (W/m²) |
| **Classification Accuracy** | Correct assignment of C / M / X class |
| **Lead Time Accuracy** | How early before peak the prediction stabilizes |
| **Peak Time Error** | Absolute error in predicted time of peak flux |
| **True Skill Score (TSS)** | Balanced accuracy for rare-event forecasting |

---

## Getting Started

### Prerequisites

- Python 3.10+
- Git
- (Recommended) A GPU-enabled machine for deep learning models

### Installation

```bash
# Clone the repository
git clone https://github.com/Rakshith-17-pro/aditya-l1-solar-flare-forecasting.git
cd aditya-l1-solar-flare-forecasting

# (Recommended) Create a virtual environment
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt
```

### Quick Start

```python
# Example: Load and visualize a flare event
from src.data import FlareDataset
from src.visualization import plot_flare_event

dataset = FlareDataset("data/raw/sample_event.h5")
event = dataset[0]
plot_flare_event(event["solexs"], event["hel1os"], event["annotation"])
```

```bash
# Run a baseline nowcasting model
python scripts/run_baseline.py --task nowcast --model threshold

# Run a baseline forecasting model
python scripts/run_baseline.py --task forecast --model cnn_lstm
```

---

## Repository Structure

```
aditya-l1-solar-flare-forecasting/
├── README.md                      # This file
├── LICENSE
├── requirements.txt               # Python dependencies
├── setup.py                       # Package installation
│
├── data/                          # Dataset directory
│   ├── raw/                       # Original, immutable data
│   ├── processed/                 # Cleaned and preprocessed data
│   └── external/                  # External reference data (GOES catalogs, etc.)
│
├── notebooks/                     # Jupyter notebooks for exploration
│   ├── 01_data_exploration.ipynb
│   ├── 02_feature_engineering.ipynb
│   └── 03_model_benchmarking.ipynb
│
├── src/                           # Source code
│   ├── __init__.py
│   ├── data/                      # Data loading and preprocessing
│   │   ├── __init__.py
│   │   ├── dataset.py             # FlareDataset and DataLoader classes
│   │   ├── preprocessing.py       # Normalization, filtering, resampling
│   │   └── augmentations.py       # Data augmentation strategies
│   │
│   ├── features/                  # Feature engineering
│   │   ├── __init__.py
│   │   ├── extractors.py          # Time-domain, spectral, and statistical features
│   │   └── flare_signatures.py    # Flare-specific signature extraction
│   │
│   ├── models/                    # Model definitions
│   │   ├── __init__.py
│   │   ├── baselines.py           # Threshold-based and classical ML baselines
│   │   ├── cnn.py                 # 1D-CNN architectures
│   │   ├── lstm.py                # LSTM / BiLSTM architectures
│   │   ├── transformer.py         # Transformer-based models
│   │   └── hybrid.py              # Hybrid CNN-LSTM / CNN-Transformer models
│   │
│   ├── training/                  # Training pipelines
│   │   ├── __init__.py
│   │   ├── trainer.py             # Main training loop
│   │   ├── losses.py              # Custom loss functions
│   │   └── scheduler.py           # LR schedulers and early stopping
│   │
│   ├── evaluation/                # Evaluation utilities
│   │   ├── __init__.py
│   │   ├── metrics.py             # All evaluation metrics
│   │   └── visualization.py       # Prediction visualization
│   │
│   └── utils/                     # Utility functions
│       ├── __init__.py
│       ├── logger.py              # Logging configuration
│       └── config.py              # Configuration management
│
├── configs/                       # Configuration files
│   ├── baseline.yaml
│   ├── cnn_lstm.yaml
│   └── transformer.yaml
│
└── scripts/                       # Executable scripts
    ├── run_baseline.py            # Run baseline models
    ├── train.py                   # Train a model
    ├── evaluate.py                # Evaluate a trained model
    └── predict.py                 # Run inference on new data
```

---

## Submission Guidelines

1. **Fork** this repository and develop your solution in your fork.
2. Ensure your solution is **reproducible** — include a `requirements.txt` or `environment.yml`.
3. Provide a **`report.md`** describing:
   - Your approach and architectural choices
   - Feature engineering and preprocessing decisions
   - Model training details (hyperparameters, data splits, etc.)
   - Results on the validation set (tables + plots)
   - Ablation studies and what you learned
4. Submit a pull request to this repository with your solution **before the deadline**.

### What to Include in Your Submission

| Artifact | Required | Description |
|----------|----------|-------------|
| Source code | Yes | All model code, training scripts, and utilities |
| Trained weights | Yes | Model checkpoint files or download link |
| `report.md` | Yes | Technical report describing your approach |
| `requirements.txt` | Yes | Full dependency listing |
| Predictions | Yes | Model outputs on the test set in the specified format |
| Notebooks | Recommended | Jupyter notebooks documenting your workflow |

---

## Judging Criteria

| Criterion | Weight | Description |
|-----------|--------|-------------|
| **Performance** | 40% | Metric scores on the held-out test set |
| **Novelty & Soundness** | 25% | Creativity of approach and technical correctness |
| **Reproducibility** | 15% | Ease of running and reproducing results |
| **Code Quality** | 10% | Readability, documentation, and modularity |
| **Report Clarity** | 10% | Quality of the submitted technical report |

---

## Resources & References

### Scientific Background

- [Aditya-L1 Mission (ISRO)](https://www.isro.gov.in/Aditya_L1.html)
- [Solar Flare Classification (NOAA / SWPC)](https://www.swpc.noaa.gov/phenomena/solar-flares-radio-blackouts)
- [Benz, A. O. (2017). *Flare Observations* — Living Reviews in Solar Physics](https://doi.org/10.1007/lrsp-2017-1)

### Machine Learning for Solar Flare Prediction

- [Bobra & Couvidat (2015). *Solar flare prediction using SDO/HMI vector magnetic field data* — ApJ](https://doi.org/10.1088/0004-637X/798/2/135)
- [Nishizuka et al. (2017). *Solar flare prediction with deep learning* — EPS](https://doi.org/10.1186/s40623-017-0693-1)
- [Camporeale (2019). *The Challenge of Machine Learning in Space Weather* — Space Weather](https://doi.org/10.1029/2018SW002098)
- [Chen et al. (2019). *A Deep Learning Approach for Solar Flare Prediction* — ApJ](https://doi.org/10.3847/1538-4357/ab32e3)

### Tools & Libraries

- [SunPy](https://sunpy.org/) — Python library for solar physics data analysis
- [PyTorch](https://pytorch.org/) — Deep learning framework
- [scikit-learn](https://scikit-learn.org/) — Classical ML algorithms and metrics
- [Astropy](https://www.astropy.org/) — Astronomy data handling
- [Weights & Biases](https://wandb.ai/) — Experiment tracking (optional, recommended)

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>
    Built with ❤️ for the ISRO Hackathon — Space Weather Track.
    <br>
    <em>Harnessing India's first solar mission data to protect our technological civilization.</em>
  </sub>
</div>
