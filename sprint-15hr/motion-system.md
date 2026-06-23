# SPRINT MOTION SYSTEM — Aditya-L1 Solar Flares (15-Hour Edition)

> **Complete animation language for our compressed build.**
> Full motion specs in `plan-18day/motion-system.md`.

---

## 1. MOTION PHILOSOPHY (Unchanged — The Four Laws)

| # | Law | Meaning |
|---|-----|---------|
| 1 | **Motion must explain hierarchy** | Important things move more prominently. Supporting elements stay subtle. |
| 2 | **Motion must create atmosphere** | Ambient motion builds the world. Intentional motion delivers the message. |
| 3 | **Motion must never reduce legibility** | If an animation makes text harder to read, it's wrong. |
| 4 | **Motion should intensify with importance** | A hero headline earns a dramatic entrance. A footnote just fades in. |

---

## 2. ANIMATION TOKENS (Simplified for speed)

### Duration Tokens

```
micro      120ms    Hover states, tap feedback
fast       200ms    Small UI toggles, active states
standard   500ms    Card reveals, section entrances, fade transitions
slow       900ms    Premium reveals, heading entrances
premium   1400ms    Hero headline stagger sequence
ambient   4000ms+   Continuous loops, starfield drift
```

### Easing Tokens (Cubic Bézier)

```
ease-standard   [0.25, 0.1, 0.25, 1.0]    Natural, neutral
ease-emphasis   [0.16, 1.0, 0.3, 1.0]     Premium, confident
ease-orbital    [0.45, 0.0, 0.55, 1.0]    Mechanical, scientific
```

### Stagger Tokens

```
micro      20ms     Grid items, dense groups
tight      50ms     Cards, menu items
standard  100ms     Sections, feature panels
emphasis  200ms     Hero headline words
```

---

## 3. ANIMATION ENGINE (Simplified)

**One engine for everything: Motion for React.**

| Capability | Motion API | Where |
|------------|-----------|-------|
| Element enter/exit | `animate`, `whileInView` | All sections |
| Scroll-linked transforms | `useScroll`, `useTransform` | Scroll story, parallax |
| Hover gestures | `whileHover`, `whileTap` | Buttons, cards |
| Staggered reveals | `stagger` in `animate` | Cards, flare grid |
| Reduced motion | `useReducedMotion` | Global compliance |

No anime.js today. No custom R3F shaders beyond shadergradient.

---

## 4. SECTION ANIMATION SPECIFICATIONS

### 4.1 HERO

```
┌─────────────────────────────────────────────────────┐
│                    HERO SEQUENCE                      │
├─────────────────────────────────────────────────────┤
│                                                       │
│  Step 1: BACKGROUND CANVAS                            │
│  - Starfield begins drifting (ambient, 8s loop)      │
│  - Solar core: shadergradient renders immediately     │
│  - Core begins slow rotation (auto via shadergradient)│
│                                                       │
│  Step 2: HEADLINE REVEAL (Motion for React)           │
│  ┌─────────────────────────────────────────────────┐ │
│  │  "SOLAR"          y: 40→0, op: 0→1  0ms        │ │
│  │  "INTELLIGENCE"   y: 40→0, op: 0→1  200ms      │ │
│  │  "IN MOTION"      y: 40→0, op: 0→1  400ms      │ │
│  │  Each word:       ease-emphasis, duration 800ms │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  Step 3: SUB-HEADLINE                                 │
│  - Fade + y: 20→0, delay: 700ms, duration: 600ms    │
│                                                       │
│  Step 4: CTA BUTTON                                   │
│  - Scale: 0.95→1, opacity: 0→1                       │
│  - Delay: 300ms after sub-headline                   │
│  - Duration: 500ms, ease-emphasis                    │
│  - On hover: scale 1.02, glow intensity +30%         │
│                                                       │
└─────────────────────────────────────────────────────┘
```

### 4.2 SECTION REVEALS (Mission, Flares)

```
┌─────────────────────────────────────────────────────┐
│              STANDARD SECTION REVEAL                  │
├─────────────────────────────────────────────────────┤
│  Trigger: element enters 85% of viewport              │
│                                                       │
│  Heading:                                             │
│    initial:  { opacity: 0, y: 30 }                   │
│    animate:  { opacity: 1, y: 0 }                    │
│    duration: 700ms, ease-emphasis                     │
│                                                       │
│  Body content:                                        │
│    initial:  { opacity: 0, y: 20 }                   │
│    animate:  { opacity: 1, y: 0 }                    │
│    duration: 600ms, ease-standard                     │
│    stagger: 100ms between elements                    │
│                                                       │
│  Cards / Grid items:                                  │
│    initial:  { opacity: 0, y: 40, scale: 0.95 }      │
│    animate:  { opacity: 1, y: 0, scale: 1 }          │
│    duration: 500ms, ease-standard                     │
│    stagger: 60ms between cards                        │
│                                                       │
└─────────────────────────────────────────────────────┘
```

### 4.3 FLARE CARDS

