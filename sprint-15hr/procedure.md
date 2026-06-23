# PROCEDURE — Aditya-L1 Solar Flares (15 Hour Build)

**What this is:** A simple step-by-step guide to build the whole thing.
**Total time:** ~15 hours. **The rule:** Do step 1 first, then step 2, then step 3 — don't skip around.

---

## STEP 1: Set Up the Project (~20 min)

### 1.1 Create the app
Open your terminal and paste this:

```bash
npx create-next-app@latest aditya-l1-frontend --typescript --tailwind --app --src-dir --import-alias "@/*"
```

When it asks — name it **aditya-l1-frontend**.

### 1.2 Install the tools you need

```bash
cd aditya-l1-frontend

npm install motion three @react-three/fiber @react-three/drei @shadergradient/react

npx shadcn@latest init -d

npx shadcn@latest add button card sheet tooltip

npm install -D @types/three
```

### 1.3 Check it works

```bash
npm run dev
```

Open your browser to `http://localhost:3000`. If you see the Next.js starter page — you're good.

---

## STEP 2: Set Up Colors, Fonts & Styles (~40 min)

### 2.1 Add your colors

Open `tailwind.config.ts`. Replace everything inside with the code below.

Copy this exactly:

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
    },
  },
  plugins: [],
};

export default config;
```

### 2.2 Add your fonts

Open `src/app/layout.tsx`. Near the top, add these imports:

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

### 2.3 Set up your global styles

Open `src/app/globals.css`. Replace everything with:

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

### 2.4 Create your data file

Create a new file at `src/lib/constants.ts` and paste this:

```typescript
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

export const FLARE_CLASSES = [
  { label: 'B', name: 'Minor',   description: 'Small, frequent',   color: '#55D6FF' },
  { label: 'C', name: 'Moderate', description: 'Common, noticeable', color: '#4EA8DE' },
  { label: 'M', name: 'Strong',  description: 'Can cause radio blackouts', color: '#FFB347' },
  { label: 'X', name: 'Major',   description: 'Significant events',     color: '#FF7A00' },
  { label: 'XX', name: 'Extreme', description: 'Rare, planet-scale',     color: '#FF4D36' },
] as const;

export const SCROLL_STORY_ACTS = [
  {
    id: 'quiet-sun',
    title: 'Quiet Sun',
    description: 'The Sun, in its quiet state, radiates steady energy across the spectrum.',
  },
  {
    id: 'buildup',
    title: 'Activity Buildup',
    description: 'Magnetic energy accumulates in the solar atmosphere, twisting and stressing field lines.',
  },
  {
    id: 'flare-burst',
    title: 'Flare Burst',
    description: 'A flare erupts — an intense burst of radiation traveling at the speed of light.',
  },
  {
    id: 'observation',
    title: 'Observation',
    description: 'Captured by Aditya-L1 in real-time, adding to our understanding of space weather.',
  },
] as const;

export const NAV_ITEMS = [
  { label: 'Mission', href: '#mission' },
  { label: 'Science', href: '#flares' },
  { label: 'Story',   href: '#story' },
] as const;
```

**Check:** Run `npm run build`. If it says "0 errors", move on.

---

## STEP 3: Build the Nav Bar & Layout (~45 min)

### 3.1 Create the utility file

Create `src/lib/utils.ts`:

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

(If you get an error, run `npm install clsx tailwind-merge` first.)

### 3.2 Create the Nav Bar

Create a new file at `src/components/layout/navbar.tsx`:

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
      className="fixed top-0 left-0 right-0 z-50 border-b border-transparent backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <span className="font-display text-lg font-semibold tracking-tight">
          ADITYA-L1
        </span>

        {/* Desktop menu - hidden on mobile */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} className="text-sm text-white/70 hover:text-white">
              {item.label}
            </a>
          ))}
        </div>

        {/* Mobile menu - hamburger button */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-white">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-space-navy border-white/10">
            <nav className="mt-12 flex flex-col gap-6">
              {NAV_ITEMS.map((item) => (
                <a key={item.href} href={item.href} className="text-lg text-white/70 hover:text-white">
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

### 3.3 Update your layout file

Open `src/app/layout.tsx` and make it look like this:

```typescript
import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';

