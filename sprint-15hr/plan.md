# ADITYA-L1 SOLAR FLARES — Sprint Build Plan (15 Hours)

> **Document Type:** Build Plan · **Status:** Active · **Estimated Duration:** 15 Hours
> **Project:** Aditya-L1 Solar Flares Frontend · **Theme:** Solar Intelligence in Motion

---

## Table of Contents

1. [Executive Vision](#1-executive-vision)
2. [Creative Direction](#2-creative-direction)
3. [Design System: Color](#3-design-system-color)
4. [Design System: Typography](#4-design-system-typography)
5. [Build Scope & Delivery](#5-build-scope--delivery)
6. [Content Standards](#6-content-standards)
7. [Definition of Success](#7-definition-of-success)
8. [Delivery Target](#8-delivery-target)

---

## 1. Executive Vision

Build a **premium, visually immersive, motion-first frontend** for the Aditya-L1 mission and solar flare phenomenon. The result must feel bold, technically precise, and cinematic — a scientific microsite that communicates authority and wonder in equal measure.

### What We Are Building

| This is NOT... | This IS... |
|---|---|
| A generic landing page | A premium scientific microsite |
| A static educational page | A motion-led storytelling experience |
| A cluttered dashboard | A focused, cinematic landing experience |
| Random visual effects | Motion with narrative purpose |

### Core Experience Pillars

1. **Hero Impact** — The first scroll-stop moment must feel unmistakably premium
2. **Scroll Story** — A signature 4-act interactive sequence that is the emotional core
3. **Scientific Clarity** — Mission and flare explainers that teach without overwhelming
4. **Responsive Integrity** — Flawless behavior across 375px–1440px
5. **Polished Demo** — Deployable, stable, and presentable to stakeholders

---

## 2. Creative Direction

### Visual Personality

| Trait | How It Manifests |
|---|---|
| **Confident** | Large typography, uncluttered composition, generous whitespace |
| **Precise** | Clean grid discipline, controlled motion curves, restrained color usage |
| **Scientific** | Monospace data accents, technical UI language, metric-driven layouts |
| **Visionary** | Deep-space atmosphere, solar glow gradients, cinematic pacing |

### Emotional Spectrum

```
PRECISION ────────────────────────────── WONDER
     ↑                                        ↑
 Engineering clarity               Solar-scale awe
 Credibility                       Visual immersion
```

The experience should feel like **engineered wonder** — the intersection of rigorous science and visual poetry.

### Design Principles

- **Dark-first canvas** — Deep space backgrounds let solar colors burn brightest
- **Motion with purpose** — Every animation serves comprehension, not decoration
- **Atmospheric depth** — Layered backgrounds (stars, core glow, particle drift) create immersion
- **Data-inspired UI** — Metrics and labels use technical typography and subtle glassmorphism

---

## 3. Design System: Color

### Base Palette (80% of visual area)

| Token | Hex | Usage |
|---|---|---|
| Deep Black | `#05070B` | Page background |
| Space Navy | `#0A1020` | Section backgrounds, cards |
| Charcoal | `#111827` | UI surfaces, borders |

### Solar Palette (15% of visual area)

| Token | Hex | Usage |
|---|---|---|
| Plasma Orange | `#FF7A00` | Primary accent, CTA, flare X |
| Flare Gold | `#FFB347` | Secondary accent, flare M |
| Eruption Red | `#FF4D36` | Urgency, extreme events, flare XX |
| Corona Amber | `#FFC857` | Highlights, subtle glows |

### Scientific Accent Palette (5% of visual area)

| Token | Hex | Usage |
|---|---|---|
| Instrument Cyan | `#55D6FF` | Data points, measurement UI |
| Telemetry Blue | `#4EA8DE` | Links, secondary information |
| Signal Violet | `#8B5CF6` | Special badges, spacecraft elements |

### Color Application Rules

- Solar tones are **reserved for emphasis** — they draw attention where it matters
- Scientific accents appear only on **data-related elements** (metrics, labels, instruments)
- Never apply more than **one solar tone per section** to avoid visual noise
- Dark backgrounds use **luminance contrast** rather than saturation to create depth

---

## 4. Design System: Typography

### Font Stack

| Role | Font | Weight | Usage |
|---|---|---|---|
| Display | **Space Grotesk** | 600–700 | Hero headline, section headings |
| Body | **Inter** | 300–500 | Paragraphs, descriptions, UI copy |
| Mono | **JetBrains Mono** | 400–500 | Metrics, data labels, technical content |

### Type Scale

```text
Level          Size                          Line Height
──────────────────────────────────────────────────────────
Hero           clamp(3.5rem, 8vw, 8rem)     1.1
Section Title  clamp(2rem, 4vw, 4.5rem)      1.2
Subheading     clamp(1.25rem, 2vw, 1.75rem)  1.3
Body           1rem                           1.6
Small          0.875rem                       1.5
Mono Metric    0.875rem–1rem                  1.4
```

### Typography Rules

- Hero text should be **uppercase** for maximum impact
- Section headings use **sentence case** for readability
- Body copy max-width: `65ch` for comfortable reading
- Mono text only for data — never for prose
- No font weights below 300 or above 700

---

## 5. Build Scope & Delivery

### Sections to Build

| # | Section | Purpose | Duration Estimate |
|---|---|---|---|
| 1 | **Hero** | First impression, cinematic impact | 3h |
| 2 | **Scroll Story** | Signature 4-act interactive sequence | 4h |
| 3 | **Mission Overview** | Explain Aditya-L1 clearly | 2h |
| 4 | **Solar Flares Explainer** | Teach flare classes and meaning | 2.5h |
| 5 | **Footer CTA** | Clean final impression | 1h |
| — | **Polish & Deploy** | QA, responsive fixes, Vercel deploy | 2.5h |

### Priority Escalation

If time is constrained, sections should be built in this order:

```
1. Hero ─── Highest priority (makes or breaks first impression)
2. Scroll Story ─── Signature experience (differentiator)
3. Mission ─── Core educational content
4. Flares ─── Secondary educational content
5. Footer ─── Can be minimal if needed
6. Polish ─── Only after all sections are functional
```

### What Is NOT in Scope (Sprint)

- Animations API platform (anime.js)
- Payload / instrument detail pages
- Telemetry data visualization
- Image gallery or media viewer
- Timeline/history section
- Blog or article system
- Backend API or database

---

## 6. Content Standards

### Tone Guidelines

Writing should be:

```
Concise · Scientific · Clear · Powerful
```

- **Concise:** Every sentence earns its place. No filler.
- **Scientific:** Accurate terminology, no oversimplification that misleads.
- **Clear:** A layperson should understand the core message.
- **Powerful:** Use active voice. Strong verbs. Declarative statements.

### Example Content

> **Mission heading:** "Watching the Sun, Uninterrupted"
>
> **Body:** "Aditya-L1 positions seven scientific instruments at the Sun–Earth L1 point — 1.5 million kilometers from Earth — to observe dynamic solar activity with uninterrupted precision. From this vantage, the mission captures the full chain of solar events: from magnetic buildup on the surface to the eruption of flares and coronal mass ejections."
>
> **Flare explainer:** "Solar flares are intense localized bursts of electromagnetic radiation, driven by the sudden release of magnetic energy stored in the Sun's atmosphere. They are classified by their X-ray peak brightness — from B-class (minor) to X-class (major) — with each class representing a tenfold increase in energy."

---

## 7. Definition of Success

By the end of the 15-hour build, all of the following must be true:

- [ ] Hero section feels premium, original, and visually arresting
- [ ] Scroll story transitions smoothly through all 4 narrative acts
- [ ] Mission and Flares sections are educationally clear and visually polished
- [ ] Mobile layout holds up cleanly at 375px without horizontal overflow
- [ ] `prefers-reduced-motion` is respected across all animations
- [ ] `npm run build` passes with zero errors
- [ ] Deployed to Vercel and stable on a live URL

---

## 8. Delivery Target

A polished landing page that enables a viewer to confidently answer:

1. **What is Aditya-L1?** — India's first dedicated solar observatory at L1
2. **Why do solar flares matter?** — They affect space weather, communications, and power grids
3. **How does the mission observe solar activity?** — 7 instruments, continuous monitoring
4. **Why does this project feel impressive?** — Cinematic narrative meets scientific rigor

---

*This document is the single source of truth for the sprint build. All team members should reference it for scope, priorities, and design direction.*
