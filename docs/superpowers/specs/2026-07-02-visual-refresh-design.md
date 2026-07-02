# Visual Refresh — Design Spec

Addresses five design requests against the live site
(`https://ghl-specialist-portfolio.vercel.app/`): generic-feeling typography,
no scroll-triggered motion, a flat/static background, an oversized Matisse
Academy flow screenshot, and promoting the AVNM Caffè case study into the
hero.

## Context

`ghl-specialist-portfolio` (`C:\Users\Alvin\OneDrive\Desktop\Alvin Wee
Portfolio\ghl-specialist-portfolio`) is a React 18 + TypeScript + Vite +
Tailwind site, distinct from the user's other personal-brand portfolio
(`awee-digital-portfolio`). GSAP + `ScrollTrigger` + Lenis are already
installed and wired for smooth scroll (`src/lib/scroll.ts`,
`useSmoothScroll()` called from `App.tsx`) — no scroll-reveal layer exists
yet, and no cinematic backdrop exists. Section order in `src/App.tsx`: Hero →
Problem → Solution → Services → CaseStudies → Process → Contact → Footer.

Current theme: `bg #05070A`, `accent #39FF8A` (green), fonts `Instrument
Serif` (display), `Bricolage Grotesque` (sans/body), `JetBrains Mono` (mono
labels), declared in `tailwind.config.js` and loaded via Google Fonts in
`index.html`.

## Goals

1. Swap the display/headline font from `Instrument Serif` to `Fraunces`
   (variable, higher-contrast, more editorial weight) — body (`Bricolage
   Grotesque`) and mono (`JetBrains Mono`) stay as-is.
2. A reusable scroll-triggered reveal wrapper (`Reveal`) — staggered fades on
   each section's children as they enter the viewport — applied to Problem,
   Solution, Services, CaseStudies, Process, and Contact. Hero is excluded
   (mount-time reveal already exists via the pain-point rotator).
3. A fixed cinematic backdrop (canvas particle field + soft green radial
   fog) visible behind every section, `prefers-reduced-motion`-safe.
4. Fix `MatisseFlow.tsx`'s unconstrained screenshot sizing so tall GHL
   screenshots no longer blow out the container.
5. Restructure `Hero.tsx` into a two-column layout: pain-point
   headline/subhead/avatar on the left (unchanged), AVNM Caffè's screenshot
   as a glowing visual anchor on the right.

## Non-goals

- No copy rewrites to Problem/Solution/Services/Process/Contact — reveal
  wrapper only adds motion, not new content.
- No changes to `CaseStudyCard.tsx` grid layout or the four non-Matisse case
  studies' data.
- No new avatar art, no changes to `usePainPointRotator` rotation logic.
- No test-framework changes (this repo has Vitest already; new visual/motion
  code follows the same `npm run build` + manual browser check convention as
  the sibling project, since canvas/GSAP entrance timing isn't meaningfully
  unit-testable).

## Architecture

### New dependencies

None — `gsap`, `lenis` already in `package.json`. Fraunces is loaded via the
existing Google Fonts `<link>` in `index.html` (add family, no new
mechanism).

### New files

- `src/components/Reveal.tsx` — wrapper taking `children` and an optional
  `stagger` prop (default `0.08`), renders a `<div>` whose direct children
  are registered as GSAP `ScrollTrigger` fade+translateY targets
  (`gsap.context()` scoped to its own ref, `start: 'top 80%'`,
  `toggleActions: 'play none none none'`, reverted on unmount). Mirrors the
  `CinematicSection`/stagger pattern already speced for `awee-digital-portfolio`
  (`docs/superpowers/specs/2026-07-01-cinematic-foundation-design.md` there),
  adapted to animate a section's *children* individually (stagger) rather
  than the section as one block, since these sections are copy/card-heavy
  and benefit more from a staggered reveal than a single scale-in.
- `src/components/CinematicBackdrop.tsx` — fixed, full-viewport,
  `pointer-events-none`, `z-0` layer: canvas particle field (~40 sparse green
  dots, slow drift, capped via `requestAnimationFrame`, paused on
  `visibilitychange`, resized debounced) + a soft radial fog gradient using
  the existing `accent` green. Skipped entirely under
  `prefers-reduced-motion: reduce`. Same implementation shape as the sibling
  project's `CinematicBackdrop` (already validated there), recolored to this
  repo's `#39FF8A` accent instead of `#00FF88`.

### Modified files

- `index.html` — add `Fraunces` to the Google Fonts `<link>` family list.
- `tailwind.config.js` — `fontFamily.display` → `['Fraunces', 'Georgia',
  'serif']`.
- `src/App.tsx` — mount `<CinematicBackdrop />` once, above `<Hero />`.
- `src/components/ProblemSection.tsx`, `SolutionSection.tsx`,
  `ServicesGrid.tsx`, `ProcessSection.tsx`, `ContactSection.tsx` — wrap
  existing JSX in `<Reveal>`, no content changes. `CaseStudiesSection.tsx`
  wraps its heading + the `MatisseFlow`/grid blocks as separate reveal
  groups (already two visually distinct blocks).
- `src/components/CaseStudies/MatisseFlow.tsx` — image sizing fix (below).
- `src/components/Hero.tsx` — two-column restructure (below).

## Reveal detail

Same integration shape as `CinematicSection` in the sibling project: a
`ref`-scoped `useLayoutEffect` creates one GSAP context per mount, targets
`el.children` via `gsap.utils.toArray`, and tears down via `ctx.revert()`.
Animates `opacity` + `y: 24 → 0` with `stagger: 0.08`, `duration: 0.7`,
`ease: 'power3.out'`. Under `prefers-reduced-motion: reduce`, sets children
to their resting state immediately (no listener, no animation) rather than
skipping the wrapper — content is never hidden.