export const metadata: Metadata = {
  title: 'Aditya-L1 | Solar Flare Intelligence',
  description:
    "A cinematic, motion-first scientific storytelling frontend for India's first dedicated solar mission.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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

---

## STEP 4: Build the Hero Section (2-3 hours)

This is the first thing people see. Make it count.

### 4.1 Create these 5 files

**File 1: `src/components/sections/hero/scene-wrapper.tsx`**

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

**File 2: `src/components/sections/hero/starfield.tsx`**

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

**File 3: `src/components/sections/hero/solar-core.tsx`**

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

**File 4: `src/components/animation/animated-heading.tsx`**

This makes your heading text appear one word at a time.

```typescript
'use client';
import { motion, useReducedMotion } from 'motion/react';

export function AnimatedHeading({ text, className = '', as: Tag = 'h1' }: {
  text: string;
  className?: string;
  as?: 'h1' | 'h2';
}) {
  const prefersReducedMotion = useReducedMotion();
  const words = text.split(' ');

  // If user prefers no animation, just show the text
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

**File 5: `src/components/ui-parts/glow-button.tsx`**

```typescript
'use client';
import { motion } from 'motion/react';

export function GlowButton({ children, href }: { children: React.ReactNode; href?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 2.2, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="inline-block"
    >
      <a
        href={href || '#'}
        className="inline-flex items-center gap-2 rounded-full bg-plasma-orange px-8 py-3 font-display text-sm font-semibold text-white hover:shadow-[0_0_30px_rgba(255,122,0,0.4)]"
      >
        {children}
      </a>
    </motion.div>
  );
}
```

### 4.2 Put it all together

Create `src/components/sections/hero/hero.tsx`:

```typescript
import dynamic from 'next/dynamic';
import { motion } from 'motion/react';
import { AnimatedHeading } from '@/components/animation/animated-heading';
import { GlowButton } from '@/components/ui-parts/glow-button';

// These 3D components load AFTER the page loads (makes it faster)
const SceneWrapper = dynamic(() => import('./scene-wrapper').then((m) => m.SceneWrapper), { ssr: false });
const Starfield = dynamic(() => import('./starfield').then((m) => m.Starfield), { ssr: false });
const SolarCore = dynamic(() => import('./solar-core').then((m) => m.SolarCore), { ssr: false });

export function HeroSection() {
  return (
    <section id="hero" className="relative h-screen overflow-hidden">
      {/* 3D background */}
      <div className="absolute inset-0">
        <SceneWrapper>
          <Starfield />
          <SolarCore />
        </SceneWrapper>
      </div>

      {/* Dark overlay so text is readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-space-black/30 to-space-black" />

      {/* Text on top */}
      <div className="relative z-10 flex h-full items-center justify-center px-4 text-center">
        <div className="max-w-4xl">
          <AnimatedHeading
            text="SOLAR INTELLIGENCE IN MOTION"
            className="font-display text-[clamp(3.5rem,8vw,8rem)] font-bold leading-[1.1] tracking-tight text-white"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-white/60 md:text-xl"
          >
            India's first dedicated solar observatory — watching the Sun from 1.5 million kilometers away.
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

**What to check:** Save all files. The page should reload. You should see:
- A dark screen with stars and a glowing orange sun
- Text that appears word by word
- A button that glows when you hover it
- The nav bar starts transparent, then turns dark when you scroll

---

## STEP 5: Build the Mission Section (~1 hour)

### 5.1 Create the metric chip

`src/components/ui-parts/metric-chip.tsx`:

```typescript
'use client';
import { motion } from 'motion/react';

export function MetricChip({ label, value, index }: { label: string; value: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.4 + index * 0.08 }}
      className="rounded-xl border border-white/10 bg-space-navy/60 p-6 text-center backdrop-blur-sm"
    >
      <p className="font-mono text-2xl font-bold text-plasma-orange md:text-3xl">{value}</p>
      <p className="mt-2 text-sm text-white/50">{label}</p>
    </motion.div>
  );
}
```

### 5.2 Create the mission section

`src/components/sections/mission/mission.tsx`:

```typescript
'use client';
import { motion } from 'motion/react';
import { AnimatedHeading } from '@/components/animation/animated-heading';
import { MetricChip } from '@/components/ui-parts/metric-chip';
import { MISSION_DATA } from '@/lib/constants';

export function MissionSection() {
  return (
    <section id="mission" className="relative px-4 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <AnimatedHeading as="h2" text="Watching the Sun, Uninterrupted" className="font-display text-[clamp(2rem,4vw,4.5rem)] font-bold leading-[1.2]" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 space-y-4 text-base leading-relaxed text-white/60 md:text-lg"
          >
            <p>{MISSION_DATA.description}</p>
            <p>From this vantage, the mission captures the full chain of solar events: from magnetic buildup on the surface to the eruption of flares and coronal mass ejections.</p>
          </motion.div>
        </div>

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

---

## STEP 6: Build the Flares Section (~1.5 hours)

### 6.1 Create the glass panel card

`src/components/ui-parts/glass-panel.tsx`:

```typescript
'use client';
import { motion } from 'motion/react';

export function GlassPanel({ children, accentColor }: { children: React.ReactNode; accentColor: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{
        borderColor: accentColor,
        backgroundColor: accentColor + '0a',
        boxShadow: `0 0 20px ${accentColor}20`,
      }}
      className="rounded-xl border border-white/10 bg-space-navy/60 p-6 text-center backdrop-blur-sm transition-colors duration-200"
    >
      {children}
    </motion.div>
  );
}
```

### 6.2 Create the flares section

`src/components/sections/flares/flares.tsx`:

```typescript
'use client';
import { motion } from 'motion/react';
import { AnimatedHeading } from '@/components/animation/animated-heading';
import { GlassPanel } from '@/components/ui-parts/glass-panel';
import { FLARE_CLASSES } from '@/lib/constants';

export function FlaresSection() {
  return (
    <section id="flares" className="relative px-4 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <AnimatedHeading as="h2" text="What is a Solar Flare?" className="font-display text-[clamp(2rem,4vw,4.5rem)] font-bold leading-[1.2]" />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 text-base leading-relaxed text-white/60 md:text-lg"
          >
            Solar flares are intense bursts of radiation caused by the sudden release of magnetic energy in the Sun's atmosphere.
            They are classified by their X-ray peak brightness.
          </motion.p>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-5">
          {FLARE_CLASSES.map((flare) => (
            <GlassPanel key={flare.label} accentColor={flare.color}>
              <p className="font-mono text-4xl font-bold" style={{ color: flare.color }}>{flare.label}</p>
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

---

## STEP 7: Build the Scroll Story (3-4 hours)

This is the coolest part — a story that plays as you scroll.

### 7.1 Create the scroll hook

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

### 7.2 Create the scene renderer (this is where the magic happens)

`src/components/sections/scroll-story/scene-renderer.tsx`:

```typescript
'use client';
import { motion, useTransform, useReducedMotion } from 'motion/react';

export function SceneRenderer({ progress }: { progress: any }) {
  const prefersReducedMotion = useReducedMotion();

  // If user doesn't want animations, show a simple static sun
  if (prefersReducedMotion) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-48 w-48 rounded-full bg-gradient-to-br from-plasma-orange to-eruption-red shadow-[0_0_80px_rgba(255,122,0,0.3)] md:h-64 md:w-64" />
      </div>
    );
  }

  // When you scroll, these values change smoothly
  const sunScale = useTransform(progress, [0, 0.25, 0.5, 0.55, 0.7, 1], [0.8, 0.85, 0.95, 1.2, 1.0, 1.0]);
  const glowOpacity = useTransform(progress, [0, 0.25, 0.5, 0.55, 0.7, 1], [0.2, 0.35, 0.6, 1, 0.6, 0.5]);
  const flashOpacity = useTransform(progress, [0.5, 0.55, 0.6], [0, 0.9, 0]);
  const ringScale = useTransform(progress, [0.5, 0.6], [0.5, 3]);
  const ringOpacity = useTransform(progress, [0.5, 0.55, 0.7], [0, 0.8, 0]);
  const spacecraftOpacity = useTransform(progress, [0.72, 0.78], [0, 1]);
  const bgColor = useTransform(progress, [0, 0.25, 0.5, 0.55, 0.7, 1], ['#0A0505', '#1A0A05', '#2A1500', '#FF4500', '#3A2010', '#1A1520']);

  return (
    <motion.div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: bgColor }}>
      {/* Expanding ring - appears during the flare burst */}
      <motion.div
        className="absolute rounded-full border-2 border-plasma-orange/60"
        style={{ width: 300, height: 300, scale: ringScale, opacity: ringOpacity }}
      />

      {/* White flash - simulates the flare explosion */}
      <motion.div className="absolute inset-0 bg-white" style={{ opacity: flashOpacity }} />

      {/* The Sun itself */}
      <motion.div className="relative" style={{ scale: sunScale }}>
        <div className="h-48 w-48 rounded-full bg-gradient-to-br from-plasma-orange via-flare-gold to-eruption-red md:h-64 md:w-64" />
        <motion.div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 100px rgba(255, 122, 0, 0.6)', opacity: glowOpacity }} />
      </motion.div>

      {/* Spacecraft - appears in act 4 */}
      <motion.div className="absolute bottom-16 right-16" style={{ opacity: spacecraftOpacity }}>
        <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-space-navy/80 px-4 py-2 backdrop-blur-sm">
          <div className="h-3 w-3 rounded-full bg-instrument-cyan" />
          <span className="font-mono text-xs text-white/60">Aditya-L1</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
```

### 7.3 Create the text labels that change as you scroll

`src/components/sections/scroll-story/progressive-labels.tsx`:

```typescript
'use client';
import { motion, useTransform } from 'motion/react';
import { SCROLL_STORY_ACTS } from '@/lib/constants';

export function ProgressiveLabels({ progress }: { progress: any }) {
  const labelOpacity = useTransform(progress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  const index = useTransform(progress, [0, 0.25, 0.5, 0.75], [0, 1, 2, 3]);
  const act = useTransform(index, (i) => SCROLL_STORY_ACTS[i] || SCROLL_STORY_ACTS[0]);

  return (
    <motion.div className="absolute bottom-24 left-1/2 z-10 -translate-x-1/2 text-center" style={{ opacity: labelOpacity }}>
      <motion.p className="font-display text-lg font-semibold text-white/80 md:text-2xl">
        {act.get()?.title}
      </motion.p>
      <motion.p className="mt-2 max-w-md text-sm text-white/40 md:text-base">
        {act.get()?.description}
      </motion.p>
    </motion.div>
  );
}
```

### 7.4 Put the scroll story together

`src/components/sections/scroll-story/scroll-story.tsx`:

```typescript
'use client';
import { useScrollProgress } from '@/hooks/use-scroll-progress';
import { SceneRenderer } from './scene-renderer';
import { ProgressiveLabels } from './progressive-labels';

export function ScrollStorySection() {
  const { containerRef, scrollYProgress } = useScrollProgress();

  return (
    <section ref={containerRef} className="relative h-[500vh]" id="story">
      {/* Sticky means it stays on screen while you scroll through it */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <SceneRenderer progress={scrollYProgress} />
        <ProgressiveLabels progress={scrollYProgress} />
      </div>
    </section>
  );
}
```

---

## STEP 8: Build the Footer (~30 min)

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
        <AnimatedHeading as="h2" text="The Sun Has More to Reveal" className="font-display text-[clamp(2rem,4vw,4.5rem)] font-bold leading-[1.2]" />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-white/60 md:text-lg"
        >
          Every flare, every observation brings us closer to understanding our nearest star.
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

---

## STEP 9: Wire Everything Together (~15 min)

Open `src/app/page.tsx`. Replace everything with:

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

---

## STEP 10: Check Everything (~1.5 hours)

### Quick checklist

**Responsive (check all screen sizes):**
- [ ] Looks good on a phone (375px wide)
- [ ] Looks good on a tablet (768px)
- [ ] Looks good on a desktop (1440px)
- [ ] No horizontal scroll bar anywhere

**Animations:**
- [ ] Words appear one by one in the hero
- [ ] Scroll story works (sun changes, flash happens, spacecraft appears)
- [ ] Hovering cards shows their color glow

**No animation mode (accessibility):**
- [ ] Turn on "reduce motion" in your browser settings
- [ ] Everything should still be visible, just without animations

**Final checks:**
- [ ] `npm run build` passes with zero errors
- [ ] No errors in browser console (F12 → Console tab)
- [ ] Nav links scroll to the right sections

---

## STEP 11: Put It Live (~30 min)

### Build it:

```bash
npm run build
```

If no errors, you're ready.

### Deploy to Vercel:

```bash
npx vercel --prod
```

Or just connect your GitHub repo to vercel.com and it'll auto-deploy.

### After deploying, check:
- [ ] The live URL works
- [ ] Hero loads with the 3D sun
- [ ] Scroll story works end to end
- [ ] Looks okay on your phone

---

## TIME BUDGET

If you're short on time, build in this order:

| Priority | Section | Time |
|---|---|---|
| 1 | Hero | 2.5h |
| 2 | Scroll Story | 3.5h |
| 3 | Mission | 1h |
| 4 | Flares | 1.5h |
| 5 | Footer | 30 min |
| 6 | Polish | 1.5h |
| 7 | Deploy | 30 min |
| **Total** | | **~13h** |

You have 2 extra hours as buffer. Use them for fixes only, not new features.

---

**Done.** You've built a cinematic solar flare frontend in a day.
