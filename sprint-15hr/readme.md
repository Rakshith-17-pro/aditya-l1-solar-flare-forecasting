# 📖 How to Use These 5 Files (With an AI)

## What This Is

You're holding a **complete build plan for an Aditya-L1 solar flares frontend**—a cinematic, motion-first website that tells the story of India's solar mission. These 5 files contain everything an AI needs to generate the full project.

---

## The 5 Files at a Glance

| # | File | What It Tells the AI |
|---|---|---|
| 1 | `plan.md` | **Why** we're building this. Executive vision, creative direction, colors, fonts, success criteria. |
| 2 | `frontend-architecture.md` | **How** it's built. Tech stack (Next.js, Motion, Three.js), project folder structure, component tree, performance rules. |
| 3 | `flow.md` | **What the user experiences.** Section-by-section scroll behavior, animations triggered at every step, responsive rules. |
| 4 | `motion-system.md` | **The animation engine.** Duration tokens, easing curves, stagger timings, scroll story specs, reduced-motion rules. |
| 5 | `procedure.md` | **Do this, in order.** Copy-paste-ready code for every single component, step by step. 11 steps, ~13 hours of build time. |

---

## How to Feed Them to an AI

### Option A: All at Once (Best Results)

Feed all 5 files in a **single message** to the AI in this exact order:

```
1. plan.md
2. frontend-architecture.md
3. flow.md
4. motion-system.md
5. procedure.md
```

Then say:

> *"Build this project. Start with Step 1 from procedure.md and go through every step in order. Create all the files."*

The AI will have context from `plan.md` (vision), `frontend-architecture.md` (structure), `flow.md` (UX), `motion-system.md` (animation specs), and `procedure.md` (exact code) — so it won't guess or fill gaps.

### Option B: One at a Time (If AI Has Context Limits)

| Round | File to Send | Prompt |
|---|---|---|
| 1 | `plan.md` | "Here's the project vision. What's your understanding of what we're building?" |
| 2 | `frontend-architecture.md` | "Here's the tech stack and folder structure. Scaffold the project and create the folder tree." |
| 3 | `procedure.md` Steps 1–3 | "Create the Next.js project, set up Tailwind, fonts, globals.css, constants, navbar, layout." |
| 4 | `procedure.md` Step 4 | "Build the Hero section with 3D solar core, starfield, animated heading, glow button." |
| 5 | `procedure.md` Step 5–6 | "Build the Mission section and Flares explainer section." |
| 6 | `procedure.md` Step 7 | "Build the Scroll Story — 4 acts, 500vh, sticky frame, scroll-driven transforms." |
| 7 | `procedure.md` Step 8–11 | "Build the Footer, wire up page.tsx, run QA checklist, deploy to Vercel." |

---

## How the 5 Files Relate to Each Other

```
                    ┌─────────────────┐
                    │    plan.md       │  ← The "why" (vision, colors, fonts)
                    └────────┬────────┘
                             │ informs
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
    ┌─────────────────┐ ┌───────────┐ ┌───────────────┐
    │ frontend-       │ │ flow.md   │ │ motion-       │
    │ architecture.md │ │           │ │ system.md     │
    │                 │ │ UX spec:  │ │               │
    │ Stack, files,   │ │ what user │ │ Animation     │
    │ component tree  │ │ sees when │ │ tokens,       │
    │ performance     │ │ scrolling │ │ easings,      │
    └────────┬────────┘ └─────┬─────┘ │ specs         │
             │                │       └───────┬───────┘
             └────────────────┼───────────────┘
                              ▼
                    ┌─────────────────┐
                    │  procedure.md   │  ← The "do this" — code for everything
                    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  Final Website  │
                    └─────────────────┘
```

---

## Quick Reference: What Each File Covers

### `plan.md` (232 lines)
- Executive vision and creative direction
- Color palette (base, solar, scientific accent)
- Typography system (Space Grotesk, Inter, JetBrains Mono)
- 5-section build scope with time estimates
- Definition of success checklist
- Content standards and tone guidelines

### `frontend-architecture.md` (335 lines)
- Technology stack table with versions
- Scaffolding commands (copy-paste)
- 4 Architecture Decision Records (Motion over anime.js, static content, lazy-loaded 3D, DOM scroll story)
- Full project folder tree (every file path)
- Component tree showing parent-child nesting
- Data model — all TypeScript constants
- Performance budget (FCP < 1.5s, LCP < 2.5s)
- Quality gates checklist

### `flow.md` (311 lines)
- Journey overview with emotional arc diagram
- Per-section scroll sequence (timing of every element)
- Flare card hover behavior spec
- Scroll story act progression (4 acts × visual states)
- Navigation behavior (transparent → blurred, mobile sheet)
- Responsive behavior matrix for all 5 sections at 3 breakpoints
- Experience principles

### `motion-system.md` (498 lines)
- 4 Laws of Motion philosophy
- Complete animation token system (6 durations, 4 easings, 4 staggers)
- Per-section animation specs with exact values
- Scroll story visual property mappings (every useTransform)
- Reduced motion behavior mapping (normal → alternative)
- 7 performance rules
- 5 reusable motion component specs
- 3 implementation patterns with full code

### `procedure.md` (960 lines)
- 11 steps in strict order (Step 1 → Step 2 → ... → Step 11)
- Every file has complete, copy-paste-ready TypeScript code
- "Check" points after each step so you know it worked
- QA checklist (responsive, animations, reduced motion, build)
- Deploy instructions for Vercel
- Time budget table with priority order

---

## Pro Tips for AI Results

1. **Be explicit about scope.** Remind the AI: "Build exactly what's in procedure.md. 5 sections only. No extra features."
2. **Check `prefers-reduced-motion`.** The AI might skip this. Remind it to add `useReducedMotion()` from `motion/react` and show static fallbacks.
3. **Watch for lazy-loading.** The 3D hero components (`SceneWrapper`, `Starfield`, `SolarCore`) must use `dynamic(() => import('…'), { ssr: false })`. If the AI forgets, remind it.
4. **Use the right Motion import.** The import path changed in newer versions: `import { motion } from 'motion/react'` not `'framer-motion'`. Correct the AI if it uses the old import.
5. **Request a checklist at the end.** Ask the AI to run through the QA checklist in Step 10 of procedure.md after it finishes.

---

## Troubleshooting

| AI Does This... | Fix |
|---|---|
| Creates extra pages or routes | "Only build `page.tsx` — one page, one main route." |
| Adds anime.js or framer-motion | "Use `motion/react` only. No other animation libraries." |
| Creates complex 3D for scroll story | "Scroll story uses DOM + Motion transforms only. No R3F in the scroll story." |
| Skips responsive testing | "Show me the section layouts at 375px, 768px, and 1440px." |
| Doesn't handle reduced motion | "Add `useReducedMotion()` to every component with entrance animations." |
| Build fails | "Check `npm run build`. Fix any TypeScript errors or missing imports." |

---

## Quick Start (Copy-Paste This)

Feed all 5 files to an AI, then paste this prompt:

> *"You have the full build plan for an Aditya-L1 solar flares frontend. Follow `procedure.md` step by step. Create every file it lists. Start with Step 1 (project scaffolding), go through all 11 steps in order. After every step, verify it works. At the end, run the QA checklist from Step 10 and deploy to Vercel per Step 11. Do NOT add anything beyond the 5 specified sections. Use `motion/react` (not framer-motion). Lazy-load all 3D components. Respect `prefers-reduced-motion`."*
