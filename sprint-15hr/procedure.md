# SPRINT PROCEDURE — Aditya-L1 Solar Flares (15-Hour Build)

> **Step-by-step implementation guide for the compressed sprint.**
> Each step includes the exact code/commands to run. Build top-to-bottom.
> Full 18-day procedure in `plan-18day/procedure.md`.

---

## PROCEDURE 1 — PROJECT SCAFFOLD (30 min)

### Step 1.1: Create the project

```bash
npx create-next-app@latest aditya-l1-frontend `
  --typescript `
  --tailwind `
  --app `
  --src-dir `
  --import-alias "@/*"

cd aditya-l1-frontend
```

### Step 1.2: Install dependencies

```bash
# Animation & UI
npm install motion
npx shadcn@latest init -d
npx shadcn@latest add button card sheet tooltip

# 3D & shaders
npm install three @react-three/fiber @react-three/drei @shadergradient/react
npm install -D @types/three
```

### Step 1.3: Verify

```bash
npm run dev
# Open http://localhost:3000 — default Next.js page renders
```

**Gate** ✅ Dev server runs.

---

## PROCEDURE 2 — DESIGN SYSTEM (45 min)

### Step 2.1: Tailwind config

Edit `tailwind.config.ts`:

```typescript
const config = {
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
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(255, 122, 0, 0.2)' },
          '100%': { boxShadow: '0 0 40px rgba(255, 122, 0, 0.6)' },
        },
      },
    },
  },
};
```

### Step 2.2: Import fonts in `layout.tsx`

```typescript
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk', display: 'swap' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono', display: 'swap' });
```

Add to `<body>`: `className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-body antialiased bg-space-black text-white`}`

### Step 2.3: Update `globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * { @apply border-border; }
  body { @apply bg-space-black text-white font-body antialiased; }
}
```

### Step 2.4: Create `src/lib/constants.ts`

```typescript
export const MISSION_DATA = {
  title: "Aditya-L1",
  tagline: "India's First Solar Mission",
  description: "Aditya-L1 extends India's solar observation capability by positioning instruments at the Sun–Earth L1 point...",
  metrics: [
    { label: "Position", value: "L1 Point" },
    { label: "Distance", value: "1.5M KM" },
    { label: "Coverage", value: "24/7" },
  ],
};

export const FLARE_CLASSES = [
  { label: "B", name: "Minor", color: "#55D6FF", desc: "Small, nearly imperceptible" },
  { label: "C", name: "Moderate", color: "#4EA8DE", desc: "Minor radiation events" },
  { label: "M", name: "Strong", color: "#FFB347", desc: "Can cause radio blackouts" },
  { label: "X", name: "Major", color: "#FF7A00", desc: "Significant space weather" },
  { label: "XX", name: "Extreme", color: "#FF4D36", desc: "Rare, planet-scale events" },
];

export const SCROLL_STORY_ACTS = [
  { name: "quiet",    range: [0.0, 0.25], label: "The Sun, in its quiet state..." },
  { name: "buildup",  range: [0.25, 0.5], label: "Magnetic energy accumulates..." },
  { name: "burst",    range: [0.5, 0.75], label: "A flare erupts — billions of megatons..." },
  { name: "observe",  range: [0.75, 1.0], label: "Captured by Aditya-L1 in real-time..." },
];

export const Z_INDEX = { background: 0, content: 10, navbar: 50, overlay: 100 };
```

**Gate** ✅ TypeScript compiles, design tokens ready.

---

## PROCEDURE 3 — LAYOUT SHELL (45 min)

### Step 3.1: SectionShell component

Create `src/components/layout/section-shell.tsx`:

```tsx
interface SectionShellProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function SectionShell({ children, className, id }: SectionShellProps) {
  return (
    <section id={id} className={`relative px-4 py-24 md:py-32 max-w-7xl mx-auto ${className ?? ''}`}>
      {children}
    </section>
  );
}
```

### Step 3.2: Noise overlay (add in layout.tsx)

Add this CSS to `globals.css`:

```css
.noise-overlay::after {
  content: '';
  position: fixed;
  inset: -50%;
  width: 200%;
  height: 200%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E");
  opacity: 0.025;
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: overlay;
}
```

Add `<div className="noise-overlay" />` to layout.

### Step 3.3: Root layout

```tsx
// src/app/layout.tsx
import { Navbar } from '@/components/layout/navbar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-body antialiased bg-space-black text-white`}>
        <div className="noise-overlay" />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
