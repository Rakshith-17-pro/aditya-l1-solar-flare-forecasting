# 🚀 Team SIRIus: Aditya-L1 Solar Flare Forecasting — Roadmap & Strategy

**Project:** Challenge 15 — Forecasting & Nowcasting of Solar Flares using SoLEXS + HEL1OS  
**Event:** ISRO Hackathon — Space Weather Track  
**Core Constraint:** Final exams run from July 3rd to July 22nd. The project must be structured to accommodate this.

---

## 📅 The 4-Phase Master Plan

### 🔴 Phase 1: The "Ship-or-Sink" MVP (Now – June 25)
*Goal: Get a working end-to-end demo running, establish baselines, and clear our desks for exam prep.*

| Task | Owner | Details |
|------|-------|---------|
| **Fix Data Ingestion** | Rockie | Implement `FlareDataset._load_data()` to parse actual SoLEXS/HEL1OS HDF5/CSV files from organizers. No more synthetic data. |
| **Event Labeling Pipeline** | Rockie | Align flare catalogs with lightcurve windows. Generate clean train/val/test splits (event-aware, no temporal leakage). |
| **Baseline Benchmarks** | Venkyy | Tune the threshold nowcaster and flux-rise forecaster on real data. Get actual HSS/TSS/latency numbers we can beat later. |
| **Prototype Backend** | Rockie | Stand up a minimal FastAPI server with a `/health` and `/api/infer/nowcast` endpoint. Serve the baseline model first. |
| **Structural Frontend** | Laksha | Build the core React layout: Upload/Watch page, Live Chart panel, Prediction Display card, Event Log sidebar. No fancy logic yet — just the skeleton with mock data. |
| **PPT Compilation** | Mru | Translate the README architecture into the idea PPT. Embed baseline screenshots to prove we have a working pipeline. |
| **Action** | **All** | **Submit the Idea PPT to Hack2Skill before June 25th.** |

### 🟡 Phase 2: Total Exam Lockdown (June 25 – July 22)
*Goal: Ace final exams. Zero coding.*

| Date | Event |
|------|-------|
| **July 20** | Announcement of Shortlisted Teams |
| **July 21** | Induction Session (one team member monitors) |
| **June 25 – July 22** | No AI training or development. Focus entirely on exams. |

### 🟢 Phase 3: The 14-Day AI Sprint (July 23 – August 5)
*Goal: Build a champion deep learning model that crushes the baseline.*

Exams are over. Frontend and API infrastructure are done. Now we go all-in on ML.

| Task | Owner | Details |
|------|-------|---------|
| **Champion Model Training** | Rockie + Venkyy | Train CNN-LSTM hybrid with mid-level fusion on real data. Experiment with multi-task heads (class + flux). |
| **Hyperparameter Sweep** | Venkyy | Grid search on learning rate, window size, hidden dims, fusion strategy. Log all runs with W&B. |
| **Class Imbalance Handling** | Rockie | Implement Focal Loss + event-weighted sampling to stop the model ignoring M/X-class flares. |
| **Model Evaluation** | Venkyy | Full event-level evaluation: HSS, TSS, latency, peak flux error. Compare against Phase 1 baselines. |
| **Swap Backend** | Rockie | Replace the baseline inference script with the trained PyTorch model checkpoint. Add `/forecast` endpoint. |
| **Frontend Wiring** | Laksha + Mru | Connect the UI to the real backend API. Live charts should now stream actual model predictions. |

### 🏆 Phase 4: 30-Hour Grand Finale (August 6 – August 7)
*Goal: Polish, Optimize, and Win.*

| Task | Owner | Details |
|------|-------|---------|
| **Explainability Panel** | Venkyy | Add attention heatmaps, HXR spike counters, SXR rise rate displays to help judges understand *why* the model predicted what it did. |
| **Performance Optimization** | Rockie | Convert model to TorchScript or ONNX for faster inference. Cache inference results with Redis. |
| **Demo Rehearsal** | All | 5-minute dry run: problem → data → baseline → solution → results → live demo → honest assessment. |
| **Final PPT** | Mru | Add final benchmark tables, architecture diagram, confusion matrices, and event playback screenshots. |

---

## 👥 Team Roles & Current Focus