```
┌─────────────────────────────────────────────────────┐
│              FLARE CARD INTERACTION                   │
├─────────────────────────────────────────────────────┤
│  ENTER (scroll reveal):                              │
│  - Scale: 0.95→1, opacity: 0→1                       │
│  - Duration: 500ms, stagger: 80ms                    │
│  - Ease: ease-standard                               │
│                                                       │
│  HOVER ENTER (150ms):                                 │
│  - Border: transparent → class-colored glow          │
│  - Background: base → +5% brightness                 │
│  - Cursor: pointer                                   │
│                                                       │
│  HOVER EXIT (200ms):                                  │
│  - Reverse all properties                             │
│                                                       │
└─────────────────────────────────────────────────────┘
```

### 4.4 SCROLL STORY — The Signature

```
┌─────────────────────────────────────────────────────┐
│              SCROLL STORY — 4 ACT STRUCTURE          │
├─────────────────────────────────────────────────────┤
│                                                       │
│  SETUP:                                              │
│  - Section is h-[500vh], inner div is sticky h-screen│
│  - Scroll progress mapped to 0→1 via useTransform    │
│  - All scene elements are DOM (no R3F canvas)        │
│                                                       │
│  ACT 1 — QUIET SUN (0.00–0.25)                       │
│  ┌─────────────────────────────────────────────────┐ │
│  │  Background: warm amber (#FF7A00 at 15% opacity) │ │
│  │  Circle: large, soft glow, calm pulse            │ │
│  │  Text: "The Sun, in its quiet state..."          │ │
│  │  → fades in at 0.05, out at 0.20                │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  ACT 2 — ACTIVITY BUILDUP (0.25–0.50)                │
│  ┌─────────────────────────────────────────────────┐ │
│  │  Background: brightens (#FF7A00 at 30% opacity)  │ │
│  │  Circle: scale 1→1.1, surface arcs via SVG      │ │
│  │  Text: "Magnetic energy accumulates..."          │ │
│  │  → fades in at 0.30, out at 0.45                │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  ACT 3 — FLARE BURST (0.50–0.75)                     │
│  ┌─────────────────────────────────────────────────┐ │
│  │  Background: white-hot (#FFFFFF at 20% opacity)  │ │
│  │  Circle: max scale 1.2, expanding ring           │ │
│  │  Flash element: opacity pulses at burst peak     │ │
│  │  Text: "A flare erupts..."                       │ │
│  │  → fades in at 0.55, out at 0.70                │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  ACT 4 — OBSERVATION (0.75–1.00)                     │
│  ┌─────────────────────────────────────────────────┐ │
│  │  Background: cool scientific blue               │ │
│  │  Spacecraft icon: fades in (simple SVG/div)     │ │
│  │  Data lines: stroke-dasharray 0→1               │ │
│  │  Text: "Captured by Aditya-L1 in real-time..."   │ │
│  │  → fades in at 0.80, stays till end             │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
└─────────────────────────────────────────────────────┘
```

### 4.5 METRIC COUNTERS (Mission section)

```
┌─────────────────────────────────────────────────────┐
│              METRIC COUNTER ANIMATION                 │
├─────────────────────────────────────────────────────┤
│  Trigger: counter enters viewport                     │
│  Duration: 1500ms, ease-standard                     │
│  Implementation: Motion's `animate` with number       │
│  From: 0 → target value                              │
│  Format: locale-aware (e.g., "1.5M", "24/7")         │
└─────────────────────────────────────────────────────┘
```

---

## 5. REDUCED MOTION COMPLIANCE

```typescript
import { useReducedMotion } from 'motion/react';

const shouldReduceMotion = useReducedMotion();
```

| Animation Type | Normal | Reduced Motion |
|---------------|--------|----------------|
| Stagger sequences | Full stagger | All items appear simultaneously |
| Scroll-linked transforms | Progress-driven | Static at midpoint |
| Continuous ambient | Loops | Static initial state |
| Hover animations | Full hover sequence | Color change only |
| Counter animations | Animate over 1.5s | Show final value immediately |
| Hero headline | 200ms stagger | All words together |

---

## 6. PERFORMANCE GUIDELINES

| Rule | Why |
|------|-----|
| Use `transform` and `opacity` only | GPU-composited, no layout thrashing |
| Avoid animating `width`, `height`, `top`, `left` | Triggers layout recalculation |
| Keep canvas particle count under 5,000 | GPU memory |
| Dynamic import for 3D components | Don't load three.js until hero is in view |
| Use `will-change: transform` sparingly | Overuse consumes GPU memory |

---

## 7. REUSABLE MOTION COMPONENTS

| Component | What It Does | Used In |
|-----------|-------------|---------|
| `RevealGroup` | Staggered scroll reveal for children | Mission, Flares |
| `AnimatedHeading` | Word-staggered heading reveal | Hero, all sections |
| `StaggerContainer` | Auto-staggers direct children | Flare cards |
| `GlowButton` | Button with glow + hover scale | Hero, Footer |
| `Counter` | Animated number transitions | Mission metrics |

---

*Full motion system (including anime.js specs and per-section AMP pages): `plan-18day/motion-system.md`.*
