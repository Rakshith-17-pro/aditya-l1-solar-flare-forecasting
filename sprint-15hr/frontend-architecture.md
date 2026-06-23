# SPRINT ARCHITECTURE — Aditya-L1 Solar Flares (15-Hour Edition)

> **Technical foundation for the compressed sprint build.**
> Full architecture in `plan-18day/frontend-architecture.md`.

---

## 1. TECHNOLOGY STACK

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | **Next.js** (App Router) | Production SSR, image optimization |
| Language | **TypeScript** (strict) | Type safety |
| Styling | **Tailwind CSS** | Fast design system implementation |
| Animation | **Motion for React** | One engine for everything — reveals, scroll, hover |
| 3D (Hero) | **React Three Fiber + Drei** | Stars background + shadergradient solar core |
| Base UI | **shadcn/ui** (button, card, sheet, tooltip only) | Accessible primitives |
| Shaders | **@shadergradient/react** | 15-min setup for premium solar visual |

### What we're NOT installing (yet)

| Library | Reason |
|---------|--------|
| animejs | Time to learn/debug a second engine. Motion covers all our needs today. |
| @tsparticles | Drei Stars already gives us starfield |
| zustand / state libs | Not needed for 5 sections |

---

## 2. DEPENDENCY INSTALLATION

```bash
# Step 1 — Scaffold
npx create-next-app@latest aditya-l1-frontend --typescript --tailwind --app --src-dir --import-alias "@/*"

# Step 2 — Animation & UI
cd aditya-l1-frontend
npm install motion
npx shadcn@latest init
npx shadcn@latest add button card sheet tooltip

# Step 3 — 3D & Shaders
npm install three @react-three/fiber @react-three/drei @shadergradient/react
npm install -D @types/three
```

---

## 3. PROJECT DIRECTORY STRUCTURE

```
src/
├── app/
│   ├── layout.tsx            ← Fonts, metadata, noise overlay, navbar
│   ├── page.tsx              ← Compose 5 sections
│   └── globals.css           ← Tailwind layers, base styles
│
├── components/
│   ├── layout/
│   │   ├── navbar.tsx
│   │   └── section-shell.tsx
│   ├── sections/
│   │   ├── hero/
│   │   │   ├── hero.tsx
│   │   │   ├── solar-core.tsx         (shadergradient wrapper)
│   │   │   └── starfield.tsx          (drei Stars wrapper)
│   │   ├── scroll-story/
│   │   │   ├── scroll-story.tsx       (sticky container)
│   │   │   ├── scene-renderer.tsx     (4 acts mapping)
│   │   │   └── progressive-labels.tsx
│   │   ├── mission/
│   │   │   └── mission.tsx
│   │   ├── flares/
│   │   │   └── flares.tsx
│   │   └── footer/
│   │       └── footer.tsx
│   ├── animation/
│   │   ├── reveal-group.tsx
│   │   ├── animated-heading.tsx
│   │   └── stagger-container.tsx
│   └── ui-parts/
│       ├── glow-button.tsx
│       ├── glass-panel.tsx
│       └── metric-chip.tsx
│
├── hooks/
│   └── use-scroll-progress.ts
│
└── lib/
    ├── utils.ts
    └── constants.ts
```

**~20 files total.** One person can build this in 15 hours.

---

## 4. COMPONENT TREE (Today's Scope)

```
<AppLayout>
  <Navbar />                          ← transparent → blur on scroll
  <main>
    <HeroSection>
      <NoiseOverlay />
      <Starfield />                   ← drei <Stars />
      <SolarCore />                   ← shadergradient <Gradient type="sphere" />
      <AnimatedHeading />
      <GlowButton />
    </HeroSection>

    <MissionOverview>
      <AnimatedHeading />
      <p>                              ← mission text, scroll-reveal
      <MetricChip />                   ← animated counter
    </MissionOverview>

    <SolarFlaresExplainer>
      <AnimatedHeading />
      <StaggerContainer>
        <GlassPanel> → FlareCard ×5   ← B, C, M, X, XX classes
      </StaggerContainer>
    </SolarFlaresExplainer>

    <ScrollStorySection>
      <ScrollProgress />              ← useScroll + useTransform
      <StickyContainer>
        <SceneRenderer />             ← 4 acts driven by progress
        <ProgressiveLabels />
      </StickyContainer>
    </ScrollStorySection>

    <FooterCTA>
      <AnimatedHeading />
      <GlowButton />
      <FooterLinks />
    </FooterCTA>
  </main>
</AppLayout>
```

---

## 5. DATA FLOW (Simplified)

```typescript
// lib/constants.ts — all content lives here for speed
export const MISSION_DATA = {
  title: "Aditya-L1",
  description: "...",
  metrics: [
    { label: "Lagrange Point", value: "L1" },
    { label: "Distance", value: "1.5M KM" },
    { label: "Observation", value: "24/7" },
  ],
};

export const FLARE_CLASSES = [
  { label: "B", energy: "Minor", color: "#55D6FF" },
  { label: "C", energy: "Moderate", color: "#4EA8DE" },
  { label: "M", energy: "Strong", color: "#FFB347" },
  { label: "X", energy: "Major", color: "#FF7A00" },
  { label: "XX", energy: "Extreme", color: "#FF4D36" },
];

// Scroll story: progress (0→1) drives visual transforms
// See flow.md in sprint-15hr for the 4 act mappings
```

---

## 6. PERFORMANCE BUDGET (Today)

| Metric | Target | How |
|--------|--------|-----|
| FCP | < 1.5s | Static export, minimal JS upfront |
| LCP | < 2.5s | Lazy-load 3D canvas, preload fonts |
| TBT | < 100ms | No heavy computation on main thread |
| CLS | < 0.05 | Fixed dimensions for all canvases |

### Key performance decisions

1. **Dynamic import** for hero 3D canvas — not loaded until hero is in viewport
2. **No three.js on scroll story** — use DOM + Motion transforms instead
3. **Static content** — no data fetching, no API calls
4. **WebP or SVG** for all imagery

---

## 7. QUALITY GATES (Today)

Before considering a section "done":

- [ ] Renders at 375px, 768px, 1024px, 1440px
- [ ] No horizontal scroll
- [ ] Keyboard navigable
- [ ] prefers-reduced-motion respected
- [ ] All hover states have visual feedback
- [ ] No console errors
- [ ] TypeScript compiles ✅

---

*Full architecture reference: `plan-18day/frontend-architecture.md`. Today we build the skeleton with maximum visual impact.*
