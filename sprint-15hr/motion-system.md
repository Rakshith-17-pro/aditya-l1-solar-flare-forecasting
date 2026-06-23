# MOTION SYSTEM — Aditya-L1 Solar Flares

> The animation language for the build.

---

## 1. MOTION PHILOSOPHY

### Four laws

| # | Law | Meaning |
|---|-----|---------|
| 1 | Motion explains hierarchy | Important elements move more clearly |
| 2 | Motion creates atmosphere | Ambient motion builds the world |
| 3 | Motion preserves legibility | No animation should hurt readability |
| 4 | Motion intensifies with importance | Hero > section > detail |

---

## 2. ANIMATION TOKENS

### Durations

```text
micro      120ms   Hover transitions
fast       200ms   Small UI state changes
standard   500ms   Section reveals, fades
slow       900ms   Premium entrances
premium   1400ms   Hero stagger sequence
ambient   4000ms+  Loops and drifting motion
```

### Easings

```text
ease-standard   [0.25, 0.1, 0.25, 1]
ease-emphasis   [0.16, 1, 0.3, 1]
ease-orbital    [0.45, 0, 0.55, 1]
```

### Staggers

```text
micro      20ms
tight      50ms
standard  100ms
emphasis  200ms
```

---

## 3. MOTION TOOLING

**Primary engine: Motion for React**

Use it for:
- heading reveals
- section reveals
- hover states
- sticky scroll story transforms
- reduced motion handling

---

## 4. SECTION SPECS

### 4.1 Hero

**Background**
- Starfield drifts slowly
- Solar core glows continuously

**Headline**
- Word stagger
- `y: 40 → 0`
- `opacity: 0 → 1`
- duration: `800ms`
- stagger: `200ms`

**Subheadline**
- fade + y shift
- delayed after heading

**CTA**
- scale `0.95 → 1`
- fade in
- hover scale `1.02`
- glow intensity increases on hover

---

### 4.2 Standard Section Reveal

Used by Mission and Flares.

**Heading**
- initial: `opacity 0, y 30`
- visible: `opacity 1, y 0`
- duration: `700ms`

**Body copy**
- initial: `opacity 0, y 20`
- visible: `opacity 1, y 0`
- duration: `600ms`

**Cards**
- initial: `opacity 0, y 40, scale 0.95`
- visible: `opacity 1, y 0, scale 1`
- duration: `500ms`
- stagger: `60–80ms`

---

### 4.3 Flare Cards

**Reveal**
- scroll-triggered stagger

**Hover**
- border glow intensifies to class color
- background brightness increases slightly
- no aggressive transforms

---

### 4.4 Scroll Story

This is the highest-motion section.

#### Act 1 — Quiet Sun
- soft glow
- stable circle
- low intensity color

#### Act 2 — Buildup
- brighter surface
- arcs begin appearing
- subtle scale increase

#### Act 3 — Burst
- high-intensity flash
- expanding ring
- strongest brightness shift

#### Act 4 — Observation
- spacecraft icon fades in
- data line draws in
- warm palette mixes with scientific blue

### Scroll story mechanics
- section height: `500vh`
- inner frame: `sticky top-0 h-screen`
- all transforms driven by `useScroll` + `useTransform`
- use DOM/SVG, not heavy 3D

---

## 5. REDUCED MOTION

Use `useReducedMotion()`.

### Rules

| Normal | Reduced |
|--------|---------|
| staggered heading | all words appear together |
| animated scroll transforms | static midpoint state |
| ambient loops | static state |
| hover transforms | color-only change |
| count-up metrics | immediate final value |

---

## 6. PERFORMANCE RULES

1. Animate `transform` and `opacity` only
2. Avoid layout-triggering properties
3. Keep loops subtle
4. Keep hero visuals lazy-loaded
5. Reserve highest intensity for the scroll story

---

## 7. REUSABLE MOTION COMPONENTS

| Component | Purpose |
|-----------|---------|
| `AnimatedHeading` | Word-staggered heading reveal |
| `RevealGroup` | Stagger reveal wrapper |
| `StaggerContainer` | Auto-staggers children |
| `GlowButton` | CTA hover feedback |
| `MetricChip` | Metric entrance animation |

---

*The site should feel disciplined, cinematic, and controlled — never noisy.*
