# ☀️ Aditya-L1 Solar Flare Forecasting — Summary

> **Project**: Challenge 15 — ISRO Hackathon, Space Weather Track  
> **Goal**: Forecast and nowcast solar flares using combined Soft + Hard X-ray data from Aditya-L1  
> **Instruments**: SoLEXS (1–55 keV) + HEL1OS (10–150 keV)  
> **Repository**: [github.com/Rakshith-17-pro/aditya-l1-solar-flare-forecasting](https://github.com/Rakshith-17-pro/aditya-l1-solar-flare-forecasting)

---

## 1. Why This Matters — The Space Weather Problem

Solar flares are the most energetic explosive phenomena in the solar system. When Earth-directed, they cause:

| Impact | Mechanism | Timescale |
|---|---|---|
| **HF radio blackouts** | X-rays ionise the D-layer, absorbing shortwave radio | Instant (8.3 min) |
| **Satellite drag & damage** | CME heats the thermosphere, increasing drag; energetic particles cause single-event upsets | 1–3 days (CME) |
| **GPS degradation** | Extra free electrons in the ionosphere slow signals unpredictably; scintillation causes loss of lock | 1–3 days |
| **Power grid GICs** | Fluctuating magnetic field induces DC currents in long transmission lines, saturating transformers | 1–3 days |

**The warning asymmetry:** Flare radiation arrives at light speed — zero warning. But the CME (which drives the worst effects) takes 1–3 days to reach Earth, giving a real window for action. Aditya-L1 sits at L1, 1.5 million km upstream, measuring incoming plasma before Earth feels it.

---

## 2. The Mission — Aditya-L1 at a Glance

| Attribute | Detail |
|---|---|
| **Agency** | ISRO |
| **Orbit** | Halo orbit around Sun-Earth L1 (~1.5 million km) |
| **Launch** | PSLV-C57, 2 September 2023 |
| **L1 insertion** | 6 January 2024 |
| **Payloads** | 7 total — 4 remote sensing, 3 in-situ |

### Key Payloads for This Challenge

| Payload | Type | Energy Range | Role |
|---|---|---|---|
| **SoLEXS** | Soft X-ray Spectrometer | 1–55 keV | Tracks thermal flare evolution (gradual rise & decay) |
| **HEL1OS** | Hard X-ray Spectrometer | 10–150 keV | Captures impulsive non-thermal onset (rapid spikes) |
| **VELC** | Coronagraph | Optical + NIR | Corona imaging, CME detection (supplementary context) |
| **SUIT** | UV Telescope | Near-UV | Photosphere/chromosphere imaging (supplementary context) |

**What makes this unique:** SoLEXS and HEL1OS together cover 2–150 keV, observing both the **thermal** (plasma heating) and **non-thermal** (electron acceleration) components of flares simultaneously — something few prior missions have done.

---

## 3. The Science — Flares vs. CMEs

| | Solar Flare | Coronal Mass Ejection (CME) |
|---|---|---|
| **What it is** | Burst of EM radiation (light, UV, X-rays) | Bubble of magnetised plasma hurled into space |
| **Cause** | Magnetic reconnection near sunspots | Often same, but can occur independently |
| **Speed** | Light speed (8.3 min to Earth) | 1–3 days to Earth |
| **Warning** | None — arrives instantly | 1–3 days + 15–60 min from L1 |

Flares and CMEs can occur together or separately. Aditya-L1's VELC spotted a "flareless" CME in March 2025 — proof they are distinct phenomena.

---

## 4. The Technical Challenge

### Task 1: Nowcasting (Real-Time Detection)

| Aspect | Detail |
|---|---|
| **Input** | Streaming window of SoLEXS + HEL1OS flux |
| **Output** | `(is_flare, class, confidence, latency)` |
| **Key metric** | Detection latency + low false-alarm rate |

### Task 2: Forecasting (Pre-Peak Prediction)

| Aspect | Detail |
|---|---|
| **Input** | Early-phase signal from onset to pre-peak |
| **Output** | `(peak_flux, class, lead_time, confidence)` |
| **Key metric** | Lead time + accuracy before maximum |

### Why It's Hard

- **Rare events** — X-class << M-class << C-class (extreme class imbalance)
- **Noisy signals** — Weak precursors buried in detector noise
- **Temporal dependency** — Cannot treat time steps independently
- **Varying durations** — Flares span minutes to hours
- **No spatial info** — SoLEXS/HEL1OS are Sun-integrated (no active region location)

---

## 5. Forecasting Methods — Approaches for SoLEXS + HEL1OS

| Method | Inputs | Lead Time | Maturity |
|---|---|---|---|
| **Threshold Nowcasting** | SXR flux + dF/dt | Seconds | Operational (GOES-style) |
| **HOPE (Hot Onset Precursors)** | Temperature, EM from SXR | 5–15 min | Research |
| **HXR Impulsive Precursor** | HXR counts (10–150 keV) | Seconds–minutes | Established |
| **Combined SXR+HXR** | Both channels fused | 5–30 min | Novel (Aditya-L1 strength) |
| **ML: Random Forest / XGBoost** | Engineered features | 30 min | Active research |
| **Deep Learning: CNN-LSTM** | Raw time series | 5–30 min | State-of-the-art |
| **Spectral Hardness** | HXR hardness ratio | Minutes | Classic |
| **QPP Detection** | Oscillation power in HXR | Minutes | Advanced |
| **Bayesian Probabilistic** | All features → probability dist. | 5–30 min | Growing adoption |

**Recommended champion:** CNN-LSTM hybrid with mid-level fusion — CNN captures local HXR spikes, LSTM models gradual SXR rise.

---

## 6. System Architecture (from README)

```
┌──────────────┐   ┌──────────────┐
│   SoLEXS     │   │   HEL1OS     │
│  (SXR Data)  │   │  (HXR Data)  │
└──────┬───────┘   └──────┬───────┘
       │                  │
       └──────┬───────────┘
              ▼
    ┌─────────────────┐
    │  Data Pipeline  │  Parse, align, resample, window, label
    └────────┬────────┘
             ▼
    ┌─────────────────┐
    │  Feature        │  Statistical, spectral, flare-specific
    │  Engineering    │  (spike count, rise rate, hardness ratio)
    └────────┬────────┘
             ▼
    ┌─────────────────┐
    │  Model Layer    │  Baseline → ML → CNN-LSTM → Transformer
    │  (Multi-Task)   │  Binary + Class + Flux Regression
    └────────┬────────┘
             ▼
    ┌─────────────────┐
    │  FastAPI Server │  Nowcast & Forecast endpoints
    └────────┬────────┘
             ▼
    ┌─────────────────┐
    │  Next.js        │  Live charts, alerts, event explorer
    │  Dashboard      │
    └─────────────────┘
```

### Recommended Model: Multi-Task CNN-LSTM

```
Input (SXR + HXR over time T)
            │
            ▼
   ┌────────────────┐
   │ Shared Encoder  │
   │ (CNN + BiLSTM)  │
   └───────┬────────┘
           │
     ┌─────┼─────┐
     │     │     │
     ▼     ▼     ▼
  ┌────┐ ┌────┐ ┌──────────┐
  │Flare│ │Clas│ │Peak Flux │
  │/No  │ │C/M/X│ │Regression│
  └────┘ └────┘ └──────────┘
```

---

## 7. Evaluation Framework

### Nowcasting Metrics

| Metric | Target | Description |
|---|---|---|
| F1 Score | > 0.8 | Balanced precision & recall |
| Detection Latency | < 30 s | Time from onset to correct detection |
| Heidke Skill Score (HSS) | > 0.5 | Skill over random chance |
| True Skill Score (TSS) | > 0.4 | TPR − FPR |

### Forecasting Metrics

| Metric | Target | Description |
|---|---|---|
| Peak Flux MAE | Minimise | Error in predicted flux |
| Class Accuracy | > 70% | Correct C/M/X assignment |
| Lead Time | Maximise | Minutes before peak |
| Peak Time Error | < 5 min | Accuracy of peak timing |

---

## 8. Challenges & Mitigations

| Problem | Mitigation |
|---|---|
| **Chaotic flare physics** | Probabilistic forecasting (Bayesian) |
| **SXR background noise** | Wavelet denoising, adaptive subtraction |
| **Weak HXR signals** | Matched filtering, event stacking |
| **Class imbalance** | Focal Loss, SMOTE, cost-sensitive learning |
| **Overfitting** | Dropout, early stopping, cross-validation |
| **No spatial info** | Fuse VELC / SDO magnetogram data |
| **Limb flares** | Multi-view (Solar Orbiter, STEREO) |
| **Solar cycle drift** | Cycle-aware features, continual learning |

---

## 9. Project Roadmap

| Phase | Focus | Est. Time |
|---|---|---|
| **Phase 1** | Data pipeline — implement `_load_data()`, align, window, label | 4–6 h |
| **Phase 2** | Baselines — threshold, XGBoost, benchmark table | 2–3 h |
| **Phase 3** | Deep learning — CNN-LSTM, multi-task, hyperparameter tuning | 6–8 h |
| **Phase 4** | Backend API — FastAPI, model serving | 3–4 h |
| **Phase 5** | Frontend — Next.js dashboard, live charts | 4–6 h |
| **Phase 6** | Polish — diagrams, report, demo walkthrough | 2–3 h |

---

## 10. Key References

| Resource | Link |
|---|---|
| Aditya-L1 Mission | [isro.gov.in](https://www.isro.gov.in/Aditya_L1.html) |
| Solar Flare Classification | [swpc.noaa.gov](https://www.swpc.noaa.gov/phenomena/solar-flares-radio-blackouts) |
| GOES X-ray Flux (real-time) | [services.swpc.noaa.gov](https://services.swpc.noaa.gov/json/goes/primary/) |
| SunPy | [sunpy.org](https://sunpy.org/) |
| PyTorch | [pytorch.org](https://pytorch.org/) |

---

<div align="center">
  <sub>
    Synthesised from <code>README.md</code> (project architecture) and
    <code>Suryanige torch Satellite.md</code> (scientific deep-dive).
    <br>
    <strong>ISRO Hackathon — Space Weather Track</strong>
    <br>
    <em>Harnessing India's first solar mission data to protect our technological civilisation.</em>
  </sub>
</div>
