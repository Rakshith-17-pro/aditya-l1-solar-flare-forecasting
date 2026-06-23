# PROCEDURE — Aditya-L1 Solar Flares (15 Hour Build)

> Step-by-step implementation guide for the build.

---

## PROCEDURE 1 — PROJECT SETUP

### Step 1.1: Scaffold app

```bash
npx create-next-app@latest aditya-l1-frontend --typescript --tailwind --app --src-dir --import-alias "@/*"
cd aditya-l1-frontend
```

### Step 1.2: Install dependencies

```bash
npm install motion three @react-three/fiber @react-three/drei @shadergradient/react
npx shadcn@latest init -d
npx shadcn@latest add button card sheet tooltip
npm install -D @types/three
```

### Step 1.3: Verify

```bash
npm run dev
```

---

## PROCEDURE 2 — DESIGN SYSTEM

### Step 2.1: Configure Tailwind tokens

Add colors and fonts:

```ts
colors: {
  'space-black': '#05070B',
  'space-navy': '#0A1020',
  'space-charcoal': '#111827',
  'plasma-orange': '#FF7A00',
  'flare-gold': '#FFB347',
  'eruption-red': '#FF4D36',
  'corona-amber': '#FFC857',
  'instrument-cyan': '#55D6FF',
  'telemetry-blue': '#4EA8DE',
  'signal-violet': '#8B5CF6',
}
```

### Step 2.2: Fonts

Use:
- Space Grotesk
- Inter
- JetBrains Mono

### Step 2.3: Global styles

`globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-space-black text-white antialiased;
  }
}
```

### Step 2.4: Constants file

Create `src/lib/constants.ts` with:
- mission data
- flare classes
- scroll story acts
- shared tokens

---

## PROCEDURE 3 — LAYOUT SHELL

### Build these files first

- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/components/layout/navbar.tsx`
- `src/components/layout/section-shell.tsx`

### Requirements

#### Navbar
- transparent at top
- blurred after scroll
- mobile menu via sheet/overlay

#### Section shell
- consistent max-width
- reusable spacing
- section id support

---

## PROCEDURE 4 — HERO

### Files
- `hero.tsx`
- `solar-core.tsx`
- `starfield.tsx`
- `scene-wrapper.tsx`
- `animated-heading.tsx`
- `glow-button.tsx`

### Build order

1. Create `scene-wrapper.tsx` with `<Canvas>`
2. Add `starfield.tsx` using drei `<Stars />`
3. Add `solar-core.tsx` using `@shadergradient/react`
4. Build `animated-heading.tsx`
5. Build `glow-button.tsx`
6. Assemble hero section

### Hero structure

```tsx
<section id="hero" className="relative h-screen overflow-hidden">
  <div className="absolute inset-0">
    <SceneWrapper>
      <Starfield />
      <SolarCore />
    </SceneWrapper>
  </div>

  <div className="relative z-10 flex h-full items-center justify-center text-center">
    <div>
      <AnimatedHeading text="SOLAR INTELLIGENCE IN MOTION" />
      <p>Subheadline</p>
      <GlowButton>Explore the Mission</GlowButton>
    </div>
  </div>
</section>
```

---

## PROCEDURE 5 — MISSION SECTION

### Files
- `mission.tsx`
- `metric-chip.tsx`

### Requirements
- strong heading
- 2–3 clean paragraphs
- 3 animated metric chips

Metrics:
- L1 Point
- 1.5M KM
- 24/7 Observation

---

## PROCEDURE 6 — SOLAR FLARES SECTION

### Files
- `flares.tsx`
- `glass-panel.tsx`
- optional `stagger-container.tsx`

### Requirements
- heading + explanation
- 5 flare class cards
- class color identity
- subtle hover glow

Cards:
- B
- C
- M
- X
- XX

---

## PROCEDURE 7 — SCROLL STORY

### Files
- `use-scroll-progress.ts`
- `scroll-story.tsx`
- `scene-renderer.tsx`
- `progressive-labels.tsx`

### Setup

```tsx
<section className="relative h-[500vh]" id="story">
  <div className="sticky top-0 h-screen overflow-hidden">
    <SceneRenderer progress={scrollYProgress} />
    <ProgressiveLabels progress={scrollYProgress} />
  </div>
</section>
```

### 4 acts

1. Quiet Sun
2. Activity Buildup
3. Flare Burst
4. Observation

### Visual mappings

Map scroll progress to:
- background opacity
- sun scale
- flash opacity
- ring expansion
- spacecraft opacity
- data line draw

---

## PROCEDURE 8 — FOOTER CTA

### File
- `footer.tsx`

### Requirements
- strong closing statement
- supporting line
- CTA button
- project / ISRO acknowledgement

---

## PROCEDURE 9 — PAGE ASSEMBLY

In `page.tsx`:

```tsx
<main>
  <HeroSection />
  <MissionSection />
  <FlaresSection />
  <ScrollStorySection />
  <FooterSection />
</main>
```

---

## PROCEDURE 10 — POLISH PASS

### Must-check items

- [ ] no overflow on mobile
- [ ] navbar works on all sizes
- [ ] heading spacing feels premium
- [ ] cards have clear hover states
- [ ] scroll story acts are readable
- [ ] reduced motion works
- [ ] no console errors

---

## PROCEDURE 11 — DEPLOY

### Build

```bash
npm run build
```

### Deploy

```bash
npx vercel --prod
```

### Final check

- [ ] live URL works
- [ ] hero loads correctly
- [ ] scroll story works
- [ ] mobile is acceptable

---

## PRIORITY ORDER

If time gets tight, build in this order:

1. Hero
2. Scroll Story
3. Mission
4. Flares
5. Footer
6. Extra polish

---

*This is the implementation procedure for the build.*
