# USER FLOW & SITE STRUCTURE — Aditya-L1 Solar Flares

> The full user journey for the build.

---

## 1. JOURNEY MAP

```text
ENTRY
  ↓
HERO
  ↓
MISSION OVERVIEW
  ↓
SOLAR FLARES EXPLAINER
  ↓
SCROLL STORY
  ↓
FOOTER CTA
```

This is a **guided narrative**, not a content dump.

---

## 2. SECTION FLOW

### 2.1 HERO — "Solar Intelligence in Motion"

**Purpose**: Establish visual confidence immediately.

**Sequence**:
1. Dark deep-space background appears
2. Starfield drifts subtly
3. Solar core glows at the center
4. Headline reveals word by word
5. Subheadline fades in
6. CTA appears with glow pulse

**Emotion target**: `awe + curiosity + confidence`

---

### 2.2 MISSION OVERVIEW — "Watching the Sun, Uninterrupted"

**Purpose**: Ground the experience in real science.

**Flow**:
1. Heading reveals on scroll
2. Mission explanation appears in clean paragraphs
3. Metric chips animate in:
   - L1 Point
   - 1.5 Million KM
   - 24/7 Observation

---

### 2.3 SOLAR FLARES EXPLAINER — "What is a Solar Flare?"

**Purpose**: Teach the science simply and elegantly.

**Flow**:
1. Heading reveals
2. Brief explanation appears
3. Flare class cards stagger in:
   - B
   - C
   - M
   - X
   - XX
4. Hover states communicate intensity visually

---

### 2.4 SCROLL STORY — Signature Experience

**Purpose**: Deliver the main interactive payoff.

This section is a sticky full-screen sequence controlled by scroll progress.

#### Act 1 — Quiet Sun
- Calm glow
- Minimal activity
- Text: "The Sun, in its quiet state..."

#### Act 2 — Activity Buildup
- Brightening surface
- Emerging magnetic arcs
- Text: "Magnetic energy accumulates..."

#### Act 3 — Flare Burst
- Sharp flash
- Expanding ring
- Peak visual intensity
- Text: "A flare erupts..."

#### Act 4 — Observation
- Spacecraft icon appears
- Data line connects event to observation
- Text: "Captured by Aditya-L1 in real-time..."

---

### 2.5 FOOTER CTA — Closing Statement

**Purpose**: End strong and clean.

**Flow**:
1. Large closing statement
2. Supporting line
3. CTA button
4. Credits / ISRO acknowledgement

---

## 3. NAVIGATION BEHAVIOR

### Navbar states

| State | Behavior |
|-------|----------|
| Top of hero | Transparent |
| After scroll | Blur backdrop + subtle border |
| Mobile | Hamburger → full overlay sheet |

### Nav items

```text
Mission · Science · Story
```

---

## 4. SCROLL BEHAVIOR MAP

```text
HERO → MISSION → FLARES → SCROLL STORY → FOOTER
```

### Transition style

- Hero → Mission: fade + y shift
- Mission → Flares: standard reveal
- Flares → Story: transition into sticky full-screen sequence
- Story → Footer: calm fade out into closing frame

---

## 5. RESPONSIVE RULES

| Section | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| Hero | Full visual treatment | Slightly reduced canvas | Compact layout, simplified 3D |
| Mission | 2-column feel possible | Stacked | Single column |
| Flares | 5-up grid | 3+2 grid | Single column or 2-up |
| Scroll Story | Full sticky experience | Full sticky experience | Reduced visual intensity, same narrative |
| Footer | Spacious | Spacious | Compact |

---

## 6. EXPERIENCE PRINCIPLES

1. Every section should have a clear purpose
2. Motion should support meaning
3. The user should never feel lost
4. Visual drama should peak in the scroll story
5. The footer should feel like a deliberate ending

---

*This flow should feel like turning pages in a cinematic science story.*