```

### Step 3.4: Home page (empty shell)

```tsx
// src/app/page.tsx
export default function Home() {
  return (
    <main>
      {/* Hero */}
      {/* Mission */}
      {/* Flares */}
      {/* Scroll Story */}
      {/* Footer */}
    </main>
  );
}
```

**Gate** ✅ Dark page with noise overlay renders.

---

## PROCEDURE 4 — HERO IMPLEMENTATION (2.5 hours)

### Step 4.1: Starfield

```tsx
// src/components/sections/hero/starfield.tsx
'use client';

import { Stars } from '@react-three/drei';

export function Starfield() {
  return (
    <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />
  );
}
```

### Step 4.2: Solar Core (shadergradient)

```tsx
// src/components/sections/hero/solar-core.tsx
'use client';

import { Gradient } from '@shadergradient/react';

export function SolarCore() {
  return (
    <Gradient
      type="sphere"
      color1="#FF7A00"
      color2="#FFB347"
      color3="#FF4D36"
      brightness={1.5}
      // shadergradient auto-animates
    />
  );
}
```

### Step 4.3: Scene wrapper

```tsx
// src/components/sections/hero/scene-wrapper.tsx
'use client';

import { Canvas } from '@react-three/fiber';

export function SceneWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} />
      {children}
    </Canvas>
  );
}
```

### Step 4.4: AnimatedHeading

```tsx
// src/components/animation/animated-heading.tsx
'use client';

import { motion } from 'motion/react';

interface Props {
  text: string;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  stagger?: number;
}

export function AnimatedHeading({ text, as: Tag = 'h2', className, stagger = 0.15 }: Props) {
  const words = text.split(' ');

  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: i * stagger, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
}
```

### Step 4.5: GlowButton

```tsx
// src/components/ui-parts/glow-button.tsx
'use client';

import { motion } from 'motion/react';

