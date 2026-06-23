# MOTION SYSTEM — Aditya-L1 Solar Flares

> **Document Type:** Animation Specification · **Status:** Active · **Engine:** Motion for React
> **Last Updated:** 2026-06-24

---

## Table of Contents

1. [Motion Philosophy](#1-motion-philosophy)
2. [Animation Token System](#2-animation-token-system)
3. [Motion Tooling](#3-motion-tooling)
4. [Per-Section Animation Specs](#4-per-section-animation-specs)
5. [Reduced Motion](#5-reduced-motion)
6. [Performance Rules](#6-performance-rules)
7. [Reusable Motion Components](#7-reusable-motion-components)
8. [Implementation Patterns](#8-implementation-patterns)

---

## 1. Motion Philosophy

### The Four Laws of Motion

| # | Law | Meaning | Example |
|---|-----|---------|---------|
| 1 | **Motion explains hierarchy** | Important elements move more clearly, with greater emphasis | Hero heading has word stagger + 200ms gap; body text has simple fade |
| 2 | **Motion creates atmosphere** | Ambient, looping motion builds the world and makes it feel alive | Starfield slow drift, solar core glow pulse |
| 3 | **Motion preserves legibility** | No animation should make content harder to read or understand | Text is fully visible before animation completes; reduced motion skips entrance |
| 4 | **Motion intensifies with importance** | Animation complexity scales with content significance | Hero > section heading > body copy > decorative element |

### Motion Hierarchy Pyramid

```
        ┌──────────────────────────────────────┐
        │     HERO STAGGER (most complex)       │  ← Highest animation budget
        │  Word stagger + ambient loops + 3D    │
        ├──────────────────────────────────────┤
        │       SCROLL STORY (most dramatic)     │
        │  4-act progress-driven transforms      │
        ├──────────────────────────────────────┤
        │       SECTION REVEALS (consistent)     │
        │  Heading + body + cards stagger in     │
        ├──────────────────────────────────────┤
        │     UI INTERACTIONS (least complex)    │  ← Lowest animation budget
        │  Hover, focus, tap feedback            │
        └──────────────────────────────────────┘
```

---

## 2. Animation Token System

### Duration Tokens

| Token | Value | Usage |
|---|---|---|
| `micro` | **120ms** | Hover transitions, button feedback |
| `fast` | **200ms** | Small UI state changes, active states |
| `standard` | **500ms** | Section reveals, fades, entrance sequences |
| `slow` | **900ms** | Premium entrances, hero sub-content |
| `premium` | **1400ms** | Hero main stagger sequence, signature moments |
| `ambient` | **4000ms+** | Loops, drifting motion, continuous animation |

### Easing Tokens

| Token | Cubic Bézier | Feel | Usage |
|---|---|---|---|
| `ease-standard` | `[0.25, 0.1, 0.25, 1]` | Professional, smooth | Most animations |
| `ease-emphasis` | `[0.16, 1, 0.3, 1]` | Playful, energetic | Hero entrance, CTA |
| `ease-orbital` | `[0.45, 0, 0.55, 1]` | Natural, orbital | Ambient loops, starfield |
| `ease-out-expo` | `[0.19, 1, 0.22, 1]` | Decelerating impact | Flash effects, burst moments |

### Stagger Tokens

| Token | Value | Usage |
|---|---|---|
| `micro` | **20ms** | Very subtle sequential reveals |
| `tight` | **50ms** | Small groups of items |
| `standard` | **100ms** | Cards, metric chips, list items |
| `emphasis` | **200ms** | Hero word stagger, premium reveals |

### Color Animation Tokens

| Property | Duration | Easing |
|---|---|---|
| Background color | 300ms | ease-standard |
| Border color | 200ms | ease-standard |
| Opacity | 400ms | ease-standard |
| Box shadow/glow | 200ms | ease-standard |

---

## 3. Motion Tooling

### Primary Engine: Motion for React

Motion for React is the sole animation engine for this sprint build. It provides:

| Feature | API | Usage |
|---|---|---|
| Scroll-driven animation | `useScroll()` + `useTransform()` | Scroll story progression, parallax |
| Viewport detection | `useInView()` | Section reveal triggers |
| Staggered children | `stagger` + `variants` | Card reveals, metric chips |
| Gesture response | `whileHover`, `whileTap` | CTA button, flare cards |
| Reduced motion | `useReducedMotion()` | Accessibility compliance |
| Layout animation | `AnimatePresence` | Navbar state transitions |

### What Motion for React Is Used For

- Heading word-by-word reveals
- Section fade + y-shift entrances
- Card stagger sequences
- Scroll story progress-driven transforms
- Hover and focus state transitions
- Reduced motion fallbacks

### What Motion for React Is NOT Used For (Sprint)

- Complex timeline sequencing (deferred to anime.js in Phase 2)
- Canvas-based particle systems (3D uses R3F/Drei)
- Physics-based spring simulations (beyond sprint scope)

---

## 4. Per-Section Animation Specs

### 4.1 Hero Section

#### Ambient Background

```
Element:     Starfield (drei <Stars />)
Animation:   Continuous slow rotation
Rotation:    0.001 rad/s around Y axis
Motion:      useFrame() in R3F loop

Element:     Solar Core (@shadergradient/react)
Animation:   Continuous glow pulse
Pulse:       opacity oscillates ±10% over 4000ms
Easing:      ease-orbital
```

#### Headline Stagger Sequence

```
Element:     AnimatedHeading ("SOLAR INTELLIGENCE IN MOTION")
Animation:   Word-by-word stagger reveal

Each word:
  Initial:      opacity: 0, y: 40px
  Animate:      opacity: 1, y: 0px
  Duration:     800ms (per word)
  Stagger:      200ms (emphasis)
  Easing:       ease-emphasis [0.16, 1, 0.3, 1]

Sequence:
  Word "SOLAR"         at t=800ms
  Word "INTELLIGENCE"  at t=1000ms
  Word "IN"            at t=1200ms
  Word "MOTION"        at t=1400ms
```

#### Subheadline

```
Element:     <p> subtitle
Animation:   Fade + y shift
Initial:     opacity: 0, y: 20px
Animate:     opacity: 1, y: 0px
Duration:    800ms
Delay:       400ms after last heading word (t=1800ms)
Easing:      ease-standard
```

#### CTA Button

```
Element:     GlowButton ("Explore the Mission")
Entrance:
  Initial:     opacity: 0, scale: 0.95
  Animate:     opacity: 1, scale: 1
  Duration:    500ms
  Delay:       400ms after subheadline (t=2200ms)
  Easing:      ease-emphasis

Hover:
  Scale:       1.02
  Glow:        box-shadow intensifies from transparent to plasma-orange/40%
  Duration:    200ms
  Easing:      ease-standard

Tap/Click:
  Scale:       0.98
  Duration:    120ms
```

---

### 4.2 Standard Section Reveal (Mission & Flares)

**Applied to:** Mission section and Flares section headings, body, and cards.

#### Heading

```
Initial:      opacity: 0, y: 30px
Animate:      opacity: 1, y: 0px
Duration:     700ms
Trigger:      useInView (once, threshold 0.2)
Easing:       ease-standard
```

#### Body Copy

```
Initial:      opacity: 0, y: 20px
Animate:      opacity: 1, y: 0px
Duration:     600ms
Delay:        300ms after heading triggers
Easing:       ease-standard
```

#### Cards / Metric Chips

```
Initial:      opacity: 0, y: 40px, scale: 0.95
Animate:      opacity: 1, y: 0px, scale: 1
Duration:     500ms
Stagger:      60–80ms (tight to standard)
Delay:        400ms after body triggers
Easing:       ease-standard
```

---

### 4.3 Flare Card Hover States

#### Default → Hover

```
Property:     border-color
From:         transparent (or subtle white/10)
To:           class-specific color (e.g., #FF7A00 for X-class)
Duration:     200ms
Easing:       ease-standard

Property:     background-color
From:         space-navy (#0A1020)
To:           space-navy + class color at 10% opacity
Duration:     200ms

Property:     box-shadow (glow)
From:         none
To:           0 0 20px class-color/20%
Duration:     200ms
```

**Rules:**
- No scale transforms on hover (avoids layout shift when combined with entrance animation)
- Color-only transitions for reduced motion users
- Multiple cards can be hovered simultaneously (no exclusive state)

---

### 4.4 Scroll Story

This is the **highest-animation-budget section** of the entire build.

#### Technical Setup

```typescript
const { scrollYProgress } = useScroll({
  target: containerRef,
  offset: ['start start', 'end end'],
});
```

- Section: `h-[500vh]` (5 screens of scroll)
- Inner frame: `sticky top-0 h-screen overflow-hidden`
- Progress: `0.0 → 1.0` mapped across 500vh

#### Visual Property Mappings

Each act's visual state is derived from `scrollYProgress` via `useTransform`:

```
Progress 0.00 – 0.25: Act 1 — Quiet Sun
  ├─ sunScale:       0.8 → 0.85
  ├─ glowIntensity:  0.2 → 0.35
  ├─ flashOpacity:   0 (inactive)
  ├─ backgroundColor: deep warm (#0A0505 → #1A0A05)
  └─ particleSpeed:  0.2 → 0.3

Progress 0.25 – 0.50: Act 2 — Activity Buildup
  ├─ sunScale:       0.85 → 0.95
  ├─ glowIntensity:  0.35 → 0.6
  ├─ flashOpacity:   0 (inactive)
  ├─ backgroundColor: amber shift (#1A0A05 → #2A1500)
  └─ particleSpeed:  0.3 → 0.6

Progress 0.50 – 0.70: Act 3 — Flare Burst
  ├─ sunScale:       0.95 → 1.2 (peak at 0.55)
  ├─ glowIntensity:  0.6 → 1.0 (peak at 0.55)
  ├─ flashOpacity:   0 → 0.9 (sharp spike at 0.52–0.58, then fade to 0.2)
  ├─ expandingRing:  0 → 1 (scale from 0.5 to 3, opacity fades)
  ├─ backgroundColor: white-hot (#FF4500 → #FFFFFF at peak)
  └─ particleSpeed:  0.6 → 1.0 (burst)

Progress 0.70 – 1.00: Act 4 — Observation
  ├─ sunScale:       1.2 → 1.0 (settle)
  ├─ glowIntensity:  0.6 → 0.5 (stable warm)
  ├─ flashOpacity:   0.2 → 0
  ├─ spacecraftOpacity: 0 → 1 (fade in at 0.75)
  ├─ dataLineDraw:   0 → 1 (SVG path length animation at 0.80)
  ├─ backgroundColor: warm with blue accent (#3A2010 → #1A1520)
  └─ particleSpeed:  0.6 → 0.3 (calm)
```

#### SVG Animation Patterns

For the expanding ring and data line, use SVG stroke-dasharray animation:

```typescript
// Expanding ring
const ringScale = useTransform(scrollYProgress, [0.5, 0.6], [0.5, 3]);
const ringOpacity = useTransform(scrollYProgress, [0.5, 0.55, 0.7], [0, 0.8, 0]);

// Data line draw
const lineProgress = useTransform(scrollYProgress, [0.78, 0.92], [0, 1]);
const lineDashOffset = useTransform(lineProgress, (v) => 100 - v * 100);
```

---

## 5. Reduced Motion

### Implementation

Use Motion's `useReducedMotion()` hook at the component level:

```typescript
import { useReducedMotion } from 'motion/react';

function AnimatedHeading({ text }: { text: string }) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    // Static render: all words visible immediately
    return <h1>{text}</h1>;
  }

  // Full animation
  return <motion.h1>…</motion.h1>;
}
```

### Behavior Mapping

| Normal Experience | Reduced Motion Alternative |
|---|---|
| Staggered word-by-word heading reveal | All words appear together immediately |
| Scroll-driven transform progression | Static midpoint state (act 2 visual for story) |
| Ambient loops (starfield drift, glow pulse) | Static state (single frame) |
| Hover transforms (scale, translate) | Color-only change (border, background) |
| Count-up or entrance stagger on metrics | Immediate final value, simultaneous fade-in |
| Glow pulse on CTA | Static glow, no pulse |
| Particle drift in scroll story | No particles, text-only narrative |

### Design for Reduced Motion

The reduced motion experience should still be:
- **Complete** — All content is still present
- **Readable** — Text transitions are simplified but not removed
- **Navigable** — Scroll still moves through sections
- **Beautiful** — Static compositions should still look considered

---

## 6. Performance Rules

1. **Animate only `transform` and `opacity`.** Never animate `width`, `height`, `top`, `left`, `margin`, `padding` — these trigger layout recalculations and repaints.

2. **Use `will-change` sparingly.** Only apply `will-change: transform` to elements that animate continuously (starfield, solar core). Remove after animation completes for entrance sequences.

3. **Keep ambient loops subtle.** Continuous animations should be low-intensity (opacity oscillations, slow rotations). Reserve high-intensity animations for triggered sequences.

4. **Lazy-load hero 3D.** The R3F canvas is wrapped in `dynamic()` and loads after the initial render. Hero text must be visible before 3D appears.

5. **Reserve highest animation intensity for scroll story.** The scroll story has the most animation budget because it's the signature experience. All other sections use conservative reveals.

6. **Avoid nesting animated elements more than 2 levels deep.** Each level of Motion components adds overhead. Flatten where possible.

7. **Use `once: true` with `useInView` for section triggers.** Sections reveal once and stay visible. No re-triggering on scroll-back.

---

## 7. Reusable Motion Components

| Component | Purpose | API |
|---|---|---|
| `AnimatedHeading` | Word-staggered heading reveal | `text: string`, `className?: string` |
| `RevealGroup` | Stagger reveal wrapper for children | `children`, `delay?: number` |
| `StaggerContainer` | Auto-staggers direct children | `children`, `staggerDelay?: 0.1` |
| `GlowButton` | CTA with hover/tap glow feedback | `children`, `onClick?`, `href?` |
| `MetricChip` | Data metric with entrance animation | `label: string`, `value: string` |

---

## 8. Implementation Patterns

### Pattern 1: Scroll-Triggered Reveal

```typescript
'use client';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

export function RevealGroup({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

### Pattern 2: Word Stagger

```typescript
'use client';
import { motion } from 'motion/react';

export function AnimatedHeading({ text }: { text: string }) {
  const words = text.split(' ');

  return (
    <h1 className="inline-flex flex-wrap gap-[0.2em]">
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: i * 0.2,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </h1>
  );
}
```

### Pattern 3: Scroll-Driven Story

```typescript
'use client';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

export function ScrollStorySection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const sunScale = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.55, 0.7, 1], [0.8, 0.85, 0.95, 1.2, 1.0, 1.0]);
  const glowIntensity = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.55, 0.7, 1], [0.2, 0.35, 0.6, 1.0, 0.6, 0.5]);

  return (
    <section ref={containerRef} className="relative h-[500vh]" id="story">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div style={{ scale: sunScale }}>
          {/* Solar visual */}
        </motion.div>
      </div>
    </section>
  );
}
```

---

*The motion system is the foundation of the visual identity. Every animation should feel intentional, disciplined, and in service of the narrative — never gratuitous.*
