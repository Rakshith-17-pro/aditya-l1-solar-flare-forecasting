# FRONTEND ARCHITECTURE — Aditya-L1 Solar Flares

> **Document Type:** Technical Architecture · **Status:** Active · **Build Target:** 15 Hours
> **Last Updated:** 2026-06-24

---

## Table of Contents

1. [Technology Stack](#1-technology-stack)
2. [Architecture Decisions](#2-architecture-decisions)
3. [Project Structure](#3-project-structure)
4. [Component Tree](#4-component-tree)
5. [Data Model](#5-data-model)
6. [Performance Rules](#6-performance-rules)
7. [Quality Gates](#7-quality-gates)

---

## 1. Technology Stack

### Layer Architecture

```
┌─────────────────────────────────────────────────────┐
│                   PRESENTATION                       │
│   Next.js App Router · shadcn/ui · Tailwind CSS     │
├─────────────────────────────────────────────────────┤
│                   ANIMATION                          │
│   Motion for React (DOM transforms + scroll)        │
├─────────────────────────────────────────────────────┤
│                   3D / ATMOSPHERE                    │
│   React Three Fiber · Drei · @shadergradient/react  │
├─────────────────────────────────────────────────────┤
│                   FOUNDATION                         │
│   TypeScript · Node 20+ · npm                        │
└─────────────────────────────────────────────────────┘
```

### Detailed Dependency Table

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Framework | **Next.js** (App Router) | 15+ | Production React framework with file-based routing |
| Language | **TypeScript** | 5.x | Type safety, better DX, self-documenting code |
| Styling | **Tailwind CSS** | 4.x | Utility-first design system with rapid iteration |
| UI Primitives | **shadcn/ui** | latest | Accessible, unstyled components (Button, Card, Sheet, Tooltip) |
| Animation Engine | **Motion for React** | 12.x | Scroll-driven animations, staggered reveals, hover states |
| 3D Rendering | **React Three Fiber** | 8.x | Declarative Three.js for React |
| 3D Helpers | **@react-three/drei** | 9.x | Stars, camera controls, environment helpers |
| Shader Gradient | **@shadergradient/react** | latest | GPU-accelerated solar core visual |
| Peer Dep | **three** | 0.170+ | WebGL library (required by R3F) |

### Scaffolding Commands

```bash
# 1. Create Next.js project
npx create-next-app@latest aditya-l1-frontend \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*"

# 2. Enter project
cd aditya-l1-frontend

# 3. Install animation + 3D dependencies
npm install motion three @react-three/fiber @react-three/drei @shadergradient/react

# 4. Initialize shadcn/ui
npx shadcn@latest init -d

# 5. Add required UI components
npx shadcn@latest add button card sheet tooltip

# 6. Install type definitions
npm install -D @types/three
```

---

## 2. Architecture Decisions

### ADR-001: Motion for React over anime.js for Sprint

**Context:** The full 18-day vision includes anime.js for complex timeline-based animations. The sprint must ship in 15 hours.

**Decision:** Use Motion for React exclusively for the sprint. It provides:
- Scroll-driven animations via `useScroll` + `useTransform`
- Staggered entrance animations
- Built-in `useReducedMotion()` hook
- No additional bundle size overhead

**Consequence:** anime.js is deferred. The scroll story uses DOM transforms driven by scroll progress, not anime.js timelines.

### ADR-002: Static Content in Constants File

**Context:** No backend or CMS is available. All content is predefined.

**Decision:** Store all content in `src/lib/constants.ts` as typed TypeScript exports. This provides:
- Type safety for all content
- Zero runtime overhead (tree-shaken)
- Single source of truth for copy changes

**Consequence:** Content updates require a code change. Acceptable for sprint scope.

### ADR-003: Lazy-Loaded 3D Canvas

**Context:** Three.js bundles are large (~150KB gzipped). They should not block initial paint.

**Decision:** Wrap all R3F components in `dynamic(() => import('…'), { ssr: false })`. This:
- Defers 3D bundle loading until after main content is interactive
- Prevents SSR errors (canvas has no server equivalent)
- Enables faster First Contentful Paint

**Consequence:** 3D background appears after text content. Acceptable for UX; text-first is readable.

### ADR-004: DOM + Motion for Scroll Story

**Context:** The scroll story is the signature experience. Using R3F for this section would add complexity and performance risk.

**Decision:** Implement the scroll story entirely with DOM elements + Motion for React transforms. This:
- Avoids 3D performance pitfalls on mobile
- Enables precise scroll-driven transitions
- Keeps the bundle lean
- Is easier to debug and iterate

**Consequence:** The scroll story is 2D by design. Its impact comes from lighting, color, and motion, not 3D geometry.

---

## 3. Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout, fonts, metadata
│   ├── page.tsx                # Main page: assembles all sections
│   └── globals.css             # Tailwind directives, base styles, noise overlay
│
├── components/
│   ├── layout/
│   │   ├── navbar.tsx          # Sticky nav, transparent → blurred, mobile sheet
│   │   └── section-shell.tsx   # Consistent max-width, padding, section id wrapper
│   │
│   ├── animation/
│   │   ├── animated-heading.tsx     # Word-staggered heading reveal (Motion)
│   │   ├── reveal-group.tsx         # Reveals children on viewport entry
│   │   └── stagger-container.tsx    # Auto-staggers children entrances
│   │
│   ├── ui-parts/
│   │   ├── glow-button.tsx      # CTA with glow pulse + hover amplification
│   │   ├── glass-panel.tsx      # Backdrop-blur card with subtle border
│   │   └── metric-chip.tsx      # Animated data metric display
│   │
│   └── sections/
│       ├── hero/
│       │   ├── hero.tsx              # Section orchestrator
│       │   ├── scene-wrapper.tsx     # R3F Canvas wrapper (lazy-loaded)
│       │   ├── solar-core.tsx        # @shadergradient/react core (lazy-loaded)
│       │   └── starfield.tsx         # drei <Stars> with slow rotation (lazy-loaded)
│       │
│       ├── mission/
│       │   └── mission.tsx           # Mission overview with metric chips
│       │
│       ├── flares/
│       │   └── flares.tsx            # Flare class cards with stagger reveal
│       │
│       ├── scroll-story/
│       │   ├── scroll-story.tsx      # 500vh section with sticky inner frame
│       │   ├── scene-renderer.tsx    # SVG/DOM visual state based on progress
│       │   └── progressive-labels.tsx # Act labels that change with progress
│       │
│       └── footer/
│           └── footer.tsx            # Closing statement, CTA, credits
│
├── hooks/
│   └── use-scroll-progress.ts   # Wraps Motion's useScroll for convenience
│
└── lib/
    ├── constants.ts             # All content data, metrics, flare classes, acts
    └── utils.ts                 # Tailwind cn() helper, shared utilities
```

---

## 4. Component Tree

```
<RootLayout>                         ← layout.tsx
  └─ <Navbar />                      ← transparent|blurred|mobile states
  └─ <main>
       ├─ <HeroSection>              ← hero.tsx
       │   ├─ <SceneWrapper>         ← lazy: R3F Canvas
       │   │   ├─ <Starfield />      ← lazy: drei Stars
       │   │   └─ <SolarCore />      ← lazy: shadergradient
       │   ├─ <AnimatedHeading />    ← word-staggered "SOLAR INTELLIGENCE IN MOTION"
       │   ├─ <p>Subheadline</p>
       │   └─ <GlowButton />         ← "Explore the Mission"
       │
       ├─ <MissionSection>           ← mission.tsx
       │   ├─ <AnimatedHeading />    ← "Watching the Sun, Uninterrupted"
       │   ├─ <p>Mission body</p>
       │   └─ <MetricChip /> ×3      ← L1 Point · 1.5M KM · 24/7
       │
       ├─ <FlaresSection>            ← flares.tsx
       │   ├─ <AnimatedHeading />    ← "What is a Solar Flare?"
       │   ├─ <p>Explainer body</p>
       │   └─ <GlassPanel /> ×5      ← B · C · M · X · XX (staggered)
       │
       ├─ <ScrollStorySection>       ← scroll-story.tsx (500vh)
       │   └─ <div.sticky>
       │       ├─ <SceneRenderer />  ← SVG visual state machine
       │       └─ <ProgressiveLabels /> ← Act titles + descriptions
       │
       └─ <FooterSection>            ← footer.tsx
           ├─ <AnimatedHeading />    ← closing statement
           ├─ <p>Supporting line</p>
           ├─ <GlowButton />
           └─ <p>Credits</p>
```

---

## 5. Data Model

All content is colocated in `src/lib/constants.ts`:

```typescript
// ── Mission ──────────────────────────────────────────
export const MISSION_DATA = {
  title: 'Aditya-L1',
  tagline: "India's first dedicated solar mission",
  description: `Aditya-L1 positions seven scientific instruments at
    the Sun–Earth L1 point — 1.5 million kilometers from Earth —
    to observe dynamic solar activity with uninterrupted precision.`,
  metrics: [
    { label: 'Position', value: 'L1 Point' },
    { label: 'Distance', value: '1.5M KM' },
    { label: 'Coverage', value: '24/7' },
  ],
} as const;

// ── Flare Classes ────────────────────────────────────
export const FLARE_CLASSES = [
  { label: 'B', name: 'Minor',   description: 'Small, frequent',   color: '#55D6FF' },
  { label: 'C', name: 'Moderate', description: 'Common, noticeable', color: '#4EA8DE' },
  { label: 'M', name: 'Strong',  description: 'Can cause radio blackouts', color: '#FFB347' },
  { label: 'X', name: 'Major',   description: 'Significant events',     color: '#FF7A00' },
  { label: 'XX', name: 'Extreme', description: 'Rare, planet-scale',     color: '#FF4D36' },
] as const;

// ── Scroll Story Acts ────────────────────────────────
export const SCROLL_STORY_ACTS = [
  {
    id: 'quiet-sun',
    title: 'Quiet Sun',
    description: 'The Sun, in its quiet state, radiates steady energy across the spectrum.',
    visualState: { glowIntensity: 0.2, scale: 0.8, flash: 0 },
  },
  {
    id: 'buildup',
    title: 'Activity Buildup',
    description: 'Magnetic energy accumulates in the solar atmosphere, twisting and stressing field lines.',
    visualState: { glowIntensity: 0.5, scale: 0.9, flash: 0 },
  },
  {
    id: 'flare-burst',
    title: 'Flare Burst',
    description: 'A flare erupts — an intense burst of radiation traveling at the speed of light.',
    visualState: { glowIntensity: 1.0, scale: 1.2, flash: 1 },
  },
  {
    id: 'observation',
    title: 'Observation',
    description: 'Captured by Aditya-L1 in real-time, adding to our understanding of space weather.',
    visualState: { glowIntensity: 0.6, scale: 1.0, flash: 0.3 },
  },
] as const;

// ── Navigation ───────────────────────────────────────
export const NAV_ITEMS = [
  { label: 'Mission', href: '#mission' },
  { label: 'Science', href: '#flares' },
  { label: 'Story',   href: '#story' },
] as const;
```

---

## 6. Performance Rules

### Critical Performance Budget

| Metric | Target |
|---|---|
| First Contentful Paint (FCP) | < 1.5s |
| Largest Contentful Paint (LCP) | < 2.5s |
| Total Blocking Time (TBT) | < 100ms |
| Cumulative Layout Shift (CLS) | < 0.05 |

### Rules

1. **Lazy-load all 3D** — All R3F components use `dynamic(() => import('…'), { ssr: false })`. The hero text overlay must be visible before 3D canvas loads.

2. **Animate only composited properties** — Only `transform` (translate, scale, rotate) and `opacity`. Never `width`, `height`, `top`, `left`, `margin`, or `padding` — these trigger layout recalculations.

3. **DOM + Motion for scroll story** — No R3F in the scroll story. SVG and DOM elements only, driven by `useScroll` + `useTransform`.

4. **Keep starfield lightweight** — Use drei `<Stars />` with default count (500). No custom particle systems. No shader materials.

5. **Zero API dependencies** — No data fetching, no network requests, no external content loading. Everything is static in `constants.ts`.

6. **Responsive images placeholder** — No heavy images. Text and gradient visuals only. Avoids LCP regressions.

7. **Font loading** — Use `next/font` with `display: swap` and preload only the variable-weight versions.

---

## 7. Quality Gates

### Pre-Deployment Checklist

- [ ] **Responsive:** Tested at 375px, 768px, 1024px, 1440px — no horizontal overflow at any breakpoint
- [ ] **Console:** Zero console errors or warnings in development and production builds
- [ ] **Reduced Motion:** `prefers-reduced-motion: reduce` results in static, readable content with color-only transitions
- [ ] **Build:** `npm run build` passes with zero errors and zero type errors
- [ ] **Accessibility:** All interactive elements are keyboard-navigable; headings follow semantic hierarchy (h1 → h2 → h3)
- [ ] **Performance:** Lighthouse Performance score ≥ 85 on desktop and mobile
- [ ] **Deploy:** Vercel deployment succeeds and live URL is functional

---

*This architecture document should be reviewed before any code is written. Deviations from the architecture must be documented in the code or as comments on the relevant PR.*
