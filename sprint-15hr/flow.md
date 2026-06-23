# SPRINT FLOW — Aditya-L1 Solar Flares (15-Hour Edition)

> **User journey for our 5-section compressed build.**
> Full 9-section experience in `plan-18day/flow.md`.

---

## 1. OVERALL USER JOURNEY

```
                    ┌─────────────────────────┐
                    │   ENTRY POINT           │
                    └──────────┬──────────────┘
                               │
                               ▼
                    ┌─────────────────────────┐
                    │   HERO                  │ ◄── Cinematic first contact
                    │   "Solar Intelligence   │     Starfield + solar core +
                    │    in Motion"           │     staggered heading
                    └──────────┬──────────────┘
                               │
                    ┌──────────▼──────────────┐
                    │   MISSION OVERVIEW      │ ◄── Context & credibility
                    │   "Watching the Sun,    │     Metrics + reveal
                    │    Uninterrupted"       │
                    └──────────┬──────────────┘
                               │
                    ┌──────────▼──────────────┐
                    │   SOLAR FLARES          │ ◄── Educational core
                    │   Explainer             │     Flare class cards
                    │   (What, How, Classes)  │     + stagger reveal
                    └──────────┬──────────────┘
                               │
                    ┌──────────▼──────────────┐
                    │   SCROLL STORY ★★★      │ ◄── Signature moment
                    │   (Flare Evolution)     │     Cinema-quality
                    │   Quiet → Burst → Data  │     sticky scroll narrative
                    └──────────┬──────────────┘
                               │
                    ┌──────────▼──────────────┐
                    │   CLOSING CTA / FOOTER  │ ◄── Final impression
                    │   "Observe the Sun.     │     Strong exit
                    │    Understand the Storm"│
                    └─────────────────────────┘
```

---

## 2. SECTION-BY-SECTION FLOW

### 2.1 HERO — "Solar Intelligence in Motion"

**Purpose**: First impression. Non-negotiable.

**User Experience**:
1. Page loads into deep space background
2. Starfield drifts slowly (drei `<Stars />`)
3. Solar core pulses at center — shadergradient plasma sphere
4. After 0.5s delay, headline word-staggered reveal:
   - "SOLAR" → slides up (y: 40→0)
   - "INTELLIGENCE" → slides up (+200ms)
   - "IN MOTION" → slides up (+400ms)
5. Sub-headline fades in below
6. CTA button reveals with glow pulse
7. On CTA hover: scale 1.02, glow intensifies

**Exit**: Scroll down → fade transition to Mission

---

### 2.2 MISSION OVERVIEW — Context

**Purpose**: Tell the user what Aditya-L1 is.

**User Experience**:
1. Section enters with fade + y-shift reveal
2. Heading: "Watching the Sun, Uninterrupted"
3. 2-3 paragraph mission explanation
4. Metric chips animate on entry:
   - "Lagrange Point L1"
   - "1.5 Million KM from Earth"
   - "24/7 Solar Observation"
5. Clean, typography-forward layout

**Exit**: Scroll → Flares section

---

### 2.3 SOLAR FLARES EXPLAINER — Science Moment

**Purpose**: Teach solar flare classes with visual cards.

**User Experience**:
1. Slightly warmer section tint
2. Heading: "What is a Solar Flare?"
3. Brief scientific explanation (reveal on scroll)
4. **Flare classification cards** (B, C, M, X, XX):
   - Stagger-reveal on scroll
   - Each card: class label, energy description, color indicator
   - Hover: border glow illuminates (X-class = hottest red)
5. Simple explanatory line or visual below cards

**Exit**: Scroll → Scroll Story

---

### 2.4 SCROLL STORY ★★★ — The Signature Experience

**Purpose**: Cinema-quality narrative where scroll position controls the scene. This is the "wow" section.

**User Experience**:
- Full-viewport sticky section
- As user scrolls through 500vh of content, the scene evolves through 4 acts:

```
Scroll  0%  →  [QUIET SUN]
                 Warm amber glow, calm particles
                 "The Sun, in its quiet state..."

Scroll 25%  →  [ACTIVITY BUILDUP]
                 Surface brightens, arcs begin
                 "Magnetic energy accumulates..."

Scroll 50%  →  [FLARE BURST]
                 Intense flash, expanding ring
                 "A flare erupts — billions of megatons..."

Scroll 75%  →  [OBSERVATION]
                 Spacecraft icon, data lines
                 "Captured by Aditya-L1 in real-time..."
```

**Visual system**:
- All DOM-based (no R3F canvas)
- `useScroll` + `useTransform` drives CSS properties
- Colors shift: amber → white-hot → cool scientific blue
- Text labels fade in/out per act
- Simple geometric spacecraft icon fades in at act 4

**This section alone defines the project's quality.**

---

### 2.5 FOOTER CTA — Final Impression

**Purpose**: End the experience strong.

**User Experience**:
1. Wide section with deep space background
2. Large closing statement
3. CTA button
4. Footer with ISRO credit and project info

---

## 3. SCROLL BEHAVIOR MAP (Today)

```
                    SCROLL DIRECTION
                    ───────────────►

┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  HERO    │───►│ MISSION  │───►│  FLARES  │───►│  SCROLL  │───►│  FOOTER  │
│          │    │          │    │          │    │  STORY   │    │          │
│ fade-out │    │ mask-up  │    │ stagger  │    │ sticky   │    │ fade-in  │
│ scroll-  │    │ reveal   │    │ cards    │    │ canvas   │    │          │
│ driven   │    │          │    │          │    │ 4 acts   │    │          │
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
```

---

## 4. NAVIGATION (Simplified)

| State | Behavior |
|-------|----------|
| Hero top | Transparent navbar |
| Scrolled past hero | Blur backdrop (`bg-black/50 backdrop-blur-xl`) |
| Mobile | Hamburger → sheet overlay |

**Nav items**: `Mission` · `Science` · `Story` · (CTA)

---

## 5. RESPONSIVE BEHAVIOR

| Section | Desktop (≥1024px) | Tablet (768px) | Mobile (<768px) |
|---------|-------------------|----------------|-----------------|
| Hero | Full 3D canvas, stagger text | Canvas smaller | No 3D, text compact |
| Mission | Side-by-side | Stacked | Single column |
| Flares | 5 cards row | 3-2 grid | 1 per row |
| Scroll Story | Full sticky canvas | Smaller visuals | Text-focused, reduced effects |
| Footer | Full width | Full width | Compact |

---

*Full journey with all 9 sections: `plan-18day/flow.md`.*