export function GlowButton({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) {
  return (
    <motion.button
      className={`relative px-8 py-3 rounded-full border border-plasma-orange/50 text-white bg-plasma-orange/10 
        hover:bg-plasma-orange/20 transition-colors cursor-pointer ${className ?? ''}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...(props as any)}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 rounded-full animate-glow opacity-50" />
    </motion.button>
  );
}
```

### Step 4.6: Assemble Hero

```tsx
// src/components/sections/hero/hero.tsx
'use client';

import dynamic from 'next/dynamic';
import { AnimatedHeading } from '@/components/animation/animated-heading';
import { GlowButton } from '@/components/ui-parts/glow-button';

const SceneWrapper = dynamic(() => import('./scene-wrapper').then(m => m.SceneWrapper), { ssr: false });
const Starfield = dynamic(() => import('./starfield').then(m => m.Starfield), { ssr: false });
const SolarCore = dynamic(() => import('./solar-core').then(m => m.SolarCore), { ssr: false });

export function HeroSection() {
  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background 3D */}
      <div className="absolute inset-0">
        <SceneWrapper>
          <Starfield />
          <SolarCore />
        </SceneWrapper>
      </div>

      {/* Gradient vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-space-black" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <AnimatedHeading
          text="SOLAR INTELLIGENCE IN MOTION"
          as="h1"
          className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight"
          stagger={0.2}
        />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-lg text-white/60 mt-6 max-w-2xl mx-auto"
        >
          Aditya-L1 extends India's solar observation capability by positioning instruments
          at the Sun–Earth L1 point to monitor dynamic solar activity with uninterrupted precision.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10"
        >
          <GlowButton>Explore the Mission</GlowButton>
        </motion.div>
      </div>
    </section>
  );
}
```

**Gate** ✅ Hero renders with starfield, solar core, staggered heading, animated CTA.

---

## PROCEDURE 5 — NAVBAR (45 min)

### Step 5.1: Navbar component

```tsx
// src/components/layout/navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const NAV_ITEMS = [
  { label: 'Mission', href: '#mission' },
  { label: 'Science', href: '#flares' },
  { label: 'Story', href: '#story' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-space-black/70 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <span className="font-display font-bold text-lg tracking-tight text-white">
          ADITYA<span className="text-plasma-orange">-L1</span>
        </span>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map(item => (
            <a key={item.href} href={item.href} className="text-sm text-white/60 hover:text-white transition-colors">
              {item.label}
            </a>
          ))}
          <GlowButton className="text-sm !px-4 !py-2">Explore</GlowButton>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-white" onClick={() => setMenuOpen(true)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-space-black z-50 flex flex-col items-center justify-center gap-8"
          >
            <button className="absolute top-4 right-4 text-white" onClick={() => setMenuOpen(false)}>
              ✕
            </button>
            {NAV_ITEMS.map(item => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                className="text-2xl font-display text-white/80 hover:text-white transition-colors">
                {item.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
```

**Gate** ✅ Navbar transparent on hero, blurs on scroll, mobile menu works.

---

## PROCEDURE 6 — MISSION OVERVIEW (1 hour)

### Step 6.1: MetricChip

```tsx
// src/components/ui-parts/metric-chip.tsx
'use client';

import { motion } from 'motion/react';

interface Props {
  label: string;
  value: string;
  index: number;
}

export function MetricChip({ label, value, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
      className="text-center p-6 rounded-xl bg-white/5 border border-white/10"
    >
      <div className="text-2xl font-display font-bold text-plasma-orange">{value}</div>
      <div className="text-sm text-white/50 mt-1">{label}</div>
    </motion.div>
  );
}
```

### Step 6.2: Mission section

```tsx
// src/components/sections/mission/mission.tsx
'use client';

import { motion } from 'motion/react';
import { SectionShell } from '@/components/layout/section-shell';
import { AnimatedHeading } from '@/components/animation/animated-heading';
import { MetricChip } from '@/components/ui-parts/metric-chip';
import { MISSION_DATA } from '@/lib/constants';

export function MissionSection() {
  return (
    <SectionShell id="mission">
      <div className="max-w-3xl mx-auto">
        <AnimatedHeading text="Watching the Sun, Uninterrupted" className="text-4xl md:text-5xl font-display font-bold" />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-6 text-white/70 leading-relaxed"
        >
          {MISSION_DATA.description}
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-3xl mx-auto">
        {MISSION_DATA.metrics.map((metric, i) => (
          <MetricChip key={metric.label} label={metric.label} value={metric.value} index={i} />
        ))}
      </div>
    </SectionShell>
  );
}
```

**Gate** ✅ Mission section with heading, description, metric chips.

---

## PROCEDURE 7 — SOLAR FLARES (1 hour)

### Step 7.1: GlassPanel

```tsx
// src/components/ui-parts/glass-panel.tsx
'use client';

import { motion } from 'motion/react';

interface Props {
  children: React.ReactNode;
  className?: string;
  hoverColor?: string;
}

export function GlassPanel({ children, className, hoverColor = 'rgba(255,122,0,0.3)' }: Props) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, borderColor: hoverColor }}
      className={`rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 transition-colors cursor-default ${className ?? ''}`}
    >
      {children}
    </motion.div>
  );
}
```

### Step 7.2: Flares section

```tsx
// src/components/sections/flares/flares.tsx
'use client';

import { SectionShell } from '@/components/layout/section-shell';
import { AnimatedHeading } from '@/components/animation/animated-heading';
import { GlassPanel } from '@/components/ui-parts/glass-panel';
import { FLARE_CLASSES } from '@/lib/constants';
import { motion } from 'motion/react';

export function FlaresSection() {
  return (
    <SectionShell id="flares" className="bg-space-navy/50">
      <div className="max-w-4xl mx-auto">
        <AnimatedHeading text="What is a Solar Flare?" className="text-4xl md:text-5xl font-display font-bold" />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-6 text-white/70 leading-relaxed max-w-2xl"
        >
          Solar flares are intense localized bursts of electromagnetic radiation, releasing energy
          equivalent to millions of hydrogen bombs in minutes. They are classified by their X-ray
          brightness across five categories.
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-12">
          {FLARE_CLASSES.map((flare, i) => (
            <motion.div
              key={flare.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <GlassPanel hoverColor={flare.color}>
                <div className="text-center">
                  <div className="text-3xl font-display font-bold" style={{ color: flare.color }}>
                    {flare.label}
                  </div>
                  <div className="text-sm font-semibold text-white/80 mt-1">{flare.name}</div>
                  <div className="text-xs text-white/40 mt-2">{flare.desc}</div>
                </div>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
```

**Gate** ✅ Flare cards staggered, hover effects work, content renders.

---

## PROCEDURE 8 — SCROLL STORY (3 hours) ★★★

### Step 8.1: ScrollProgress hook

```tsx
// src/hooks/use-scroll-progress.ts
import { useScroll } from 'motion/react';
import { useRef } from 'react';

export function useScrollProgress() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  return { containerRef, scrollYProgress };
}
```

### Step 8.2: Scene renderer (4 acts)

```tsx
// src/components/sections/scroll-story/scene-renderer.tsx
'use client';

import { useTransform, motion } from 'motion/react';
import { SCROLL_STORY_ACTS } from '@/lib/constants';

interface Props {
  progress: any; // MotionValue<number>
}

export function SceneRenderer({ progress }: Props) {
  // Act 1: Quiet Sun
  const bgOpacity1 = useTransform(progress, [0, 0.15, 0.2, 0.3], [0.15, 0.15, 0, 0]);
  const circleScale1 = useTransform(progress, [0, 0.25], [1, 1.1]);

  // Act 2: Buildup
  const bgOpacity2 = useTransform(progress, [0.25, 0.35, 0.45, 0.55], [0, 0.3, 0.3, 0]);
  const circleScale2 = useTransform(progress, [0.25, 0.5], [1.1, 1.2]);

  // Act 3: Flare Burst
  const flashOpacity = useTransform(progress, [0.5, 0.55, 0.65, 0.7], [0, 0.8, 0.4, 0]);
  const bgOpacity3 = useTransform(progress, [0.5, 0.6, 0.7, 0.8], [0, 0.2, 0.2, 0]);

  // Act 4: Observation
  const spacecraftOpacity = useTransform(progress, [0.75, 0.85], [0, 1]);
  const dataLineProgress = useTransform(progress, [0.8, 1], [0, 1]);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Background layers per act */}
      <motion.div className="absolute inset-0 bg-plasma-orange" style={{ opacity: bgOpacity1 }} />
      <motion.div className="absolute inset-0" style={{ opacity: bgOpacity2, background: 'radial-gradient(circle, rgba(255,179,71,0.3) 0%, transparent 70%)' }} />
      <motion.div className="absolute inset-0 bg-white" style={{ opacity: flashOpacity }} />

      {/* Central circle (the Sun) */}
      <motion.div
        className="w-64 h-64 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-plasma-orange via-flare-gold to-eruption-red"
        style={{ scale: circleScale1, opacity: useTransform(progress, [0, 0.5, 0.75], [0.8, 1, 0.6]) }}
      />

      {/* Expanding ring (act 3) */}
      <motion.div
        className="absolute w-96 h-96 md:w-[500px] md:h-[500px] rounded-full border-2 border-white/30"
        style={{
          scale: useTransform(progress, [0.5, 0.75], [0.5, 1.5]),
          opacity: useTransform(progress, [0.5, 0.65, 0.75], [0, 0.6, 0]),
        }}
      />

      {/* Spacecraft icon (act 4) — geometric SVG placeholder */}
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-16 h-8 bg-telemetry-blue rounded"
        style={{ opacity: spacecraftOpacity }}
      />

      {/* Data line (act 4) — SVG line from flare to spacecraft */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: spacecraftOpacity }}>
        <motion.line
          x1="50%" y1="40%" x2="70%" y2="65%"
          stroke="#55D6FF" strokeWidth="2"
          style={{ pathLength: dataLineProgress }}
        />
      </svg>
    </div>
  );
}
```

### Step 8.3: Progressive labels

```tsx
// src/components/sections/scroll-story/progressive-labels.tsx
'use client';

import { useTransform, motion } from 'motion/react';
import { SCROLL_STORY_ACTS } from '@/lib/constants';

interface Props {
  progress: any;
}

export function ProgressiveLabels({ progress }: Props) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-10">
      {SCROLL_STORY_ACTS.map((act) => {
        const opacity = useTransform(
          progress,
          [act.range[0] - 0.05, act.range[0] + 0.05, act.range[1] - 0.05, act.range[1] + 0.05],
          [0, 1, 1, 0]
        );
        const y = useTransform(progress, [act.range[0], act.range[1]], [20, -20]);

        return (
          <motion.p
            key={act.name}
            className="absolute text-xl md:text-3xl font-display font-semibold text-white text-center max-w-lg px-4"
            style={{ opacity, y }}
          >
            {act.label}
          </motion.p>
        );
      })}
    </div>
  );
}
```

### Step 8.4: Scroll story assembly

```tsx
// src/components/sections/scroll-story/scroll-story.tsx
'use client';

import { motion } from 'motion/react';
import { useScrollProgress } from '@/hooks/use-scroll-progress';
import { SceneRenderer } from './scene-renderer';
import { ProgressiveLabels } from './progressive-labels';

export function ScrollStorySection() {
  const { containerRef, scrollYProgress } = useScrollProgress();

  return (
    <section ref={containerRef} className="relative h-[500vh] bg-space-black" id="story">
      <div className="sticky top-0 h-screen overflow-hidden bg-space-navy">
        <SceneRenderer progress={scrollYProgress} />
        <ProgressiveLabels progress={scrollYProgress} />

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-white/30 uppercase tracking-widest"
          style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
        >
          Scroll to explore
        </motion.div>
      </div>
    </section>
  );
}
```

**Gate** ✅ Scrolling through section transitions all 4 acts smoothly. Text labels fade in/out. Visuals change per act.

---

## PROCEDURE 9 — FOOTER CTA (30 min)

```tsx
// src/components/sections/footer/footer.tsx
'use client';

import { motion } from 'motion/react';
import { AnimatedHeading } from '@/components/animation/animated-heading';
import { GlowButton } from '@/components/ui-parts/glow-button';

export function FooterSection() {
  return (
    <section className="relative py-32 px-4 text-center bg-space-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-plasma-orange/5 to-transparent" />
      <div className="relative z-10 max-w-3xl mx-auto">
        <AnimatedHeading
          text="Observe the Sun. Understand the Storm."
          as="h2"
          className="text-4xl md:text-6xl font-display font-bold"
        />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-6 text-white/50"
        >
          Powered by data from ISRO's Aditya-L1 mission
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-10"
        >
          <GlowButton>Learn More About the Mission</GlowButton>
        </motion.div>
      </div>
      <div className="mt-24 text-xs text-white/20">
        <p>ISRO — Indian Space Research Organisation</p>
        <p className="mt-1">© 2024 · Aditya-L1 Solar Visualization</p>
      </div>
    </section>
  );
}
```

**Gate** ✅ Footer renders with closing statement and CTA.

---

## PROCEDURE 10 — ASSEMBLE PAGE (15 min)

```tsx
// src/app/page.tsx
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

**Gate** ✅ All 5 sections render end-to-end.

---

## PROCEDURE 11 — POLISH + DEPLOY (2 hours)

### Step 11.1: Reduced motion

Add to each animated component:

```tsx
import { useReducedMotion } from 'motion/react';
const shouldReduceMotion = useReducedMotion();

// Use conditionally:
transition={!shouldReduceMotion ? { duration: 0.5, delay: i * 0.1 } : { duration: 0.2 }}
```

### Step 11.2: Dynamic imports (already done for hero 3D)

Verify `dynamic()` is used for `SceneWrapper`, `Starfield`, `SolarCore`.

### Step 11.3: Mobile pass

Test at 375px, 768px, 1024px, 1440px. Fix any overflow or layout breaks.

### Step 11.4: Build

```bash
npm run build
# Fix any TypeScript or lint errors
```

### Step 11.5: Deploy to Vercel

```bash
npx vercel --prod
```

**Gate** ✅ Live URL. All sections working. Performance acceptable.

---

## ANTI-PATTERNS CHECKLIST

- ❌ Don't animate every element identically
- ❌ Don't use 3D rotation on UI cards
- ❌ Don't float everything on hover
- ❌ Don't glow-border every component
- ❌ Don't use emoji instead of SVG
- ❌ Don't add effects before content is finalized
- ✅ Do test mobile first
- ✅ Do respect reduced-motion
- ✅ Do keep transforms + opacity only

---

*Full detailed procedures for expansion: `plan-18day/procedure.md`.*