## Cinematic backdrop detail

Identical particle/fog approach already proven in the sibling project's
Phase 1 plan: canvas-based dot field (`PARTICLE_COUNT = 40`, radius
0.4–1.8px, alpha 0.1–0.5, velocity ±0.08px/frame, wraps at viewport edges)
plus a CSS radial-gradient fog (`rgba(57,255,138,0.08)` — this repo's accent
— centered ~30% down the viewport). Mounted once in `App.tsx` above `<Hero
/>` so it sits behind all sections including the hero. Existing section
backgrounds (`bg-bg` / `bg-bg-elev` solid fills on Problem/Solution/Services/
etc.) are **kept as-is** in this pass — unlike the sibling project, these
sections don't currently paint a redundant full-opacity color that would
fully occlude the backdrop everywhere except the hero (Hero's background is
already `bg-bg` with no opaque wrapper beyond that, and the backdrop shows
through the same way `bg-bg`'s color already reads as this site's black).
If after implementation the backdrop isn't visibly reading through the
`bg-bg-elev` sections, drop those sections' background classes to
transparent as a follow-up — call this out explicitly in the verification
step rather than guessing now.

## Matisse image fix detail

`MatisseFlow.tsx:36-45` currently renders the active flow screenshot at
`w-full object-contain` with no height constraint, so a screenshot taller
than it is wide expands the whole card. Fix: wrap in a fixed-height
letterbox — `max-h-[520px]` (mobile: `max-h-[360px]`) container with
`bg-black/40` and `object-contain` (unchanged) so the full screenshot always
stays visible, just capped and centered rather than blowing out card
height. No cropping, since these are read-for-content GHL workflow
screenshots where losing part of the image would defeat the purpose of the
flow-step viewer.

## Hero detail

Restructures the current single-column centered `Hero` into a `md:grid
md:grid-cols-12` two-column layout:

- **Left (`md:col-span-7`):** existing eyebrow (`GoHighLevel Systems
  Builder`), the rotating pain-point `<h1>`, existing avatar, subhead, and
  `HeroNavPills` — all unchanged content, just re-flowed into the left
  column instead of centered full-width. `HeroNameBackdrop` (the giant
  faint "ALVIN WEE" watermark) stays full-bleed behind both columns.
- **Right (`md:col-span-5`):** new visual block — `/work/avnm-caffe.jpg`
  in a rounded, bordered frame (reusing the same browser-chrome-dot header
  treatment `CaseStudyCard` already uses, for visual consistency) with a
  soft green glow (`blur-3xl` radial gradient behind it, same technique as
  the sibling project's hero avatar glow) and a small caption chip ("Live
  client project — AVNM Caffè") linking to `study.liveUrl`.
- Below `md:` breakpoint, right column stacks under the left column (image
  still shown, not hidden) — mobile users still see the proof visual, just
  after the headline instead of beside it.
- No changes to `usePainPointRotator` timing/logic or to `HeroNameBackdrop`.

## Performance & accessibility

- Canvas particle count capped at 40, paused via `visibilitychange`, resize
  debounced 200ms — matches the sibling project's already-validated budget.
- `prefers-reduced-motion: reduce` disables: backdrop particle animation
  (fog gradient stays, it's static CSS), all `Reveal` stagger animations
  (children render at rest immediately), and is already respected by the
  existing pain-point rotator's `animate-fade-up` (CSS animation — verify
  Tailwind's `animate-fade-up` keyframe itself isn't already
  reduced-motion-aware; if not, gate it the same way in this pass since it's
  adjacent to this work).
- All new listeners (resize, visibilitychange) cleaned up on unmount.
- Hero's new right-column image uses `loading="eager"` (above the fold,
  unlike the lazy-loaded case-study grid images) with explicit `width`/
  `height` or `aspect-video` to avoid layout shift.

## Verification plan

Run the dev server and drive it in-browser (not just type-check):

1. Confirm `Fraunces` renders on every `<h1>/<h2>/<h3>` (headline weight
   visibly heavier/more editorial than before) across Hero, Problem,
   Solution, Services, CaseStudies, Process, Contact.
2. Scroll from top to bottom — confirm each wrapped section's children
   stagger-fade in once as they cross ~80% viewport, not on every
   scroll-up/down re-cross.
3. Confirm a faint drifting green particle field + fog is visible behind at
   least the Hero and one `bg-bg-elev` section (Solution or CaseStudies) —
   if not visible behind `bg-bg-elev` sections, note it per the flagged
   follow-up above rather than treating it as done.
4. Open the Matisse Academy flow card, click through several steps
   (especially tall ones) — confirm no step's screenshot expands the card
   beyond the capped height, and nothing is cropped (full screenshot visible,
   letterboxed if needed).
5. Confirm the Hero now shows the AVNM Caffè screenshot in a right-hand
   panel (desktop) or stacked below the headline (mobile), with a visible
   green glow and a working link to `https://avnm-caffe.vercel.app`.
6. Emulate `prefers-reduced-motion: reduce` — confirm backdrop particles
   stop, section reveals show content instantly (no stagger), and the hero
   pain-point transition either stops or degrades gracefully.
7. Resize to mobile (~375px), tablet (~768px), desktop (~1440px) — confirm
   no layout breakage from the backdrop, `Reveal` wrapper, Hero's new grid,
   or Matisse's capped image height.
8. `npm run build` succeeds (TypeScript + Vite, no new type errors).
9. `npm run test` (Vitest) still passes — this task touches no files under
   test today (`caseStudies.ts` data itself is unchanged, only rendering
   components change), so no test updates are expected, but confirm nothing
   broke incidentally.
