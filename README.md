# ☀️ Challenge 15: Solar Flare Forecasting & Nowcasting with Aditya-L1

> **Forecasting and/or Nowcasting of Solar Flares using combined Soft and Hard X-ray data from Aditya-L1**
>
> ISRO Hackathon — Space Weather Track

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Problem Statement](#problem-statement)
3. [Scientific Foundation](#scientific-foundation)
   - [Solar Flare Physics](#solar-flare-physics)
   - [Why Soft + Hard X-ray Fusion](#why-soft--hard-x-ray-fusion)
4. [Mission & Payloads](#mission--payloads)
   - [Aditya-L1 Mission](#aditya-l1-mission)
   - [SoLEXS — Soft X-ray Spectrometer](#solexs--soft-x-ray-spectrometer)
   - [HEL1OS — Hard X-ray Spectrometer](#hel1os--hard-x-ray-spectrometer)
5. [Challenge Objectives](#challenge-objectives)
   - [Nowcasting Task](#nowcasting-task)
   - [Forecasting Task](#forecasting-task)
6. [End-to-End System Architecture](#end-to-end-system-architecture)
   - [High-Level System Diagram](#high-level-system-diagram)
   - [Architecture Layers](#architecture-layers)
   - [Data Flow](#data-flow)
7. [Data Strategy](#data-strategy)
   - [Data Sources](#data-sources)
   - [Data Pipeline Architecture](#data-pipeline-architecture)
   - [Hackathon Dataset Specification](#hackathon-dataset-specification)
8. [Frontend Architecture](#frontend-architecture)
   - [Tech Stack](#tech-stack)
   - [UI Modules](#ui-modules)
   - [Frontend-Backend Contract](#frontend-backend-contract)
9. [Backend Architecture](#backend-architecture)
   - [Tech Stack](#backend-tech-stack)
   - [API Endpoints](#api-endpoints)
   - [Service Layer](#service-layer)
10. [Machine Learning Architecture](#machine-learning-architecture)
    - [Problem Framing](#problem-framing)
    - [Model Hierarchy](#model-hierarchy)
    - [Fusion Strategy](#fusion-strategy)
    - [Multi-Task Learning Design](#multi-task-learning-design)
11. [Feature Engineering](#feature-engineering)
    - [Time-Domain Features](#time-domain-features)
    - [HXR-Specific Features](#hxr-specific-features)
    - [SXR-Specific Features](#sxr-specific-features)
    - [Cross-Modal Features](#cross-modal-features)
12. [Evaluation Framework](#evaluation-framework)
    - [Nowcasting Metrics](#nowcasting-metrics)
    - [Forecasting Metrics](#forecasting-metrics)
    - [Event-Level Evaluation](#event-level-evaluation)
13. [Repository Structure](#repository-structure)
    - [Current State Assessment](#current-state-assessment)
    - [Target Folder Architecture](#target-folder-architecture)
14. [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Quick Start](#quick-start)
    - [Running Baselines](#running-baselines)
    - [Training a Model](#training-a-model)
15. [Tech Stack Summary](#tech-stack-summary)
16. [Implementation Roadmap](#implementation-roadmap)
    - [Phase 1 — Data Pipeline](#phase-1--data-pipeline)
    - [Phase 2 — Baselines](#phase-2--baselines)
    - [Phase 3 — Deep Learning Model](#phase-3--deep-learning-model)
    - [Phase 4 — Backend API](#phase-4--backend-api)
    - [Phase 5 — Frontend Dashboard](#phase-5--frontend-dashboard)
    - [Phase 6 — Polish & Demo](#phase-6--polish--demo)
17. [Submission Guidelines](#submission-guidelines)
18. [Judging Criteria](#judging-criteria)
19. [Hackathon Demo Strategy](#hackathon-demo-strategy)
20. [Known Gaps & Risks](#known-gaps--risks)
21. [Research Extensions](#research-extensions)
22. [Resources & References](#resources--references)
23. [License](#license)

---

## Executive Summary

This repository serves as the **official starter kit** for **Challenge 15: Forecasting and/or Nowcasting of Solar Flares using combined Soft and Hard X-ray data from Aditya-L1** at the ISRO Hackathon.

Solar flares are sudden, intense bursts of electromagnetic radiation caused by magnetic energy release in the solar atmosphere. They disrupt satellite communications, GPS navigation, and power grids. **Anticipating them is critical for safeguarding infrastructure.**

This challenge asks participants to build an **automated algorithmic pipeline** that fuses time-series data from two X-ray payloads aboard ISRO's **Aditya-L1** mission:

| Payload | Type | Energy Range | Science Role |
|---------|------|-------------|--------------|
| **SoLEXS** | Soft X-ray Spectrometer | 1–55 keV | Tracks thermal flare evolution |
| **HEL1OS** | Hard X-ray Spectrometer | 10–150 keV | Captures impulsive non-thermal onset |

The system must perform one or both of:

1. **Nowcasting** — Detect and classify flares in real time
2. **Forecasting** — Predict peak flux and class before maximum emission

**Current repository status**: This is a **well-structured ML scaffold** with clean module separation, preprocessing utilities, feature extraction, multiple model definitions, a training loop, and evaluation metrics. It requires participants to implement the data ingestion pipeline, complete the evaluation/inference paths, and optionally build a frontend/backend demo layer.

---

## Problem Statement

### The Space Weather Problem

Solar flares are the most energetic explosive phenomena in the solar system. When directed at Earth, they cause:

- **HF radio blackouts** — disruption of long-distance communication
- **Satellite anomalies** — single-event upsets, drag enhancement
- **GPS degradation** — positioning errors affecting aviation and navigation
- **Power grid fluctuations** — geomagnetically induced currents

### The Technical Problem

Build an algorithm that:

1. **Ingests** co-temporal soft X-ray (SoLEXS) and hard X-ray (HEL1OS) time-series data
2. **Detects** solar flares with minimal latency and low false-alarm rate
3. **Classifies** flares by severity (C, M, X class)
4. **Forecasts** peak flux and class before the flare reaches maximum
5. **Operates** reliably across varying solar activity levels

### Why This Is Hard

| Challenge | Why It Matters |
|-----------|---------------|
| **Rare events** | Major flares are sparse—class imbalance is extreme |
| **Noisy signals** | Instrument noise and solar background complicate detection |
| **Temporal dependency** | You cannot treat time steps independently |
| **Varying durations** | Flares last minutes to hours—windowing is non-trivial |
| **Domain specificity** | Requires understanding solar physics for meaningful features |

---

## Scientific Foundation

### Solar Flare Physics

Solar flares are classified by their peak soft X-ray flux (1–8 Å) as measured by GOES satellites:

| Class | Peak Flux (W/m²) | Description | Space Weather Impact |
|-------|------------------|-------------|---------------------|
| **A** | < 10⁻⁷ | Minor | None |
| **B** | 10⁻⁷ – 10⁻⁶ | Small | None |
| **C** | 10⁻⁶ – 10⁻⁵ | Moderate | Generally benign |
| **M** | 10⁻⁵ – 10⁻⁴ | Strong | Radio blackouts (R1–R2) |
| **X** | ≥ 10⁻⁴ | Extreme | Major blackouts, radiation storms |

Each class follows a logarithmic scale. M5.0 is five times stronger than M1.0. X-class flares beyond X9 have been recorded during extreme solar events.

### Why Soft + Hard X-ray Fusion

| Characteristic | Soft X-rays (SoLEXS) | Hard X-rays (HEL1OS) |
|----------------|---------------------|---------------------|
| **Emission mechanism** | Thermal plasma (10–30 MK) | Non-thermal electrons |
| **Time profile** | Smooth, gradual rise and decay | Rapid, impulsive spikes |
| **Flare phase** | Gradual and decay phases | Impulsive onset phase |
| **Signal shape** | Slowly varying | Fast, bursty |
| **Best for** | Classification, energy estimation | Onset detection, early warning |

**Fusing them is scientifically powerful because:**

- **HXR alone**: Sensitive to onset but misses broader energy context
- **SXR alone**: Shows total energy but has delayed response
- **Combined**: Enables both early detection (HXR) and accurate magnitude estimation (SXR)

---

## Mission & Payloads

### Aditya-L1 Mission

| Attribute | Detail |
|-----------|--------|
| **Agency** | Indian Space Research Organisation (ISRO) |
| **Type** | India's first space-based solar observatory |
| **Orbit** | Halo orbit around Sun-Earth Lagrange Point L1 |
| **Distance** | ~1.5 million km from Earth |
| **Advantage** | Continuous, uninterrupted Sun viewing (no eclipses) |
| **Payloads** | 7 total — 4 remote sensing, 3 in-situ |

### SoLEXS — Soft X-ray Spectrometer

| Attribute | Detail |
|-----------|--------|
| **Full Name** | Solar Low Energy X-ray Spectrometer |
| **Measurement** | Soft X-ray flux (1–55 keV) |
| **Role** | Tracks gradual thermal flare emission |
| **Cadence** | Sub-second temporal resolution |
| **Science** | Provides baseline SXR flux curve for flare classification |

### HEL1OS — Hard X-ray Spectrometer

| Attribute | Detail |
|-----------|--------|
| **Full Name** | High Energy L1 Orbiting X-ray Spectrometer |
| **Measurement** | Hard X-ray flux (10–150 keV) |
| **Role** | Captures impulsive non-thermal electron emission |
| **Cadence** | Sub-second temporal resolution |
| **Science** | Resolves fast flare onset variations for early detection |

---

## Challenge Objectives

Participants must build a pipeline that performs one or both tasks:

### Nowcasting Task

**Goal**: Detect and classify solar flares in **real time**.

| Aspect | Detail |
|--------|--------|
| **Input** | Streaming window of SoLEXS + HEL1OS flux values |
| **Output** | `(is_flare: bool, flare_class: str, confidence: float)` |
| **Key challenge** | Minimize detection latency while maintaining low false-positive rate |
| **Framing** | Binary classification (flare/no-flare) + multi-class (quiet/C/M/X) |

### Forecasting Task

**Goal**: Predict peak flux and class **before maximum emission**.

| Aspect | Detail |
|--------|--------|
| **Input** | Early-phase signal from flare onset to pre-peak |
| **Output** | `(peak_flux: float, flare_class: str, lead_time: float, confidence: float)` |
| **Key challenge** | Extract predictive precursors from pre-peak noise |
| **Framing** | Multi-task learning: regression (peak flux) + classification (class) |

---

## End-to-End System Architecture

### High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                      DATA ACQUISITION LAYER                         │
│  ┌──────────┐  ┌──────────┐  ┌────────────┐  ┌──────────────────┐ │
│  │ SoLEXS   │  │ HEL1OS   │  │ GOES/XRS   │  │ Flare Catalogs   │ │
│  │ Raw Data │  │ Raw Data │  │ Validation │  │ (NOAA/ISRO)      │ │
│  └────┬─────┘  └────┬─────┘  └─────┬──────┘  └────────┬─────────┘ │
│       └──────────────┴──────────────┴──────────────────┘           │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      DATA ENGINEERING LAYER                         │
│  ┌──────────────────┐  ┌────────────┐  ┌─────────────────────────┐ │
│  │ Parse / Validate │  │ Resample   │  │ Event Windowing         │ │
│  │ Timestamps, QC   │  │ To Uniform │  │ + Label Assignment      │ │
│  └──────────────────┘  │ Cadence    │  └─────────────────────────┘ │
│                        └────────────┘                              │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      FEATURE ENGINEERING LAYER                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │ Statistical  │  │ Spectral     │  │ Flare-Specific           │  │
│  │ Features     │  │ Features     │  │ (HXR spikes, SXR rise)   │  │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      MODEL TRAINING LAYER                           │
│  ┌──────────┐  ┌────────┐  ┌──────────┐  ┌────────────┐           │
│  │Baseline  │  │ CNN    │  │ LSTM/    │  │ Transformer│           │
│  │Threshold │  │ 1D     │  │ BiLSTM   │  │ Encoder    │           │
│  └──────────┘  └────────┘  └──────────┘  └────────────┘           │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      INFERENCE / SERVING LAYER                      │
│  ┌──────────────────────┐  ┌──────────────────────────────────────┐│
│  │   FastAPI Backend    │  │   Monitoring / Logging               ││
│  │   (Model Serving)    │  │   (Metrics, Predictions, Errors)     ││
│  └─────────┬────────────┘  └──────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                             │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │   Next.js Frontend Dashboard                                  │  │
│  │   (Live Charts, Event Explorer, Alert Panel, Metrics View)    │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### Architecture Layers

| Layer | Responsibility | Technology |
|-------|---------------|------------|
| **Data Acquisition** | Fetch, parse, and validate raw instrument data | Python, h5py, SunPy, Astropy |
| **Data Engineering** | Clean, align, resample, window, and label | NumPy, Pandas, SciPy |
| **Feature Engineering** | Extract statistical, spectral, and domain features | NumPy, SciPy, custom extractors |
| **Model Training** | Train baselines, classical ML, and deep learning models | PyTorch, scikit-learn |
| **Inference Serving** | Serve model predictions via REST API | FastAPI, Uvicorn, Pydantic |
| **Presentation** | Visualize predictions, monitor live data, explore events | Next.js, React, Plotly, Tailwind |

### Data Flow

```
Raw HDF5/CSV ──► Parse & QC ──► Resample ──► Window Extraction
                                                  │
                                                  ▼
                                         Label Assignment
                                         (flare / quiet / C / M / X)
                                                  │
                                                  ▼
                              ┌────────────────────┼────────────────────┐
                              │                    │                    │
                              ▼                    ▼                    ▼
                    Train Dataset           Validation Dataset    Test Dataset
                              │                    │                    │
                              └────────────┬────────┘                    │
                                           │                            │
                                           ▼                            │
                                     Train Model ◄──────────────────────┘
                                           │
                                           ▼
                                    Evaluation ──► Metrics (HSS, TSS, F1, Latency)
                                           │
                                           ▼
                                    Inference API ──► Frontend Dashboard
```

---

## Data Strategy

### Data Sources

#### Primary Source — Hackathon Organizer Data
The challenge dataset is constructed from archival and simulated Aditya-L1 observations, annotated using co-temporal GOES flare catalogs. This is the **authoritative dataset** for the competition.

#### Validation Source — NOAA GOES X-Ray Flux
| Source | URL | Purpose |
|--------|-----|---------|
| GOES X-ray Flux (1-min) | `https://services.swpc.noaa.gov/json/goes/primary/` | Cross-validation of flare timing |
| GOES Flare Event List | NOAA NCEI Archive | Flare catalog for labeling |
| Historical GOES Data | `ftp://ftp.swpc.noaa.gov/pub/warehouse/` | Archived measurements |

#### Scientific Context — ISRO Mission Pages
- Aditya-L1 Mission Overview
- Payload specifications for SoLEXS and HEL1OS
- Mission brochure and booklet

### Data Pipeline Architecture

```
data/
├── raw/                          # Immutable source data
│   ├── aditya/                   # Organizer-provided SoLEXS + HEL1OS
│   │   ├── solexs_*.h5
│   │   └── hel1os_*.h5
│   ├── goes/                     # GOES X-ray flux for validation
│   │   └── goes_xrs_*.json
│   └── catalogs/                 # Flare event catalogs
│       └── flare_list.csv
│
├── interim/                      # Intermediate processed data
│   ├── aligned/                  # Time-synchronized SXR + HXR
│   └── windows/                  # Sliding window extractions
│
├── processed/                    # ML-ready datasets
│   ├── train/
│   ├── val/
│   └── test/
│
└── features/                     # Pre-computed feature vectors
    ├── train_features.npy
    ├── val_features.npy
    └── test_features.npy
```

### Hackathon Dataset Specification

| Component | Format | Description |
|-----------|--------|-------------|
| **SoLEXS Lightcurves** | HDF5/CSV | Time-series SXR flux, multiple energy bins (1–55 keV) |
| **HEL1OS Lightcurves** | HDF5/CSV | Time-series HXR flux, multiple energy bins (10–150 keV) |
| **Flare Annotations** | CSV/JSON | Onset, peak, end times + GOES peak flux + flare class |
| **Quiet-Sun Intervals** | CSV/JSON | Negative samples — periods of minimal activity |
| **Metadata** | Attached | Timestamps, energy bin edges, instrument state flags |

---

## Frontend Architecture

> **Note**: The current repository does **not** include a frontend. This section describes the recommended architecture.

### Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Framework** | Next.js 14+ (React) | Server-rendered dashboard |
| **Styling** | Tailwind CSS + shadcn/ui | Modern, responsive UI |
| **Charts** | Plotly.js / Apache ECharts | Interactive time-series visualization |
| **State** | TanStack Query | Server state and caching |
| **Animations** | Framer Motion (optional) | Smooth transitions |

### UI Modules

#### 1. Live Dashboard
- Real-time SXR + HXR lightcurve plots
- Current model prediction with confidence indicator
- Alert banner for active flares
- Live latency display

#### 2. Event Explorer
- Date range picker for historical events
- Event-by-event playback mode
- Ground truth vs. prediction overlay
- Zoom into onset-to-peak windows

#### 3. Model Comparison View
- Side-by-side: baseline vs. advanced model
- Metrics table (HSS, TSS, F1, latency)
- Confidence calibration plot
- Confusion matrix visualization

#### 4. Explainability Panel
- Most influential time windows highlighted
- Energy bin contribution breakdown
- HXR spike count + SXR rise rate display
- Attention heatmap (if Transformer used)

#### 5. System Health
- Model load status
- Data freshness indicator
- API health check

### Frontend-Backend Contract

| Endpoint | Method | Request | Response |
|----------|--------|---------|----------|
| `/health` | GET | — | `{status, model_loaded, version}` |
| `/api/infer/nowcast` | POST | `{timestamps, solexs, hel1os}` | `{is_flare, class, confidence, latency}` |
| `/api/infer/forecast` | POST | `{partial_solexs, partial_hel1os}` | `{peak_flux, class, lead_time, confidence}` |
| `/api/events` | GET | `?start=&end=` | `[{event_id, onset, peak, class, ...}]` |
| `/api/metrics` | GET | — | `{accuracy, hss, tss, f1, ...}` |

---

## Backend Architecture

### Backend Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **API Framework** | FastAPI | High-performance async API |
| **Server** | Uvicorn | ASGI server |
| **Schema** | Pydantic v2 | Request/response validation |
| **Database** | PostgreSQL / SQLite | Event history, prediction logs |
| **ORM** | SQLAlchemy | Database access |
| **Caching** | Redis (optional) | Inference caching |
| **Container** | Docker | Reproducible deployment |
| **Tracking** | MLflow / W&B | Experiment logging |

### API Endpoints

#### `GET /health`
Returns system status.

Response:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "model_type": "cnn_lstm",
  "version": "0.1.0",
  "uptime_seconds": 3600
}
```

#### `POST /api/infer/nowcast`
Real-time flare detection.

Request:
```json
{
  "timestamps": ["2026-06-22T12:00:00Z", "2026-06-22T12:00:01Z", ...],
  "solexs": [[flux_bin0, flux_bin1, ...], ...],
  "hel1os": [[flux_bin0, flux_bin1, ...], ...]
}
```

Response:
```json
{
  "is_flare": true,
  "predicted_class": "M",
  "confidence": 0.91,
  "detection_latency_ms": 42,
  "explanation": {
    "hxr_spike_score": 0.88,
    "sxr_rise_rate": 0.62,
    "signal_to_noise": 34.2
  }
}
```

#### `POST /api/infer/forecast`
Predict flare peak before maximum.

Request:
```json
{
  "event_id": "event_20260622_001",
  "onset_timestamp": "2026-06-22T12:05:00Z",
  "solexs_prepeak": [[...], ...],
  "hel1os_prepeak": [[...], ...],
  "elapsed_seconds": 180
}
```

Response:
```json
{
  "predicted_peak_flux": 0.000021,
  "predicted_class": "M",
  "estimated_peak_time": "2026-06-22T12:16:00Z",
  "lead_time_minutes": 11.0,
  "confidence": 0.83
}
```

#### `GET /api/events`
Retrieve historical flare events with predictions.

Query: `?start=2026-06-01&end=2026-06-22&min_class=M`

Response:
```json
{
  "events": [
    {
      "event_id": "evt_001",
      "onset": "2026-06-15T08:12:00Z",
      "peak": "2026-06-15T08:18:00Z",
      "end": "2026-06-15T08:35:00Z",
      "true_class": "M3",
      "predicted_class": "M2",
      "detection_latency_s": 17,
      "lead_time_s": 360
    }
  ],
  "total": 42
}
```

#### `GET /api/metrics`
Return aggregate evaluation metrics.

Response:
```json
{
  "nowcasting": {
    "f1_macro": 0.87,
    "hss": 0.72,
    "tss": 0.68,
    "mean_latency_s": 12.4,
    "false_alarm_rate": 0.08
  },
  "forecasting": {
    "classification_accuracy": 0.74,
    "mae_peak_flux": 3.2e-6,
    "rmse_peak_flux": 5.1e-6,
    "mean_lead_time_min": 9.3
  }
}
```

### Service Layer

```
backend/
├── app/
│   ├── main.py                    # FastAPI application entry point
│   ├── routes/
│   │   ├── health.py              # Health check endpoint
│   │   ├── inference.py           # Nowcast + forecast endpoints
│   │   ├── events.py              # Event history endpoints
│   │   └── metrics.py             # Evaluation metrics endpoint
│   ├── services/
│   │   ├── predictor.py           # Model loading and inference logic
│   │   ├── preprocessor.py        # Input preprocessing pipeline
│   │   └── labeler.py             # Event labeling utilities
│   ├── schemas/
│   │   └── models.py              # Pydantic request/response models
│   ├── models/                    # Model checkpoints and configs
│   └── core/
│       └── config.py              # Application configuration
├── tests/
├── Dockerfile
└── requirements.txt
```

---

## Machine Learning Architecture

### Problem Framing

The challenge can be framed in multiple ways, each with tradeoffs:

| Approach | Type | Pros | Cons |
|----------|------|------|------|
| **Binary classification** | Flare vs. no-flare | Simplest baseline | No severity information |
| **Multi-class classification** | Quiet / C / M / X | Operational relevance | Class imbalance is extreme |
| **Regression** | Predict peak flux | Continuous output | Less intuitive for alerts |
| **Multi-task learning** | Class + flux + time | Shared representations, demo-friendly | More complex training |

**Recommended: Multi-task learning** — one shared encoder with multiple output heads. This maximizes information extraction from limited data and produces a cleaner demo narrative.

### Model Hierarchy

#### Level 0 — Physics-Inspired Baselines
- **Threshold Nowcaster**: HXR flux / running median > threshold → flare
- **Flux-Rise Forecaster**: SXR rise rate → class estimation
- **Purpose**: Sanity check, benchmark, judges appreciate physical interpretability

#### Level 1 — Classical Machine Learning
- **Random Forest** on engineered features
- **XGBoost** with temporal features
- **Logistic Regression** as simplest learned model
- **SVM** for comparison

#### Level 2 — Deep Sequence Models
- **CNN1D**: Local feature extraction, fast training
- **LSTM / BiLSTM**: Temporal dependency modeling
- **Transformer Encoder**: Long-range attention (requires more data)

#### Level 3 — Recommended Champion: CNN-LSTM Hybrid
**Why this is the best hackathon choice:**
- CNN captures local impulsive signatures (HXR spikes)
- LSTM captures gradual temporal build-up (SXR rise)
- Moderate data requirements
- Easier to train than pure Transformer
- Good latency for real-time inference

### Fusion Strategy

| Strategy | Description | When To Use |
|----------|-------------|-------------|
| **Early fusion** | Concatenate SXR + HXR channels before first layer | Simple, works well |
| **Mid-level fusion** | Separate encoders → concatenate embeddings | Better interpretability |
| **Late fusion** | Independent models → ensemble output | Robust, redundant |

**Recommended: Mid-level fusion** — process SXR and HXR through separate encoder branches, then fuse the learned representations. This preserves modality-specific patterns and aids explainability.

### Multi-Task Learning Design

```
                    ┌──────────────────────────┐
                    │      Input Sequence       │
                    │ (SXR + HXR over time T)  │
                    └──────────────────────────┘
                                │
                                ▼
                    ┌──────────────────────────┐
                    │     Shared Encoder        │
                    │  (CNN + BiLSTM stack)    │
                    └──────────────────────────┘
                                │
            ┌───────────────────┼───────────────────┐
            │                   │                   │
            ▼                   ▼                   ▼
   ┌──────────────┐   ┌──────────────┐   ┌──────────────────┐
   │  Head 1:     │   │  Head 2:     │   │  Head 3:         │
   │ Flare/No-Flare│   │  Class (C/M/X) │   │  Peak Flux Regr │
   │ (Binary)     │   │  (Multi-class)│   │  (Regression)    │
   └──────────────┘   └──────────────┘   └──────────────────┘
```

---

## Feature Engineering

### Time-Domain Features

| Feature | Description | Signal Source |
|---------|-------------|---------------|
| **Rolling mean** | Running average over window | SXR, HXR |
| **Rolling std** | Short-term variability | HXR |
| **Gradient / slope** | Rate of change | SXR, HXR |
| **Peak-to-background ratio** | Current vs. quiet baseline | HXR |
| **Rise time** | Time from baseline to threshold | SXR |
| **Decay rate** | Post-peak decline slope | SXR |
| **Moving quantiles** | P95, P05 for outlier robustness | Both |

### HXR-Specific Features

| Feature | Description | Scientific Basis |
|---------|-------------|------------------|
| **Spike count** | Number of impulsive events in window | Non-thermal electron acceleration |
| **Spike amplitude** | Maximum impulsive excursion | Acceleration efficiency |
| **Impulsiveness score** | Ratio of peak to local median | Flare onset strength |
| **High-frequency power** | Spectral power in >0.1 Hz band | Turbulence indicator |

### SXR-Specific Features

| Feature | Description | Scientific Basis |
|---------|-------------|------------------|
| **Cumulative flux** | Integrated energy release | Thermal energy content |
| **Gradual rise slope** | Long-term trend gradient | Heating rate |
| **Curvature of rise** | Second derivative of flux | Acceleration of heating |
| **Background level** | Pre-event quiet flux | Activity baseline |

### Cross-Modal Features

| Feature | Description | Value |
|---------|-------------|-------|
| **SXR/HXR ratio** | Soft to hard ratio | Thermal vs. non-thermal partitioning |
| **Lag cross-correlation** | Peak correlation delay between channels | Timing offset insight |
| **HXR-to-SXR onset delay** | Time from first HXR spike to SXR rise | Early warning potential |
| **Coincidence score** | Simultaneous activity in both channels | Event validation |

---

## Evaluation Framework

### Nowcasting Metrics

| Metric | Definition | Target |
|--------|-----------|--------|
| **Precision** | TP / (TP + FP) | Minimize false alarms |
| **Recall** | TP / (TP + FN) | Maximize true detections |
| **F1 Score** | 2 × (P × R) / (P + R) | Balanced measure |
| **Detection Latency** | Time from onset to first correct detection | Minimize (target: < 30s) |
| **False Alarm Rate** | FP / (FP + TN) | Minimize |
| **Heidke Skill Score (HSS)** | (correct - expected correct) / (total - expected correct) | > 0.5 = skillful |
| **True Skill Score (TSS)** | TPR - FPR | > 0.4 = good |

### Forecasting Metrics

| Metric | Definition | Target |
|--------|-----------|--------|
| **Peak Flux MAE** | Mean absolute error of predicted flux | Minimize |
| **Peak Flux RMSE** | Root mean squared error | Minimize |
| **Classification Accuracy** | % correct class assignment | > 70% |
| **Lead Time** | (peak time - prediction time) in minutes | Maximize |
| **Peak Time Error** | |predicted_peak - true_peak| | < 5 min |
| **True Skill Score (TSS)** | For flare vs. no-flare | > 0.5 |

### Event-Level Evaluation

> **Important**: Do not evaluate only per-window. Evaluate per-event.

Per-event metrics answer the operational question:
- Did you detect this flare?
- How early?
- How confident were you when it mattered?

---

## Repository Structure

### Current State Assessment

| Component | Status | Notes |
|-----------|--------|-------|
| `src/data/dataset.py` | ⚠️ Scaffold | `_load_data()` raises `NotImplementedError` |
| `src/data/preprocessing.py` | ✅ Implemented | Normalization, resampling, smoothing |
| `src/data/augmentations.py` | ✅ Implemented | Noise, time-warp, amplitude scale |
| `src/features/extractors.py` | ✅ Implemented | Statistical, spectral, time-domain |
| `src/features/flare_signatures.py` | ✅ Implemented | HXR spikes, SXR rise rate, flux ratio |
| `src/models/baselines.py` | ✅ Implemented | Threshold nowcaster, flux-rise forecaster |
| `src/models/cnn.py` | ✅ Implemented | 1D-CNN architecture |
| `src/models/lstm.py` | ✅ Implemented | LSTM classifier and forecaster |
| `src/models/transformer.py` | ✅ Implemented | Transformer encoder with positional encoding |
| `src/models/hybrid.py` | ✅ Implemented | CNN-LSTM hybrid (not in model registry) |
| `src/training/trainer.py` | ✅ Implemented | Full training loop with early stopping |
| `src/training/losses.py` | ✅ Implemented | Focal loss, weighted CE |
| `src/evaluation/metrics.py` | ✅ Implemented | HSS, TSS, latency, flux error |
| `src/evaluation/visualization.py` | ✅ Implemented | Flare event plotting |
| `scripts/run_baseline.py` | ⚠️ Uses synthetic data | Replace with real data loading |
| `scripts/train.py` | ✅ Structured | Training pipeline |
| `scripts/evaluate.py` | ⚠️ Placeholder | Not yet implemented |
| `scripts/predict.py` | ⚠️ Placeholder | Not yet implemented |
| `configs/*.yaml` | ✅ Structured | Hyperparameter configurations |
| `Frontend` | ❌ Missing | Not yet built |
| `Backend API` | ❌ Missing | Not yet built |
| `Tests` | ❌ Missing | Not yet written |

### Target Folder Architecture

```
aditya-l1-solar-flare-forecasting/
│
├── README.md                      # This comprehensive guide
├── LICENSE                        # MIT License
├── requirements.txt               # Python dependencies
├── pyproject.toml                 # Modern Python packaging
├── docker-compose.yml             # Multi-service deployment
│
├── data/
│   ├── raw/                       # Immutable source data
│   │   ├── aditya/                # SoLEXS + HEL1OS files
│   │   ├── goes/                  # GOES validation data
│   │   └── catalogs/              # Flare event lists
│   ├── interim/                   # Intermediate artifacts
│   ├── processed/                 # ML-ready tensors
│   └── features/                  # Pre-computed features
│
├── notebooks/
│   ├── 01_data_audit.ipynb
│   ├── 02_alignment_and_labeling.ipynb
│   ├── 03_feature_benchmark.ipynb
│   ├── 04_model_comparison.ipynb
│   └── 05_error_analysis.ipynb
│
├── src/                           # Core ML library
│   ├── __init__.py
│   ├── data/                      # Dataset, preprocessing, augmentations
│   ├── features/                  # Extractors, flare signatures
│   ├── models/                    # All model architectures
│   ├── training/                  # Trainer, losses, schedulers
│   ├── evaluation/                # Metrics, visualization
│   └── utils/                     # Config, logging
│
├── backend/                       # FastAPI inference service
│   ├── app/
│   │   ├── main.py
│   │   ├── routes/
│   │   ├── services/
│   │   ├── schemas/
│   │   └── core/
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/                      # Next.js dashboard
│   ├── src/
│   ├── app/
│   ├── components/
│   ├── package.json
│   └── Dockerfile
│
├── configs/                       # YAML experiment configs
│   ├── baseline.yaml
│   ├── cnn_lstm.yaml
│   └── transformer.yaml
│
├── scripts/                       # CLI entry points
│   ├── run_baseline.py
│   ├── train.py
│   ├── evaluate.py
│   └── predict.py
│
├── reports/                       # Generated reports & figures
├── artifacts/                     # Model checkpoints, logs
└── tests/                         # Unit and integration tests
```

---

## Getting Started

### Prerequisites

- Python 3.10+
- Git
- (Recommended) GPU-enabled machine for deep learning
- (Optional) Node.js 18+ for frontend development

### Installation

```bash
# Clone the repository
git clone https://github.com/Rakshith-17-pro/aditya-l1-solar-flare-forecasting.git
cd aditya-l1-solar-flare-forecasting

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate          # Linux/Mac
# venv\Scripts\Activate.ps1       # Windows

# Install dependencies
pip install -r requirements.txt

# Install the package in development mode
pip install -e .
```

### Quick Start

```python
# Load, preprocess, and visualize a flare event
from src.data.preprocessing import preprocess_lightcurves
from src.evaluation.visualization import plot_flare_event
import numpy as np

# Load your data (implement FlareDataset._load_data first)
# dataset = FlareDataset("data/raw/sample_event.h5")
# event = dataset[0]

# Preprocess
# solexs, hel1os = preprocess_lightcurves(event["solexs"], event["hel1os"])
# plot_flare_event(solexs, hel1os, event["annotation"])
```

### Running Baselines

```bash
# Run threshold nowcasting baseline
python scripts/run_baseline.py --task nowcast --model threshold

# Run flux-rise forecasting baseline
python scripts/run_baseline.py --task forecast --model threshold
```

### Training a Model

```bash
# Train an LSTM model
python scripts/train.py --config configs/cnn_lstm.yaml --model lstm --device cuda

# Train a CNN model
python scripts/train.py --config configs/cnn_lstm.yaml --model cnn1d --device cuda

# Train a Transformer
python scripts/train.py --config configs/transformer.yaml --model transformer --device cuda
```

---

## Tech Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Language** | Python 3.10+ | Primary development language |
| **Data Processing** | NumPy, Pandas, SciPy, h5py | Array operations, data frames, signal processing |
| **Astronomy** | SunPy, Astropy | Solar physics data handling |
| **Deep Learning** | PyTorch 2.0+ | Neural network framework |
| **Classical ML** | scikit-learn, XGBoost | Baselines and benchmarks |
| **API Backend** | FastAPI, Uvicorn, Pydantic | RESTful model serving |
| **Database** | PostgreSQL / SQLite | Event and prediction storage |
| **Frontend** | Next.js, React, Tailwind CSS, Plotly | Interactive dashboard |
| **Experiment Tracking** | Weights & Biases / MLflow | Logging and comparison |
| **DevOps** | Docker, Docker Compose | Reproducible deployment |
| **Version Control** | Git, GitHub | Source management |

---

## Implementation Roadmap

### Phase 1 — Data Pipeline

**Goal**: Make the repository ingest real data end-to-end.

- [ ] Implement `FlareDataset._load_data()` to parse HDF5/CSV
- [ ] Add time synchronization for SoLEXS and HEL1OS cadences
- [ ] Implement event window extraction and label assignment
- [ ] Create train/val/test splits (event-aware, no leakage)
- [ ] Save processed tensors to `data/processed/`
- [ ] Update `run_baseline.py` to use real data instead of synthetic

**Estimated effort**: 4–6 hours

### Phase 2 — Baselines

**Goal**: Establish trustworthy, physics-inspired baselines.

- [ ] Tune HXR threshold detector on validation data
- [ ] Calibrate SXR rise-rate thresholds for class prediction
- [ ] Train XGBoost on engineered features
- [ ] Compute and record baseline metrics on test set
- [ ] Create benchmark comparison table

**Estimated effort**: 2–3 hours

### Phase 3 — Deep Learning Model

**Goal**: Train a champion deep model that beats baselines.

- [ ] Start with LSTM or CNN-LSTM architecture
- [ ] Add class weights / Focal Loss for imbalance handling
- [ ] Experiment with mid-level fusion (separate SXR/HXR encoders)
- [ ] Implement multi-task learning heads (class + flux)
- [ ] Hyperparameter tuning (learning rate, window size, hidden dims)
- [ ] Evaluate on per-event metrics

**Estimated effort**: 6–8 hours

### Phase 4 — Backend API

**Goal**: Expose model predictions via REST API.

- [ ] Set up FastAPI project structure
- [ ] Implement model loading and warm-up
- [ ] Create `/api/infer/nowcast` endpoint
- [ ] Create `/api/infer/forecast` endpoint
- [ ] Add input validation with Pydantic
- [ ] Add request logging and error handling
- [ ] Containerize with Docker

**Estimated effort**: 3–4 hours

### Phase 5 — Frontend Dashboard

**Goal**: Build a judge-impressive visual demo.

- [ ] Set up Next.js project with Tailwind CSS
- [ ] Build live lightcurve chart component
- [ ] Build prediction display panel
- [ ] Build event explorer with date range filter
- [ ] Build metrics and comparison view
- [ ] Connect to backend API
- [ ] Deploy on Vercel / Railway

**Estimated effort**: 4–6 hours

### Phase 6 — Polish & Demo

**Goal**: Prepare for final presentation.

- [ ] Create architecture diagram (for presentation slides)
- [ ] Prepare benchmark table (baseline vs. champion)
- [ ] Document failure cases and what they teach
- [ ] Add explainability snippets (attention maps, feature importance)
- [ ] Write technical report (`report.md`)
- [ ] Practice 5-minute demo walkthrough

**Estimated effort**: 2–3 hours

---

## Submission Guidelines

1. **Fork** this repository and develop your solution in your fork.
2. Ensure your solution is **reproducible** — include `requirements.txt` or `environment.yml`.
3. Provide a **`report.md`** describing:
   - Approach and architectural choices
   - Feature engineering and preprocessing decisions
   - Model training details (hyperparameters, data splits, etc.)
   - Results on the validation set (tables + plots)
   - Ablation studies and lessons learned
4. Submit a pull request to this repository **before the deadline**.

### Required Artifacts

| Artifact | Required | Description |
|----------|----------|-------------|
| Source code | Yes | All model code, training scripts, utilities |
| Trained weights | Yes | Model checkpoint files or download link |
| `report.md` | Yes | Technical report describing approach |
| `requirements.txt` | Yes | Full dependency listing |
| Predictions | Yes | Model outputs on test set in specified format |
| Notebooks | Recommended | Jupyter notebooks documenting workflow |

---

## Judging Criteria

| Criterion | Weight | What Judges Look For |
|-----------|--------|---------------------|
| **Performance** | 40% | Metric scores on held-out test set |
| **Novelty & Soundness** | 25% | Creativity of approach, technical correctness |
| **Reproducibility** | 15% | Ease of running and reproducing results |
| **Code Quality** | 10% | Readability, documentation, modularity |
| **Report Clarity** | 10% | Quality of the submitted technical report |

**Judges also notice:**
- Is there a working demo (frontend)?
- Can you explain why your approach works?
- Do you acknowledge failure modes?
- Is the science correct?

---

## Hackathon Demo Strategy

A winning demo tells a story. Here is the recommended narrative flow:

### 1. The Problem (30 seconds)
- Solar flares disrupt communications, GPS, power grids
- Aditya-L1 gives us unique SXR + HXR data
- Need: early, accurate detection

### 2. The Data (30 seconds)
- Show raw SoLEXS and HEL1OS lightcurves
- Point out: HXR spikes at onset, SXR gradual rise
- Show a labeled flare event with onset/peak/end

### 3. The Baseline (30 seconds)
- Simple threshold method works but has limitations
- Show where it fails: false alarms, late detection

### 4. The Solution (60 seconds)
- Architecture overview diagram
- Key insight: fusion of SXR + HXR through mid-level fusion
- Model: CNN extracts spikes, LSTM captures temporal evolution
- Multi-task: class + flux prediction simultaneously

### 5. The Results (60 seconds)
- Benchmark table: baseline vs. champion
- Highlight: improved HSS, reduced latency
- Show event playback: detection timing visualization

### 6. The Demo (60 seconds)
- Live dashboard: real-time lightcurves + predictions
- Click through 2–3 flare events
- Show confidence and explainability

### 7. The Honest Assessment (30 seconds)
- Where does it still fail?
- What would you improve with more time?
- Thank the judges and organizers

---

## Known Gaps & Risks

### Current Repository Gaps

| Issue | Impact | Fix Priority |
|-------|--------|--------------|
| `FlareDataset._load_data()` unimplemented | Cannot load real data | 🔴 Critical |
| `scripts/evaluate.py` is placeholder | No evaluation pipeline | 🔴 Critical |
| `scripts/predict.py` is placeholder | No inference pipeline | 🔴 Critical |
| `run_baseline.py` uses synthetic data | Baseline metrics meaningless | 🟡 High |
| No frontend | No visual demo | 🟡 High |
| No backend API | No model serving | 🟡 High |
| No tests | Unverified correctness | 🟡 Medium |
| CNN shape mismatch (channels vs time) | Runtime errors | 🟡 Medium |
| CNN-LSTM not in model registry | Cannot train hybrid | 🟡 Medium |
| README import path error (`src.visualization`) | Quick start fails | 🟢 Low |
| No log directory auto-creation | Logger crashes if logs/ missing | 🟢 Low |

### Technical Risks

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Class imbalance (very few X-class flares) | High | Use Focal Loss, class weights, augmentation |
| Overfitting on small dataset | Medium | Regularization, early stopping, data augmentation |
| Temporal leakage across train/test splits | Medium | Split by event, not by time step |
| Real-time inference latency > acceptable | Low | Use CNN-LSTM, precompute features, batch inference |
| Missing data / dropped instrument intervals | Medium | Robust preprocessing with interpolation masks |

---

## Research Extensions

Beyond the hackathon, this project can evolve into:

- **Multi-modal fusion**: Add SDO/HMI magnetogram and AIA EUV imagery
- **Active region tracking**: Incorporate sunspot classifications and magnetic field parameters
- **Uncertainty quantification**: Bayesian deep learning for confidence calibration
- **Continual learning**: Adapt to new solar cycle patterns
- **Anomaly detection**: Identify unusual solar activity beyond standard flare taxonomy
- **Physics-informed ML**: Embed energy release physics into loss functions
- **Ensemble forecasting**: Combine multiple models with uncertainty propagation

---

## Resources & References

### Scientific Background

| Resource | Description | Link |
|----------|-------------|------|
| Aditya-L1 Mission | ISRO mission page | [isro.gov.in](https://www.isro.gov.in/Aditya_L1.html) |
| Solar Flare Classification | NOAA SWPC | [swpc.noaa.gov](https://www.swpc.noaa.gov/phenomena/solar-flares-radio-blackouts) |
| Flare Observations | Benz (2017), Living Reviews | [doi.org/10.1007/lrsp-2017-1](https://doi.org/10.1007/lrsp-2017-1) |

### Machine Learning for Solar Flare Prediction

| Paper | Year | Key Contribution |
|-------|------|-----------------|
| Bobra & Couvidat | 2015 | Flare prediction from HMI vector magnetic fields |
| Nishizuka et al. | 2017 | Deep learning for flare prediction |
| Camporeale | 2019 | ML challenges in space weather |
| Chen et al. | 2019 | Deep learning approach for flare prediction |

### Tools & Libraries

| Tool | Purpose | Link |
|------|---------|------|
| **SunPy** | Solar physics data analysis | [sunpy.org](https://sunpy.org/) |
| **PyTorch** | Deep learning framework | [pytorch.org](https://pytorch.org/) |
| **scikit-learn** | Classical ML | [scikit-learn.org](https://scikit-learn.org/) |
| **Astropy** | Astronomy data handling | [astropy.org](https://www.astropy.org/) |
| **FastAPI** | API framework | [fastapi.tiangolo.com](https://fastapi.tiangolo.com/) |
| **Next.js** | React framework | [nextjs.org](https://nextjs.org/) |
| **Plotly** | Interactive charts | [plotly.com](https://plotly.com/) |
| **W&B** | Experiment tracking | [wandb.ai](https://wandb.ai/) |

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>
    Built for the <strong>ISRO Hackathon — Space Weather Track</strong>.
    <br>
    <em>Harnessing India's first solar mission data to protect our technological civilization.</em>
    <br><br>
    <strong>Team:</strong> Ready for your contribution. Fork, build, and win.
  </sub>
</div>
```