| Member | Role | Immediate Action Item |
|--------|------|-----------------------|
| **Rockie** | Backend Lead & ML Engineer | Fix data ingestion, build FastAPI backend, train champion model. Coordinate the end-to-end pipeline. |
| **Venkyy (SaiVenkatesh7002)** | ML Researcher & Evaluator | Feature engineering, baseline tuning, model evaluation, experiment tracking (W&B), and PPT methodology. |
| **Laksha** | Frontend Developer | Build the structural React UI: live charts, prediction panel, event explorer, alert banner. |
| **Mru** | Frontend Developer & Presentation Lead | Build the results experience (animations, metrics display, event playback), compile the PPT, and lead the demo narrative. |

---

## 📖 Team Glossary (Simple Explanations for PPT & Judges)

*(Use these simple definitions to make sure everyone is on the same page when talking to the judges!)*

**1. SoLEXS (Soft X-rays)**
SoLEXS measures "cooler" X-rays from the Sun (1–55 keV). When a solar flare happens, the soft X-ray signal rises smoothly like a slow wave. SoLEXS tells us *how much energy* the flare is releasing overall.

**2. HEL1OS (Hard X-rays)**
HEL1OS measures "hotter" X-rays (10–150 keV). Hard X-rays come from super-fast electrons crashing into the Sun's atmosphere. The signal is very spiky and bursty — it's the *earliest* sign we can detect that a flare has started.

**3. Fusion (Our Secret Weapon)**
Instead of using SoLEXS or HEL1OS alone, we combine them. Think of it like: HEL1OS gives us the *smoke alarm* (early detection), and SoLEXS gives us the *thermometer* (how bad is the fire). Together, they make much better predictions.

**4. CNN (Convolutional Neural Network)**
A type of AI that's great at finding patterns in sequences. In our project, the CNN scans the X-ray time-series looking for tell-tale spike patterns — like looking for ripples in a pond to find where a stone was thrown.

**5. LSTM (Long Short-Term Memory)**
An AI that has "memory." While a CNN looks at individual spike patterns, the LSTM remembers what the X-ray signal looked like 5 minutes ago and uses that context to decide if a flare is growing stronger.

**6. CNN-LSTM Hybrid**
Our best model. We use a CNN to find the initial flare spikes (HXR), feed those into an LSTM that tracks how the flare evolves over time (SXR), and then predict both the flare class and peak flux together.

**7. Nowcasting vs Forecasting**
- **Nowcasting:** Is a flare happening *right now*? (Like checking if it's raining outside.)
- **Forecasting:** Will a big flare happen *soon*? (Like predicting a storm before the first thunderclap.)

**8. HSS (Heidke Skill Score) & TSS (True Skill Score)**
The math formulas we use to prove to judges our model is better than random guessing.
- **HSS = 1:** Perfect predictions every time.
- **HSS = 0:** No better than flipping a coin.
- **TSS:** Measures how well we separate "flare happening" from "no flare happening." Higher is better.

**9. Detection Latency**
The time between when a flare actually starts and when our model first detects it. We want this as close to **0 seconds** as possible. Every second of delay matters for protecting satellites and power grids.

**10. Focal Loss**
A smart math trick for training our AI. Since big X-class flares are very rare, the AI would normally ignore them (because it almost never sees one). Focal Loss tells the AI to pay extra attention to the rare, dangerous flares — so it learns to predict them even though they're uncommon.

**11. W&B (Weights & Biases)**
An online dashboard where we log every experiment. It automatically saves our training results, hyperparameters, and model weights, so we don't lose progress and can compare which approach works best.

**12. F1 Score**
A single number that balances *precision* (are our flare detections real?) and *recall* (did we catch all the flares?). A score of 1.0 means every flare we detected was real, and we didn't miss any.

**13. Event-Level Evaluation**
We don't just check if our model is right every second. We check: Did it detect the *entire flare event*? Was it early? Did it correctly call it an M-class vs X-class? This is what matters for actual space weather operations.

**14. Onyx / TorchScript**
A tool that "compresses" our trained AI so it runs 2–3x faster. We save this for the final 30-hour sprint so our demo runs lightning-fast on any laptop during the judge presentation.

---

<div align="center">
  <sub>
    <strong>Team SIRIus</strong> — ISRO Hackathon 2026, Space Weather Track.
    <br>
    <em>From X-ray photons to space weather protection.</em>
  </sub>
</div>
