# USER FLOW & SITE STRUCTURE — Aditya-L1 Solar Flares

> **Document Type:** UX Specification · **Status:** Active · **Build Target:** 15 Hours
> **Last Updated:** 2026-06-24

---

## Table of Contents

1. [Journey Overview](#1-journey-overview)
2. [Section Flow Specifications](#2-section-flow-specifications)
3. [Navigation Behavior](#3-navigation-behavior)
4. [Scroll Behavior Map](#4-scroll-behavior-map)
5. [Responsive Behavior Matrix](#5-responsive-behavior-matrix)
6. [Experience Principles](#6-experience-principles)

---

## 1. Journey Overview

The experience is a **guided narrative**, not a content dump. The user moves through five distinct phases, each building on the last:

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  HERO    │ →  │ MISSION  │ →  │  FLARES  │ →  │  STORY   │ →  │  FOOTER  │
│  Impact  │    │  Ground  │    │  Teach   │    │  Feel    │    │  Close   │
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
   awe          clarity        understanding    emotion         resolution
```

### Emotional Arc

```text
Emotional Intensity
        ↑
   HIGH  │          ╱╲
         │         ╱  ╲        ┌──── Hero peaks immediately
         │        ╱    ╲       │     Scroll story is the
         │   ┌───╱      ╲───┐  │     emotional summit
    MID  │   │  Hero     │  │  │
         │   │           │  │  │
         │   │  Mission  │  │  │
         │   │           │  ╲  │
         │   │  Flares   │   ╲ │
   LOW   │   └───────────┘    ╲│
         │                    Footer (calm resolution)
         └─────────────────────────────→ Scroll Depth
```

---

## 2. Section Flow Specifications

### 2.1 HERO — "Solar Intelligence in Motion"

**Purpose:** Establish visual authority within the first 500ms. This section must feel unmistakably premium.

**Sequenced Entrance (0–3s after page load):**

| Step | Element | Timing | Animation |
|---|---|---|---|
| 1 | Deep space background | 0ms | Instant (CSS background) |
| 2 | Starfield drift | 200ms | Continuous slow rotation |
| 3 | Solar core glow | 500ms | Fade in + glow pulse loop |
| 4 | Headline word 1 | 800ms | y: 40→0, opacity: 0→1 |
| 5 | Headline word 2 | 1000ms | y: 40→0, opacity: 0→1 |
| 6 | Headline word 3 | 1200ms | y: 40→0, opacity: 0→1 |
| 7 | Headline word 4 | 1400ms | y: 40→0, opacity: 0→1 |
| 8 | Subheadline | 1800ms | Fade + y shift |
| 9 | CTA button | 2200ms | Scale 0.95→1 + glow pulse |

**Emotion Target:** `awe + curiosity + confidence`

**User Should Think:** *"This is different. I want to scroll."*

---

### 2.2 MISSION OVERVIEW — "Watching the Sun, Uninterrupted"

**Purpose:** Ground the cinematic experience in real, credible science. This section validates that the visual spectacle has substance behind it.

**Scroll Sequence:**

| Step | Element | Trigger | Animation |
|---|---|---|---|
| 1 | Background darken | Section enters viewport | Subtle opacity shift |
| 2 | Heading reveals | 200ms after trigger | y: 30→0, opacity: 0→1, 700ms |
| 3 | Body paragraph 1 | 300ms after heading | y: 20→0, opacity: 0→1, 600ms |
| 4 | Body paragraph 2 | 200ms after p1 | y: 20→0, opacity: 0→1, 600ms |
| 5 | Metric 1 (L1 Point) | 400ms after content | Scale + fade in |
| 6 | Metric 2 (1.5M KM) | 60ms stagger | Scale + fade in |
| 7 | Metric 3 (24/7) | 60ms stagger | Scale + fade in |

**Emotion Target:** `clarity + credibility + interest`

**User Should Think:** *"I understand what Aditya-L1 does, and it sounds important."*

---

### 2.3 SOLAR FLARES EXPLAINER — "What is a Solar Flare?"

**Purpose:** Teach the science of solar flares simply and elegantly. Make classification intuitive through visual design.

**Scroll Sequence:**

| Step | Element | Trigger | Animation |
|---|---|---|---|
| 1 | Section background | Section enters viewport | Subtle shift |
| 2 | Heading | 200ms after trigger | Standard reveal |
| 3 | Explainer paragraph | 300ms after heading | Fade + y shift |
| 4 | Card: B-class | 400ms after paragraph | Stagger: y: 40→0, scale 0.95→1 |
| 5 | Card: C-class | 80ms stagger | Same |
| 6 | Card: M-class | 80ms stagger | Same |
| 7 | Card: X-class | 80ms stagger | Same |
| 8 | Card: XX-class | 80ms stagger | Same |

**Card Hover Behavior:**

| State | Effect |
|---|---|
| Default | Dark background, subtle border, class color accent |
| Hover | Border glow intensifies to class color, background brightens 15% |
| Reduced motion | Color-only change (no scale/transform) |

**Emotion Target:** `understanding + curiosity`

**User Should Think:** *"So that's how flares are classified. X-class means major — that orange one."*

---

### 2.4 SCROLL STORY — Signature Experience

**Purpose:** Deliver the main interactive payoff. This is the emotional summit of the entire experience — a 4-act miniature film controlled by the user's scroll.

**Mechanics:**
- Section height: **500vh** (5 viewport heights of scroll room)
- Inner frame: **`sticky top-0 h-screen`** — stays fixed while content scrolls through
- All transforms driven by `useScroll` + `useTransform` from Motion for React

**Act Progression (mapped to scroll progress 0→1):**

```
Progress:   0.0─────────0.25─────────0.50─────────0.75─────────1.0
            │            │            │            │            │
            │  Act 1     │  Act 2     │  Act 3     │  Act 4     │
            │  Quiet Sun │  Buildup   │  Flare     │  Obser-    │
            │            │            │  Burst     │  vation    │
```

#### Act 1 — Quiet Sun (progress: 0.00–0.25)

| Visual Element | Behavior |
|---|---|
| Background | Deep orange glow, low intensity |
| Solar disk | Stable circle, soft edges |
| Particles | Minimal, slow drift |
| Text | "The Sun, in its quiet state, radiates steady energy across the spectrum." |

**Mood:** Calm, patient, stable.

#### Act 2 — Activity Buildup (progress: 0.25–0.50)

| Visual Element | Behavior |
|---|---|
| Background | Brightening, transitioning to amber |
| Solar disk | Slight scale increase, surface texture hints |
| Arcs | Magnetic field lines begin appearing at disk edges |
| Particles | More active, faster movement |
| Text | "Magnetic energy accumulates in the solar atmosphere, twisting and stressing field lines." |

**Mood:** Tense, anticipatory, building.

#### Act 3 — Flare Burst (progress: 0.50–0.70)

| Visual Element | Behavior |
|---|---|
| Background | Peak brightness, white-hot center |
| Solar disk | Maximum scale, intense glow |
| Flash effect | Sharp opacity spike at 0.55 progress |
| Expanding ring | Circle expands outward from center |
| Particles | Rapid outward burst pattern |
| Text | "A flare erupts — an intense burst of radiation traveling at the speed of light." |

**Mood:** Explosive, dramatic, intense.

#### Act 4 — Observation (progress: 0.70–1.00)

| Visual Element | Behavior |
|---|---|
| Background | Cooling to warm orange with blue undertones |
| Solar disk | Settling back to normal scale |
| Spacecraft icon | Fades in at bottom-right |
| Data line | Draws from solar disk to spacecraft |
| Palette | Warm solar tones mix with scientific blue accent |
| Text | "Captured by Aditya-L1 in real-time, adding to our understanding of space weather." |

**Mood:** Resolved, meaningful, forward-looking.

**Emotion Target:** `wonder → tension → release → understanding`

**User Should Think:** *"That was beautiful. I just watched a flare happen and understood why it matters."*

---

### 2.5 FOOTER CTA — Closing Statement

**Purpose:** End strong and clean. Provide a sense of completion and purpose.

**Scroll Sequence:**

| Step | Element | Animation |
|---|---|---|
| 1 | Large closing statement | Fade + y shift |
| 2 | Supporting line | 200ms delay |
| 3 | CTA button | 400ms delay, glow pulse |
| 4 | Credits / ISRO acknowledgement | Subtle fade |

**Emotion Target:** `satisfaction + inspiration`

**User Should Think:** *"I learned something today. This was worth my time."*

---

## 3. Navigation Behavior

### Navbar States

| Scroll Position | Visual State | Interaction |
|---|---|---|
| **Top** (hero viewport) | Fully transparent, white text | Click nav items → smooth scroll to section |
| **Scrolled** (>100px) | `bg-space-black/80 backdrop-blur-md` with subtle bottom border | Same |
| **Mobile** (<768px) | Hamburger icon → Sheet overlay with full-height menu | Background dims, nav links stack vertically, close on tap |

### Nav Items

```text
[ Mission ]  [ Science ]  [ Story ]
```

Each item smooth-scrolls to its corresponding section using `scroll-behavior: smooth` or a small scroll-into-view handler.

### Active State

The current section's nav item receives a subtle bottom accent color (plasma-orange `#FF7A00`). This uses an Intersection Observer (or Motion's `useInView`) to track which section is currently visible.

---

## 4. Scroll Behavior Map

### Section Transitions

```text
   Hero          Mission         Flares        Scroll Story       Footer
┌─────────┐   ┌──────────┐   ┌──────────┐   ┌────────────┐   ┌──────────┐
│         │   │          │   │          │   │            │   │          │
│  Full   │ F │  Normal  │ S │  Normal  │ S │   Sticky   │ F │  Normal  │
│ viewport│ A │  scroll  │ T │  scroll  │ C │   500vh    │ A │  scroll  │
│  impact │ D │  reveal  │ A │  reveal  │ R │   frame    │ D │  reveal  │
│         │ E │          │ N │          │ O │            │ E │          │
│         │   │          │ D │          │ L │            │   │          │
└─────────┘   └──────────┘   └──────────┘   └────────────┘   └──────────┘
```

### Transition Effects

| Boundary | Effect | Duration | Notes |
|---|---|---|---|
| Hero → Mission | Fade + y shift | 600ms | Hero background fades into dark section bg |
| Mission → Flares | Standard reveal | 500ms | Clean transition, no crossfade |
| Flares → Story | Immediate sticky lock | 0ms | Next section is already at 100vh; user keeps scrolling |
| Story → Footer | Calm fade out | 800ms | Scroll story releases; footer reveals as content |

---

## 5. Responsive Behavior Matrix

| Section | Desktop (≥1024px) | Tablet (768–1023px) | Mobile (375–767px) |
|---|---|---|---|
| **Hero** | Full 3D canvas visible, large headline, CTA centered | 3D canvas reduced but present, slightly smaller headline | Simplified 3D (static starfield), compact headline, CTA full-width |
| **Mission** | 2-column layout: text left, metrics right | Stacked single column, metrics row | Single column, metrics stacked |
| **Flares** | 5 cards in horizontal row | 3+2 grid (top row 3, bottom row 2) | Single column scroll or 2-up grid |
| **Scroll Story** | Full 4-act sticky experience | Same narrative, slightly reduced visual intensity | Same narrative, simplified visuals (no particles), text more prominent |
| **Footer** | Spacious, CTA centered | Same | Compact padding, full-width CTA |

### Mobile-Specific Rules

- No 3D canvas on mobile (static gradient background replaces it)
- Scroll story uses larger text and simplified SVG visuals
- All animations respect `prefers-reduced-motion`
- Touch targets: minimum 44×44px for all interactive elements
- No hover-dependent interactions (tap to show flare card details instead)

---

## 6. Experience Principles

1. **Every section has a clear purpose.** If a section doesn't advance the narrative or teach something specific, remove it.

2. **Motion supports meaning, not decoration.** An animation must make the content easier to understand, not harder.

3. **The user should never feel lost.** Clear visual hierarchy, consistent navigation, and section headings that orient.

4. **Visual drama peaks in the scroll story.** The hero establishes quality; the scroll story delivers the emotional payoff. Everything else supports these two.

5. **The footer feels like a deliberate ending.** Not an afterthought. The closing statement should resonate.

6. **Mobile is not an afterthought.** The experience must work on a phone first; desktop is where it shines.

---

*This flow specification defines exactly what the user sees, feels, and thinks at every point in the journey.*
