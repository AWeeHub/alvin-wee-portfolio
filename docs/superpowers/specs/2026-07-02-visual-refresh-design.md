# Visual Refresh — Design Spec

Addresses five design requests against the live site
(`https://ghl-specialist-portfolio.vercel.app/`): generic-feeling typography,
no scroll-triggered motion, a flat/static background, an oversized Matisse
Academy flow screenshot, and a wrong thumbnail image for the AVNM Caffè case
study.

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
5. Replace the AVNM Caffè case-study thumbnail (`public/work/avnm-caffe.jpg`)
   — currently a product close-up (iced coffee + cake on a tray) — with a
   screenshot of the actual AVNM Caffè landing page's hero section, matching
   how every other case study (VOLTLINE, IronHaul, Tricia) already uses a
   site screenshot, not a product photo, as its thumbnail.

## Non-goals

- No copy rewrites to Problem/Solution/Services/Process/Contact — reveal
  wrapper only adds motion, not new content.
- No changes to `CaseStudyCard.tsx` grid layout or the four non-Matisse case
  studies' data.
- No new avatar art, no changes to `usePainPointRotator` rotation logic.
- **No changes to `Hero.tsx` or this site's own hero layout** — item 5 above
  was originally scoped as a `Hero.tsx` restructure in an earlier draft of
  this spec; the user clarified they meant the AVNM *case-study thumbnail
  image itself* was wrong (product photo instead of a site screenshot), not
  this site's hero section. `Hero.tsx` is unchanged by this spec.
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
- `public/work/avnm-caffe.jpg` — asset replaced (below), no component code
  changes needed since `CaseStudyCard.tsx` already just renders
  `study.images[0]`.

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

## AVNM thumbnail fix detail

`public/work/avnm-caffe.jpg` is replaced in place (same filename, same
`images: ['/work/avnm-caffe.jpg']` reference in `caseStudies.ts` — zero
component code changes) with a screenshot of `https://avnm-caffe.vercel.app`'s
hero section: the "EXTRAORDINARY HOT AND BRIGHT" headline over the dark
cinematic backdrop with the iced-coffee product shot, captured via headless
Chrome (`--window-size=1400,900 --virtual-time-budget=3000`, same method
documented for this repo's sibling project) so the site's own GSAP/entrance
animation has settled before capture. `CaseStudyCard.tsx` needs no changes —
it already renders `study.images[0]` at `aspect-video object-cover
object-top`, so the new 1400×900 screenshot crops the same way the other
three site-screenshot thumbnails already do.

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
5. Confirm the AVNM Caffè card in the CaseStudies grid now shows its actual
   landing-page hero (headline + product shot on dark backdrop), not the
   old tray/product close-up photo.
6. Emulate `prefers-reduced-motion: reduce` — confirm backdrop particles
   stop, section reveals show content instantly (no stagger), and the hero
   pain-point transition either stops or degrades gracefully.
7. Resize to mobile (~375px), tablet (~768px), desktop (~1440px) — confirm
   no layout breakage from the backdrop, `Reveal` wrapper, or Matisse's
   capped image height.
8. `npm run build` succeeds (TypeScript + Vite, no new type errors).
9. `npm run test` (Vitest) still passes — this task touches no files under
   test today (`caseStudies.ts` data itself is unchanged, only rendering
   components change), so no test updates are expected, but confirm nothing
   broke incidentally.
