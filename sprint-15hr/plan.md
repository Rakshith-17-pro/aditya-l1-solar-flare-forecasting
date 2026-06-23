# SPRINT PLAN — Aditya-L1 Solar Flares (15-Hour Edition)

> **"Solar Intelligence in Motion"**
> Compressed from the 18-day vision in `plan-18day/plan.md`. This file keeps the creative north star while scoping only what we build today.

---

## 1. EXECUTIVE VISION (Unchanged from 18-day)

Build a **high-end, motion-first, visually immersive scientific storytelling frontend** for the Aditya-L1 mission and solar flare topic that carries the **visual confidence of animejs.com** fused with the **gravitas of ISRO's space-science identity**.

### What This Is

| ❌ Not This | ✅ This Is (15h scope) |
|------------|----------------------|
| A full 9-section site | A **5-section cinematic landing page** |
| A data dashboard with live telemetry | A **scroll-driven narrative demo** |
| A comprehensive gallery | A focused **educational experience** with hero + scroll story |
| Anime.js + Motion dual engine | **Motion for React only** — faster to build |

---

## 2. CREATIVE THESIS (Unchanged)

| animejs.com Quality | → Aditya-L1 Translation |
|---------------------|------------------------|
| Massive visual confidence | Premium dark UI with solar-energy-driven identity |
| Dark premium layout | Deep space black + plasma accents |
| Strong typography hierarchy | Bold display type + technical UI type |
| Section choreography | Scroll-driven scene sequencing |
| Motion as structure, not decoration | Motion explains content hierarchy |
| Interactive polish | Engineered hover states, not random floaters |

### Emotional Palette

```
PRECISION ────────────────────────────── WONDER
      ↑                                    ↑
  ISRO engineering          Solar phenomenon
  Clean UI                  Cinematic awe
  Technical credibility     Visual immersion
```

---

## 3. COLOR SYSTEM (Unchanged — fully defined)

```
Deep Black:      #05070B   →  Backgrounds
Space Navy:      #0A1020   →  Section alternates
Charcoal:        #111827   →  Elevated surfaces

Plasma Orange:   #FF7A00   →  Primary accent, hero glow
Flare Gold:      #FFB347   →  Secondary accent
Eruption Red:    #FF4D36   →  Flare burst indicators
Corona Amber:    #FFC857   →  Warmth layer

Instrument Cyan: #55D6FF   →  Data visualization
Telemetry Blue:  #4EA8DE   →  UI accents
Signal Violet:   #8B5CF6   →  Rare emphasis (< 5%)
```

**Distribution**: 80% neutrals · 15% solar tones · 5% cool scientific

---

## 4. TYPOGRAPHY SYSTEM (Unchanged)

| Role | Font | Spec |
|------|------|------|
| Display | **Space Grotesk** | Hero: `clamp(3.5rem, 8vw, 8rem)` · Section: `clamp(2rem, 4vw, 4.5rem)` |
| Body | **Inter** | 1rem / 1.6 line-height |
| Monospace | **JetBrains Mono** | Data values: 0.875–1rem |

---

## 5. SECTIONS WE BUILD TODAY

| # | Section | Original in 18-day | Why it made the cut |
|---|---------|-------------------|-------------------|
| 1 | **Hero** | plan.md §8 Content Checklist | First impression. Non-negotiable. |
| 2 | **Mission Overview** | plan.md §8 | Establishes scientific credibility |
| 3 | **Solar Flares Explainer** | plan.md §8 | Educational core, visual flair |
| 4 | **Scroll Story (4 acts)** | flow.md §2.6 | The "wow" section. Signature moment. |
| 5 | **Footer CTA** | flow.md §2.9 | Strong exit |

### Deferred to Phase 2 (per full 18-day plan)

- Payloads Grid
- Telemetry Dashboard
- Observatory Gallery
- Detailed Timeline
- Anime.js choreography

---

## 6. DEFINITION OF SUCCESS (Today)

By tomorrow evening:

- [ ] Hero loads with animated solar visual + staggered heading + CTA
- [ ] Scroll story transitions smoothly through all 4 acts
- [ ] Mission and Flares sections have scroll-reveal animations
- [ ] Page is responsive at 375px, 768px, 1024px, 1440px
- [ ] `prefers-reduced-motion` disables animations gracefully
- [ ] No console errors, TypeScript compiles clean
- [ ] Deployed to Vercel with a live URL

---

*Full long-term vision lives in `plan-18day/plan.md`. This sprint executes the highest-impact subset.*
