# ☀️ Aditya-L1 Solar Flare Forecasting

> **Challenge 15** — ISRO Hackathon, Space Weather Track  
> **Goal**: Nowcast & forecast solar flares using SoLEXS (1–55 keV) + HEL1OS (10–150 keV)

---

## Why It Matters

Solar flares disrupt radio, GPS, satellites, and power grids. Flare radiation hits Earth in **8.3 min** (no warning), but the CME plasma arrives **1–3 days later** — that gap is our forecasting window. Aditya-L1 at L1 measures incoming plasma before Earth feels it.

**Key insight:** Flares and CMEs are separate phenomena (Aditya-L1 proved this with a "flareless" CME in Mar 2025).

## The Challenge

| Task | Input | Output |
|---|---|---|
| **Nowcasting** | Streaming SXR+HXR flux | `(is_flare, class, confidence, latency)` |
| **Forecasting** | Pre-peak signal | `(peak_flux, class, lead_time)` |

**Why it's hard:** Rare X-class events (class imbalance), noisy signals, varying flare durations, no spatial info from Sun-integrated instruments.

## Forecasting Methods (SXR + HXR)

| Method | Lead Time |
|---|---|
| **Threshold** (GOES-style) | Seconds |
| **HXR Precursor** | Seconds–min |
| **HOPE** (Hot Onset Precursors) | 5–15 min |
| **ML: XGBoost / Random Forest** | ~30 min |
| **CNN-LSTM** (recommended) | 5–30 min |
| **Bayesian Probabilistic** | 5–30 min |

**Best approach:** Multi-task CNN-LSTM with mid-level fusion — CNN captures HXR spikes, LSTM models SXR rise.

## Architecture

```
SoLEXS ─┐
         ├→ Data Pipeline → Feature Engineering → Model → FastAPI → Next.js Dashboard
HEL1OS ─┘
```

## Project Roadmap

| Phase | What | Time |
|---|---|---|
| 1 | Data pipeline (load, align, window, label) | 4–6 h |
| 2 | Baselines + benchmark | 2–3 h |
| 3 | CNN-LSTM deep learning | 6–8 h |
| 4 | FastAPI backend | 3–4 h |
| 5 | Next.js dashboard | 4–6 h |
| 6 | Polish & demo | 2–3 h |

## Key References

- [Aditya-L1 Mission](https://www.isro.gov.in/Aditya_L1.html)
- [NOAA GOES X-ray Flux](https://services.swpc.noaa.gov/json/goes/primary/)
- SunPy · PyTorch · FastAPI · Next.js

---

*Synthesised from `README.md` (architecture) and `Suryanige torch Satellite.md` (science).*
