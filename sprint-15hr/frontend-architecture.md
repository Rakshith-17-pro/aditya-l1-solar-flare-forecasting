# FRONTEND ARCHITECTURE — Aditya-L1 Solar Flares

> Technical blueprint for the 15-hour build.

---

## 1. TECHNOLOGY STACK

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | **Next.js** (App Router) | Production-ready frontend foundation |
| Language | **TypeScript** | Type safety and maintainability |
| Styling | **Tailwind CSS** | Fast design system implementation |
| UI Primitives | **shadcn/ui** | Buttons, cards, sheet, tooltip |
| Animation | **Motion for React** | Reveals, hover states, scroll transforms |
| 3D / Atmosphere | **React Three Fiber + Drei** | Hero background and stars |
| Visual Shader | **@shadergradient/react** | Solar core visual |

### Dependency set

```bash
npx create-next-app@latest aditya-l1-frontend --typescript --tailwind --app --src-dir --import-alias "@/*"
cd aditya-l1-frontend
npm install motion three @react-three/fiber @react-three/drei @shadergradient/react
npx shadcn@latest init -d
npx shadcn@latest add button card sheet tooltip
npm install -D @types/three
```

---

## 2. PROJECT STRUCTURE

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── layout/
│   │   ├── navbar.tsx
│   │   └── section-shell.tsx
│   ├── animation/
│   │   ├── animated-heading.tsx
│   │   ├── reveal-group.tsx
│   │   └── stagger-container.tsx
│   ├── ui-parts/
│   │   ├── glow-button.tsx
│   │   ├── glass-panel.tsx
│   │   └── metric-chip.tsx
│   └── sections/
│       ├── hero/
│       │   ├── hero.tsx
│       │   ├── solar-core.tsx
│       │   ├── starfield.tsx
│       │   └── scene-wrapper.tsx
│       ├── mission/
│       │   └── mission.tsx
│       ├── flares/
│       │   └── flares.tsx
│       ├── scroll-story/
│       │   ├── scroll-story.tsx
│       │   ├── scene-renderer.tsx
│       │   └── progressive-labels.tsx
│       └── footer/
│           └── footer.tsx
├── hooks/
│   └── use-scroll-progress.ts
└── lib/
    ├── constants.ts
    └── utils.ts
```

---

## 3. COMPONENT TREE

```text
<AppLayout>
  <Navbar />
  <main>
    <HeroSection>
      <Starfield />
      <SolarCore />
      <AnimatedHeading />
      <GlowButton />
    </HeroSection>

    <MissionSection>
      <AnimatedHeading />
      <MetricChip />
    </MissionSection>

    <FlaresSection>
      <AnimatedHeading />
      <GlassPanel /> × 5
    </FlaresSection>

    <ScrollStorySection>
      <SceneRenderer />
      <ProgressiveLabels />
    </ScrollStorySection>

    <FooterSection>
      <AnimatedHeading />
      <GlowButton />
    </FooterSection>
  </main>
</AppLayout>
```

---

## 4. DATA MODEL

All content can live in `lib/constants.ts` for speed.

```ts
export const MISSION_DATA = {
  title: 'Aditya-L1',
  tagline: "India's first dedicated solar mission",
  metrics: [
    { label: 'Position', value: 'L1 Point' },
    { label: 'Distance', value: '1.5M KM' },
    { label: 'Coverage', value: '24/7' },
  ],
};

export const FLARE_CLASSES = [
  { label: 'B', name: 'Minor', color: '#55D6FF' },
  { label: 'C', name: 'Moderate', color: '#4EA8DE' },
  { label: 'M', name: 'Strong', color: '#FFB347' },
  { label: 'X', name: 'Major', color: '#FF7A00' },
  { label: 'XX', name: 'Extreme', color: '#FF4D36' },
];
```

---

## 5. PERFORMANCE RULES

1. Lazy-load hero 3D pieces with `dynamic(..., { ssr: false })`
2. Use DOM + Motion for scroll story, not full 3D
3. Animate only `transform` and `opacity`
4. Keep stars lightweight
5. No API dependency for the first version

---

## 6. QUALITY GATES

Before calling the build done:

- [ ] Works at 375px, 768px, 1024px, 1440px
- [ ] No horizontal overflow
- [ ] No console errors
- [ ] Reduced motion behaves gracefully
- [ ] Build passes cleanly
- [ ] Deploys successfully

---

*This architecture is optimized for fast execution and polished output.*
