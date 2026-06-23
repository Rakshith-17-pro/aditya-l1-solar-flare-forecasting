# IMPLEMENTATION PROCEDURE — Aditya-L1 Solar Flares

> **Document Type:** Build Guide · **Status:** Active · **Total Budget:** 15 Hours
> **Last Updated:** 2026-06-24

---

## Table of Contents

1. [How to Use This Guide](#1-how-to-use-this-guide)
2. [Procedure 1: Project Scaffolding](#2-procedure-1-project-scaffolding)
3. [Procedure 2: Design System Configuration](#3-procedure-2-design-system-configuration)
4. [Procedure 3: Layout Shell](#4-procedure-3-layout-shell)
5. [Procedure 4: Hero Section](#5-procedure-4-hero-section)
6. [Procedure 5: Mission Section](#6-procedure-5-mission-section)
7. [Procedure 6: Solar Flares Section](#7-procedure-6-solar-flares-section)
8. [Procedure 7: Scroll Story](#8-procedure-7-scroll-story)
9. [Procedure 8: Footer CTA](#9-procedure-8-footer-cta)
10. [Procedure 9: Page Assembly](#10-procedure-9-page-assembly)
11. [Procedure 10: Polish Pass](#11-procedure-10-polish-pass)
12. [Procedure 11: Deployment](#12-procedure-11-deployment)
13. [Time Budget Reference](#13-time-budget-reference)

---

## 1. How to Use This Guide

### Conventions

```text
📋 Checklist items — mark these as complete
💡 Design Decision — rationale for approach taken
⚠️ Common Pitfall — mistakes to watch for
🔍 Verification Step — confirm correctness before proceeding
```

### Build Order

Procedures should be followed **sequentially**. Each procedure builds on the previous one. Do not skip ahead.

### Time Tracking

Each procedure includes an estimated duration. Log actual time spent to calibrate future estimates.

---

## 2. Procedure 1: Project Scaffolding

**Estimated Duration:** 20 minutes

### Step 1.1: Create Next.js Project

```bash
npx create-next-app@latest aditya-l1-frontend \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*"
```

**Project name:** `aditya-l1-frontend`

### Step 1.2: Install Dependencies

```bash
cd aditya-l1-frontend

npm install motion three @react-three/fiber @react-three/drei @shadergradient/react
npx shadcn@latest init -d
npx shadcn@latest add button card sheet tooltip
npm install -D @types/three
```

### Step 1.3: Verify Setup

```bash
npm run dev
```

🔍 **Verification:** Open `http://localhost:3000`. You should see the default Next.js starter page. No errors in terminal or browser console.

### Step 1.4: Clean Default Files

Remove the default Next.js boilerplate:
- Delete `src/app/page.tsx` content (replace with minimal shell)
- Delete `src/app/globals.css` content (replace with Tailwind directives)

---

## 3. Procedure 2: Design System Configuration

**Estimated Duration:** 40 minutes

### Step 2.1: Configure Tailwind Theme

Edit `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
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
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 122, 0, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 122, 0, 0.4)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

### Step 2.2: Set Up Fonts

In `src/app/layout.tsx`, use `next/font`:

```typescript
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});
```

### Step 2.3: Global Styles

`src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-space-black text-white antialiased;
    font-family: var(--font-body), sans-serif;
  }

  h1, h2, h3 {
    font-family: var(--font-display), sans-serif;
  }

  code, .mono {
    font-family: var(--font-mono), monospace;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

### Step 2.4: Create Constants File

Create `src/lib/constants.ts` with the full data model as defined in the [architecture document](./frontend-architecture.md#5-data-model).

🔍 **Verification:** `npm run build` passes with zero type errors.

---

## 4. Procedure 3: Layout Shell

**Estimated Duration:** 45 minutes

### Step 3.1: Create Utility File

`src/lib/utils.ts`:

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

> Note: If `clsx` and `tailwind-merge` are not installed, add them: `npm install clsx tailwind-merge`

### Step 3.2: Section Shell Component

`src/components/layout/section-shell.tsx`:

```typescript
interface SectionShellProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function SectionShell({ id, children, className }: SectionShellProps) {
  return (
    <section id={id} className={`relative px-4 py-24 md:py-32 ${className || ''}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}
```

### Step 3.3: Navbar Component

`src/components/layout/navbar.tsx`:

The navbar should:
- Start **transparent** at top of hero
- Transition to **`bg-space-black/80 backdrop-blur-md`** after scrolling past 100px
- Show 3 nav items: Mission, Science, Story
- On mobile (<768px): hamburger icon → Sheet overlay from shadcn/ui
- Use Motion for React for smooth background transition

```typescript
'use client';
import { motion, useScroll, useTransform } from 'motion/react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Mission', href: '#mission' },
  { label: 'Science', href: '#flares' },
  { label: 'Story', href: '#story' },
];

export function Navbar() {
  const { scrollY } = useScroll();
  const background = useTransform(
    scrollY,
    [0, 100],
    ['rgba(5, 7, 11, 0)', 'rgba(5, 7, 11, 0.8)']
  );

  return (
    <motion.nav
      style={{ background }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-transparent backdrop-blur-md transition-colors"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <span className="font-display text-lg font-semibold tracking-tight">
          ADITYA-L1
        </span>

        {/* Desktop */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-white/70 transition-colors hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Mobile */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-white">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-space-navy border-white/10">
            <nav className="mt-12 flex flex-col gap-6">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-lg text-white/70 transition-colors hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </motion.nav>
  );
}
```

### Step 3.4: Root Layout

`src/app/layout.tsx`:

```typescript
import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';

export const metadata: Metadata = {
  title: 'Aditya-L1 | Solar Flare Intelligence',
  description:
    'A cinematic, motion-first scientific storytelling frontend for India\'s first dedicated solar mission.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
```

💡 **Design Decision:** The Navbar is included in the layout so it persists across all sections. Smooth scrolling on `<html>` enables native anchor navigation.

🔍 **Verification:** Navbar appears at top, is transparent, nav links are visible, mobile hamburger opens the sheet.

---

## 5. Procedure 4: Hero Section

**Estimated Duration:** 2–3 hours

### Step 4.1: Scene Wrapper (Lazy-Loaded 3D Canvas)

`src/components/sections/hero/scene-wrapper.tsx`:

```typescript
'use client';
import { Canvas } from '@react-three/fiber';

export function SceneWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 60 }}
      dpr={[1, 2]}
      gl={{ antialias: true }}
      className="absolute inset-0"
    >
      {children}
    </Canvas>
  );
}
```

### Step 4.2: Starfield

`src/components/sections/hero/starfield.tsx`:

```typescript
'use client';
import { Stars } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

export function Starfield() {
  const ref = useRef<any>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.02;
    }
  });

  return <Stars ref={ref} radius={100} depth={50} count={500} factor={4} saturation={0} fade speed={1} />;
}
```

### Step 4.3: Solar Core

`src/components/sections/hero/solar-core.tsx`:

```typescript
'use client';
import ShaderGradient from '@shadergradient/react';

export function SolarCore() {
  return (
    <ShaderGradient
      control="props"
      type="sphere"
      position={[0, 0, 0]}
      color1="#FF7A00"
      color2="#FF4500"
      color3="#FFB347"
      brightness={1.5}
      uSpeed={0.3}
    />
  );
}
```

### Step 4.4: Animated Heading Component

`src/components/animation/animated-heading.tsx`:

```typescript
'use client';
import { motion, useReducedMotion } from 'motion/react';

interface AnimatedHeadingProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2';
}

export function AnimatedHeading({ text, className = '', as: Tag = 'h1' }: AnimatedHeadingProps) {
  const prefersReducedMotion = useReducedMotion();
  const words = text.split(' ');

  if (prefersReducedMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={`inline-flex flex-wrap gap-[0.2em] ${className}`}>
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
    </Tag>
  );
}
```

### Step 4.5: Glow Button

`src/components/ui-parts/glow-button.tsx`:

```typescript
'use client';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';

interface GlowButtonProps {
  children: React.ReactNode;
  href?: string;
}

export function GlowButton({ children, href }: GlowButtonProps) {
  const Component = href ? 'a' : Button;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 2.2, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="inline-block"
    >
      <Component
        href={href}
        className="inline-flex items-center gap-2 rounded-full bg-plasma-orange px-8 py-3 font-display text-sm font-semibold text-white transition-shadow duration-200 hover:shadow-[0_0_30px_rgba(255,122,0,0.4)]"
      >
        {children}
      </Component>
    </motion.div>
  );
}
```

### Step 4.6: Hero Section Assembly

`src/components/sections/hero/hero.tsx`:

```typescript
import dynamic from 'next/dynamic';
import { AnimatedHeading } from '@/components/animation/animated-heading';
import { GlowButton } from '@/components/ui-parts/glow-button';

const SceneWrapper = dynamic(
  () => import('./scene-wrapper').then((m) => m.SceneWrapper),
  { ssr: false }
);

const Starfield = dynamic(
  () => import('./starfield').then((m) => m.Starfield),
  { ssr: false }
);

const SolarCore = dynamic(
  () => import('./solar-core').then((m) => m.SolarCore),
  { ssr: false }
);

export function HeroSection() {
  return (
    <section id="hero" className="relative h-screen overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0">
        <SceneWrapper>
          <Starfield />
          <SolarCore />
        </SceneWrapper>
      </div>

      {/* Gradient Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-space-black/30 to-space-black" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center px-4 text-center">
        <div className="max-w-4xl">
          <AnimatedHeading
            text="SOLAR INTELLIGENCE IN MOTION"
            className="text-balance font-display text-[clamp(3.5rem,8vw,8rem)] font-bold leading-[1.1] tracking-tight text-white"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="mx-auto mt-6 max-w-2xl text-lg text-white/60 md:text-xl"
          >
            India&apos;s first dedicated solar observatory — watching the Sun from 1.5 million kilometers away.
          </motion.p>
          <div className="mt-10">
            <GlowButton href="#mission">Explore the Mission</GlowButton>
          </div>
        </div>
      </div>
    </section>
  );
}
```

💡 **Design Decision:** The 3D canvas is lazy-loaded so hero text appears immediately. The gradient overlay ensures text remains readable against the bright solar core.

⚠️ **Common Pitfall:** Forgetting `{ ssr: false }` on dynamic imports will cause hydration errors because R3F uses browser APIs. Always include it.

🔍 **Verification:** Hero heading animates word by word. Solar core and starfield appear shortly after. CTA button scales in with glow. Scroll down triggers navbar background transition.

---

## 6. Procedure 5: Mission Section

**Estimated Duration:** 1 hour

### Step 5.1: Metric Chip Component

`src/components/ui-parts/metric-chip.tsx`:

```typescript
'use client';
import { motion } from 'motion/react';

interface MetricChipProps {
  label: string;
  value: string;
  index: number;
}

export function MetricChip({ label, value, index }: MetricChipProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: 0.4 + index * 0.08,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="rounded-xl border border-white/10 bg-space-navy/60 p-6 text-center backdrop-blur-sm"
    >
      <p className="font-mono text-2xl font-bold text-plasma-orange md:text-3xl">{value}</p>
      <p className="mt-2 text-sm text-white/50">{label}</p>
    </motion.div>
  );
}
```

### Step 5.2: Mission Section

`src/components/sections/mission/mission.tsx`:

```typescript
'use client';
import { AnimatedHeading } from '@/components/animation/animated-heading';
import { MetricChip } from '@/components/ui-parts/metric-chip';
import { MISSION_DATA } from '@/lib/constants';
import { motion } from 'motion/react';

export function MissionSection() {
  return (
    <section id="mission" className="relative px-4 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <AnimatedHeading
            as="h2"
            text="Watching the Sun, Uninterrupted"
            className="text-balance font-display text-[clamp(2rem,4vw,4.5rem)] font-bold leading-[1.2] tracking-tight"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-8 space-y-4 text-base leading-relaxed text-white/60 md:text-lg"
          >
            <p>{MISSION_DATA.description}</p>
            <p>
              From this vantage, the mission captures the full chain of solar events: from magnetic
              buildup on the surface to the eruption of flares and coronal mass ejections.
            </p>
          </motion.div>
        </div>

        {/* Metrics */}
        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {MISSION_DATA.metrics.map((metric, i) => (
            <MetricChip key={metric.label} label={metric.label} value={metric.value} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

🔍 **Verification:** Heading reveals on scroll-in. Two paragraphs fade in sequentially. Three metric chips stagger in with a scale effect.

---

## 7. Procedure 6: Solar Flares Section

**Estimated Duration:** 1.5 hours

### Step 7.1: Glass Panel Component

`src/components/ui-parts/glass-panel.tsx`:

```typescript
'use client';
import { motion } from 'motion/react';

interface GlassPanelProps {
  children: React.ReactNode;
  accentColor: string;
  className?: string;
}

export function GlassPanel({ children, accentColor, className = '' }: GlassPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{
        borderColor: accentColor,
        backgroundColor: `${accentColor}0a`,
        boxShadow: `0 0 20px ${accentColor}20`,
      }}
      className={`rounded-xl border border-white/10 bg-space-navy/60 p-6 backdrop-blur-sm transition-colors duration-200 ${className}`}
      style={{ borderColor: 'rgba(255,255,255,0.1)' }}
    >
      {children}
    </motion.div>
  );
}
```

### Step 7.2: Flares Section

`src/components/sections/flares/flares.tsx`:

```typescript
'use client';
import { AnimatedHeading } from '@/components/animation/animated-heading';
import { GlassPanel } from '@/components/ui-parts/glass-panel';
import { FLARE_CLASSES } from '@/lib/constants';
import { motion } from 'motion/react';

export function FlaresSection() {
  return (
    <section id="flares" className="relative px-4 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <AnimatedHeading
            as="h2"
            text="What is a Solar Flare?"
            className="text-balance font-display text-[clamp(2rem,4vw,4.5rem)] font-bold leading-[1.2] tracking-tight"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-8 text-base leading-relaxed text-white/60 md:text-lg"
          >
            Solar flares are intense localized bursts of electromagnetic radiation, driven by the
            sudden release of magnetic energy stored in the Sun&apos;s atmosphere. They are classified
            by their X-ray peak brightness.
          </motion.p>
        </div>

        {/* Flare cards */}
        <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-5">
          {FLARE_CLASSES.map((flare) => (
            <GlassPanel key={flare.label} accentColor={flare.color} className="text-center">
              <p className="font-mono text-4xl font-bold" style={{ color: flare.color }}>
                {flare.label}
              </p>
              <p className="mt-2 text-sm font-medium text-white/80">{flare.name}</p>
              <p className="mt-1 text-xs text-white/40">{flare.description}</p>
            </GlassPanel>
          ))}
        </div>
      </div>
    </section>
  );
}
```

⚠️ **Common Pitfall:** Stagger animation won't work automatically with `whileInView` on each card individually. If you want true stagger, wrap cards in a `StaggerContainer` that passes a `transition.delay` based on child index.

🔍 **Verification:** Heading and body text reveal on scroll. 5 cards stagger in with accent colors. Hovering a card shows its color glow.

---

## 8. Procedure 7: Scroll Story

**Estimated Duration:** 3–4 hours (this is the most complex section)

### Step 8.1: Scroll Progress Hook

`src/hooks/use-scroll-progress.ts`:

```typescript
'use client';
import { useScroll } from 'motion/react';
import { useRef } from 'react';

export function useScrollProgress() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return { containerRef, scrollYProgress };
}
```

### Step 8.2: Scene Renderer

`src/components/sections/scroll-story/scene-renderer.tsx`:

This component renders the visual state of the scroll story — the solar disk, glow, flash, ring, particles, and spacecraft icon — all driven by `scrollYProgress`.

```typescript
'use client';
import { motion, useTransform, MotionValue, useReducedMotion } from 'motion/react';

interface SceneRendererProps {
  progress: MotionValue<number>;
}

export function SceneRenderer({ progress }: SceneRendererProps) {
  const prefersReducedMotion = useReducedMotion();

  // If reduced motion, show a static midpoint state
  if (prefersReducedMotion) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Sun at stable state */}
          <div className="h-48 w-48 rounded-full bg-gradient-to-br from-plasma-orange to-eruption-red shadow-[0_0_80px_rgba(255,122,0,0.3)] md:h-64 md:w-64" />
          <p className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-sm text-white/40 whitespace-nowrap">
            A solar flare in progress
          </p>
        </div>
      </div>
    );
  }

  // Transform values based on scroll progress
  const sunScale = useTransform(progress, [0, 0.25, 0.5, 0.55, 0.7, 1], [0.8, 0.85, 0.95, 1.2, 1.0, 1.0]);
  const glowOpacity = useTransform(progress, [0, 0.25, 0.5, 0.55, 0.7, 1], [0.2, 0.35, 0.6, 1, 0.6, 0.5]);
  const flashOpacity = useTransform(progress, [0.5, 0.55, 0.6], [0, 0.9, 0]);
  const ringScale = useTransform(progress, [0.5, 0.6], [0.5, 3]);
  const ringOpacity = useTransform(progress, [0.5, 0.55, 0.7], [0, 0.8, 0]);
  const spacecraftOpacity = useTransform(progress, [0.72, 0.78], [0, 1]);
  const bgColor = useTransform(
    progress,
    [0, 0.25, 0.5, 0.55, 0.7, 1],
    ['#0A0505', '#1A0A05', '#2A1500', '#FF4500', '#3A2010', '#1A1520']
  );

  return (
    <motion.div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: bgColor }}>
      {/* Expanding ring (Act 3) */}
      <motion.div
        className="absolute rounded-full border-2 border-plasma-orange/60"
        style={{
          width: 300,
          height: 300,
          scale: ringScale,
          opacity: ringOpacity,
        }}
      />

      {/* Flash (Act 3) */}
      <motion.div
        className="absolute inset-0 bg-white"
        style={{ opacity: flashOpacity }}
      />

      {/* Solar disk */}
      <motion.div
        className="relative"
        style={{ scale: sunScale }}
      >
        <div className="h-48 w-48 rounded-full bg-gradient-to-br from-plasma-orange via-flare-gold to-eruption-red md:h-64 md:w-64" />
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: '0 0 100px rgba(255, 122, 0, 0.6)',
            opacity: glowOpacity,
          }}
        />
      </motion.div>

      {/* Spacecraft (Act 4) */}
      <motion.div
        className="absolute bottom-16 right-16"
        style={{ opacity: spacecraftOpacity }}
      >
        <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-space-navy/80 px-4 py-2 backdrop-blur-sm">
          <div className="h-3 w-3 rounded-full bg-instrument-cyan" />
          <span className="font-mono text-xs text-white/60">Aditya-L1</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
```

### Step 8.3: Progressive Labels

`src/components/sections/scroll-story/progressive-labels.tsx`:

```typescript
'use client';
import { motion, useTransform, MotionValue, useReducedMotion } from 'motion/react';
import { SCROLL_STORY_ACTS } from '@/lib/constants';

interface ProgressiveLabelsProps {
  progress: MotionValue<number>;
}

export function ProgressiveLabels({ progress }: ProgressiveLabelsProps) {
  const prefersReducedMotion = useReducedMotion();
  const actIndex = useTransform(progress, [0, 0.25, 0.5, 0.75], [0, 1, 2, 3]);
  const labelOpacity = useTransform(progress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  const currentAct = useTransform(actIndex, (i) => SCROLL_STORY_ACTS[i] || SCROLL_STORY_ACTS[0]);

  // For reduced motion, show a single message
  if (prefersReducedMotion) {
    return (
      <div className="absolute bottom-24 left-1/2 z-10 -translate-x-1/2 text-center">
        <p className="text-sm font-medium text-white/40">Scroll to experience the solar flare sequence</p>
      </div>
    );
  }

  return (
    <motion.div className="absolute bottom-24 left-1/2 z-10 -translate-x-1/2 text-center" style={{ opacity: labelOpacity }}>
      {/* Rendered on every frame — uses Motion value subscription */}
      <motion.p className="font-display text-lg font-semibold text-white/80 md:text-2xl">
        {currentAct.get()?.title}
      </motion.p>
      <motion.p className="mt-2 max-w-md text-sm text-white/40 md:text-base">
        {currentAct.get()?.description}
      </motion.p>
    </motion.div>
  );
}
```

### Step 8.4: Scroll Story Assembly

`src/components/sections/scroll-story/scroll-story.tsx`:

```typescript
'use client';
import { useScrollProgress } from '@/hooks/use-scroll-progress';
import { SceneRenderer } from './scene-renderer';
import { ProgressiveLabels } from './progressive-labels';

export function ScrollStorySection() {
  const { containerRef, scrollYProgress } = useScrollProgress();

  return (
    <section
      ref={containerRef}
      className="relative h-[500vh]"
      id="story"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <SceneRenderer progress={scrollYProgress} />
        <ProgressiveLabels progress={scrollYProgress} />
      </div>
    </section>
  );
}
```

⚠️ **Common Pitfall:** The `currentAct.get()` call in `ProgressiveLabels` works but reads the value imperatively. For a more React-idiomatic approach, use `useMotionValueEvent` to set state. However, for the sprint, `.get()` is acceptable and simpler.

🔍 **Verification:** Scrolling through the story section transitions between all 4 acts. The sun changes brightness, scale, and color. The flash effect fires at ~55% scroll. The spacecraft appears in act 4. Text updates match the current act.

---

## 9. Procedure 8: Footer CTA

**Estimated Duration:** 30 minutes

### Step 9.1: Footer Section

`src/components/sections/footer/footer.tsx`:

```typescript
'use client';
import { motion } from 'motion/react';
import { AnimatedHeading } from '@/components/animation/animated-heading';
import { GlowButton } from '@/components/ui-parts/glow-button';

export function FooterSection() {
  return (
    <section className="relative px-4 py-24 md:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <AnimatedHeading
          as="h2"
          text="The Sun Has More to Reveal"
          className="text-balance font-display text-[clamp(2rem,4vw,4.5rem)] font-bold leading-[1.2] tracking-tight"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-white/60 md:text-lg"
        >
          Every flare, every observation brings us closer to understanding our nearest star.
          Explore the data, follow the mission, and watch the sky.
        </motion.p>

        <div className="mt-10">
          <GlowButton>Learn More About Aditya-L1</GlowButton>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-xs text-white/30"
        >
          In partnership with Indian Space Research Organisation (ISRO)
        </motion.p>
      </div>
    </section>
  );
}
```

🔍 **Verification:** Footer heading animates in, body paragraph fades, CTA button appears with glow, credit line fades at bottom.

---

## 10. Procedure 9: Page Assembly

**Estimated Duration:** 15 minutes

### Step 10.1: Main Page

`src/app/page.tsx`:

```typescript
import { HeroSection } from '@/components/sections/hero/hero';
import { MissionSection } from '@/components/sections/mission/mission';
import { FlaresSection } from '@/components/sections/flares/flares';
import { ScrollStorySection } from '@/components/sections/scroll-story/scroll-story';
import { FooterSection } from '@/components/sections/footer/footer';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <MissionSection />
      <FlaresSection />
      <ScrollStorySection />
      <FooterSection />
    </main>
  );
}
```

🔍 **Verification:** `npm run dev` — navigate through all 5 sections. Smooth scroll between sections. No console errors.

---

## 11. Procedure 10: Polish Pass

**Estimated Duration:** 1.5 hours

### Step 10.1: Responsiveness Check

- [ ] Test at 375px (iPhone SE) — no overflow, text readable, CTA full-width
- [ ] Test at 768px (iPad) — layout adjusts, navbar hamburger visible
- [ ] Test at 1024px (iPad landscape) — 5 flare cards fit in a row
- [ ] Test at 1440px (desktop) — everything spacious and balanced

### Step 10.2: Reduced Motion Check

- [ ] Enable `prefers-reduced-motion: reduce` in DevTools
- [ ] Heading should appear all at once (no word stagger)
- [ ] Scroll story should show a static state
- [ ] No continuous animations running

### Step 10.3: Visual Polish

- [ ] Heading spacing feels premium (enough whitespace above)
- [ ] Cards have clear hover states
- [ ] Scroll story acts are readable (text contrast sufficient)
- [ ] Footer feels like a deliberate ending
- [ ] Navbar doesn't overlap section content

### Step 10.4: Technical Checks

- [ ] `npm run build` passes with zero errors
- [ ] No TypeScript errors
- [ ] No console errors in browser
- [ ] All images/static files load correctly
- [ ] Page loads without flash of unstyled content

### Step 10.5: Edge Cases

- [ ] Very long content titles don't break layout
- [ ] Rapid scrolling doesn't cause visual glitches
- [ ] Tab navigation works through all interactive elements
- [ ] Page doesn't jump or shift during loading

---

## 12. Procedure 11: Deployment

**Estimated Duration:** 30 minutes

### Step 11.1: Production Build

```bash
npm run build
```

🔍 **Verification:** Confirm zero errors. Note any warnings but do not proceed if there are errors.

### Step 11.2: Deploy to Vercel

```bash
npx vercel --prod
```

Or connect the GitHub repository to Vercel and deploy via the Vercel dashboard.

### Step 11.3: Post-Deployment Verification

- [ ] Live URL loads correctly
- [ ] Hero section renders with 3D background
- [ ] Scroll story transitions through all 4 acts
- [ ] Mobile layout is acceptable
- [ ] Lighthouse Performance score ≥ 85
- [ ] Lighthouse Accessibility score ≥ 90

---

## 13. Time Budget Reference

| Procedure | Estimated | Actual | Notes |
|---|---|---|---|
| P1: Project Scaffolding | 20 min | | |
| P2: Design System | 40 min | | |
| P3: Layout Shell | 45 min | | |
| P4: Hero Section | 2.5h | | Most critical section |
| P5: Mission Section | 1h | | |
| P6: Flares Section | 1.5h | | |
| P7: Scroll Story | 3.5h | | Most complex section |
| P8: Footer CTA | 30 min | | |
| P9: Page Assembly | 15 min | | |
| P10: Polish Pass | 1.5h | | |
| P11: Deployment | 30 min | | |
| **Total** | **~13h** | | **2h buffer available** |

### Time Management Rules

- If you exceed the estimate for a procedure by more than 30%, **stop and reassess**. You may need to simplify.
- The 2-hour buffer should be used only for **critical fixes**, not additional features.
- **Never add scope** during implementation. If something seems missing, log it for Phase 2 and move on.

---

*This procedure is the definitive implementation guide. Follow it sequentially and check off each item before moving to the next step.*
