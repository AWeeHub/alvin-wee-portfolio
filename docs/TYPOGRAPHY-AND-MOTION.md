# Typography, effects and animation — AWee Digital portfolio

Everything the site does visually, and why. Values here are the ones in the code, not
approximations.

---

# Part 1 — Typography

Three families, each with one job. The identity comes from the contrast between them and from
weight, not from decoration.

| Role | Family | Weights used | Where it appears |
|---|---|---|---|
| **Brand / display face** | **Saira Variable** | 300–700 (variable) | Logo wordmark, hero `h1`, every section `h2`, Condition + Stack row titles, and all chrome labels (nav, eyebrows, captions, counters, the status bar) |
| **Display / impact** | **Archivo Variable** | up to **900** | The hero promise line (*I build the system that fixes it.*), the big full-bleed section bands, case-study titles |
| **Body** | **Poppins** | 300, 400, 500 | Hero subline, section sublines, row descriptions, the About paragraphs, button labels |

All three are **self-hosted via `@fontsource`** — no Google Fonts request, no third-party
connection at runtime.

```ts
// src/main.tsx
import '@fontsource-variable/archivo';
import '@fontsource-variable/saira';
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
```

They are exposed through Tailwind as four tokens (`logo` and `mono` deliberately resolve to the
same brand face — `mono` is the label layer, not a monospace):

```js
// tailwind.config.js
fontFamily: {
  sans:    ['Poppins', 'Archivo Variable', 'system-ui', 'sans-serif'],
  display: ['Archivo Variable', 'Inter', 'system-ui', 'sans-serif'],
  mono:    ['Saira Variable', 'Archivo Variable', 'system-ui', 'sans-serif'],
  logo:    ['Saira Variable', 'Archivo Variable', 'system-ui', 'sans-serif'],
}
```

### Why Saira, and the Eurostile story

The brand face was chosen to match the squared, technical lettering in the AWee Digital logo
artwork — which is **Eurostile**. Eurostile is a **licensed commercial typeface** (Linotype/URW)
and must not be self-hosted from a free-font site, so the site uses a stand-in.

- **Michroma** was tried first and rejected: it is the *extended* cut, so it read as stretched at
  title size, forced the hero facts onto two rows, wrapped the mobile nav, and had no weight axis.
- **Saira Variable** is square at normal width and, being variable, carries weights — which the
  headings need, because the accent word jumps to 900 against the rest of the line.

### The fluid type scale

There are no `text-xl sm:text-2xl md:text-3xl` ladders. Nine steps interpolate continuously
between a **375px phone** and a **2560px monitor**. The `vw` coefficients are derived —
`slope = (max − min) / (2560 − 375)`, with the `rem` term as the intercept — not eyeballed.

```css
/* src/index.css */
--step--2:   clamp(0.625rem,  0.582rem + 0.183vw, 0.875rem);   /* 10 → 14px  chrome labels */
--step--1:   clamp(0.75rem,   0.696rem + 0.229vw, 1.0625rem);  /* 12 → 17px */
--step-0:    clamp(0.9375rem, 0.873rem + 0.275vw, 1.3125rem);  /* 15 → 21px  body */
--step-1:    clamp(1.0625rem, 0.966rem + 0.412vw, 1.625rem);   /* 17 → 26px  sublines */
--step-2:    clamp(1.25rem,   0.993rem + 1.098vw, 2.75rem);    /* 20 → 44px  row titles */
--step-3:    clamp(1.5rem,    1.157rem + 1.464vw, 3.5rem);     /* 24 → 56px  card titles */
--step-4:    clamp(2.125rem,  1.546rem + 2.471vw, 5.5rem);     /* 34 → 88px  section headings */
--step-5:    clamp(2.5rem,    1.728rem + 3.295vw, 7rem);       /* 40 → 112px hero promise */
--step-pain: clamp(1.375rem,  1.053rem + 1.373vw, 3.25rem);    /* 22 → 52px  hero pain point */
```

Used as `text-label`, `text-micro`, `text-body`, `text-lead`, `text-row`, `text-card`,
`text-section`, `text-hero`, `text-pain`. Spacing (`--space-2xs` … `--space-2xl`), the page gutter
(`--gutter`, 20 → 64px) and the two content shells (`--shell` 108rem, `--shell-text` 72rem) are
built the same way.

The big section bands sit outside the scale on purpose: they are `13vw`, pure viewport, because
they are meant to run off both edges at every width. The hero's ghosted name backdrop is `12vw`.

---

# Part 2 — Motion and effects

## The two standing rules

1. **Transform and opacity only.** Nothing animates `width`, `height`, `top`, `left` or `margin`.
   The case-study progress bar is a `scaleX`, the row underline is a `scaleX`, the preloader bar is
   a `scaleX`. This keeps every animation on the compositor and keeps layouts stable under zoom.
2. **Position-derived, never accumulated.** Scroll animations compute their state from where the
   element *is*, so scrolling up is an exact inverse of scrolling down and nothing drifts.

**`prefers-reduced-motion: reduce` is honoured by every single effect below** — canvases don't
start, marquees stop, reveals resolve to their final state, hover sweeps become instant.

---

## Scroll engine

**Lenis** (`duration: 1.1`, `smoothWheel: true`) drives smooth scrolling, wired into the **GSAP
ticker** with `lagSmoothing(0)`, and calls `ScrollTrigger.update()` on every scroll event.

One subtlety: `ScrollTrigger` caches each trigger's start/end as absolute offsets, but the page
keeps growing after that (screenshots and logos load, fonts swap). A `ResizeObserver` on `<body>`
watches `scrollHeight` and coalesces a burst of image loads into a **single `ScrollTrigger.refresh()`**
on the next frame. Without it, reveals near the bottom of the page decide they've been scrolled
past and hide themselves again.

---

## Entrance

**Preloader** — GSAP timeline. A counter tweens `0 → 100` (`duration: 1.5`, `ease: power2.inOut`)
while a progress rule tracks it as `scaleX`. The overlay then leaves on `yPercent: -100`
(`duration: 0.9`, `ease: power4.inOut`). It gates the hero: `onComplete` flips `introReady`, and
only then does the hero play its entrance — so the two never overlap.

**MaskedText** — the headline reveal. Text is split into words, each wrapped in an
`overflow-hidden` mask; the inner span starts at `translateY(115%)` and slides to `0` on
`transform 0.9s cubic-bezier(0.19, 1, 0.22, 1)`, with a **45ms stagger per word** via a
`--mask-delay` custom property. Mask padding (`pb-[0.14em] -mb-[0.14em]`) keeps descenders from
clipping at rest.

**Reveal** — a generic ScrollTrigger wrapper: children fade and rise (`opacity 0→1`, `y 24→0`) with
a default `0.08s` stagger, and can be held paused until the preloader hands off.

---

## The section bands (the big text)

Full-bleed, `13vw`, one filled word per repeat and the rest hollow with a `2px` accent stroke —
modelled on the reference site's ABOUT ME band.

The motion is **entirely scroll-driven**: no idle drift. Travel is derived from the band's position
on screen, not accumulated:

```ts
const TRAVEL_PER_PX = 1.34;  // measured off the reference's ABOUT ME band
const ANCHOR_VH = 0.85;      // below this line the band is held at zero offset,
                             // so the phrase reads whole before it starts to slide

const risen  = window.innerHeight * ANCHOR_VH - track.getBoundingClientRect().top;
let   offset = Math.max(0, risen) * TRAVEL_PER_PX;
offset %= groupWidth;        // two identical groups, so the wrap is seamless
track.style.transform = `translate3d(${-offset}px, 0, 0)`;
```

Because the offset is a function of position, scrolling back up runs the words back exactly the way
they came.

## The company logo marquee

A **pure CSS keyframe loop** (`logoMarquee`, `42s linear infinite`), translating by
`var(--marquee-shift)` — a *percentage*, so the loop stays seamless at any width or zoom. The copy
count is **measured, not assumed**: a `ResizeObserver` compares the lane width to the viewport and
renders `ceil(viewport / lane) + 1` copies, so the band never shows a gap on an ultrawide. Pauses on
hover. Under reduced motion the animation stops and the strip becomes hand-scrollable.

---

## Hover gestures

**Condition + Stack rows** (`.cost-row`, shared — the two lists are deliberately the same gesture):

- the title takes the accent colour and slides `translate-x-2`,
- a rule sweeps in beneath it — `transform: scaleX(0 → 1)`, origin left, `0.6s cubic-bezier(0.19, 1, 0.22, 1)`,
- the sentence brightens **word by word from the left**, each word on a `22ms` delay, from `opacity 0.5` to `1`. The 0.5 floor is a contrast floor, not a style choice: an unlit row is still a row someone may be reading. On touch (`@media (hover: none)`) every word is lit, because there is no cursor to pass over it.

**Custom cursor** — a ring that lerps toward the pointer (`0.2` per frame) and scales by target:
`1` base, `1.5` on links, `2.6` on `[data-cursor="view"]`. The native cursor is hidden while it's
active.

**Tilt** — `perspective(900px)` + `rotateX/rotateY` from the pointer's normalised position within
the card, `transition-transform 300ms ease-out`.

**Magnetic** — buttons translate toward the cursor within a radius and spring back on leave.

**Tool deck** (About) — eight cards overlap in one direction; the card under the cursor lifts
(`translateY(-14px)`, `zIndex` to the top) and the cards after it step aside by `32px`. Pure
`translate3d` — nothing reflows. The card width and overlap are **derived from the deck's measured
width** (`ResizeObserver`), so the fan fills the column at any viewport instead of stranding itself
in the left third of a 2560px screen.

---

## Scroll-driven storytelling

**Stack (ServicesGrid)** — a sticky panel is held while a tall track scrolls past it; the track's
progress deals the five rows out one at a time (each row owns an overlapping slice, eased with
`t*t*(3-2t)` smoothstep, `opacity` + `translateY(28px)`). Driving from progress rather than one-shot
triggers is what lets the list rewind cleanly on the way back up.

**About** — the same pin, with the portrait held still while the copy beside it lights **paragraph
by paragraph, word by word** (`ScrollHighlightText`: each word's window overlaps its neighbours so
the light sweeps rather than snapping; `DIM = 0.5` is the same contrast floor).

The panel is centred in the viewport while pinned, and the heading above and toolkit below spend
that air back — but the air is `(viewport − panel) / 2` and the panel gets taller as the column
narrows and the copy wraps, so **the offsets are measured at runtime with a `ResizeObserver`**, not
hard-coded. Fixed px and `vh` values were both tried and both collided on some screen. Gaps now hold
at 60px (heading) and 70px (toolkit) at every viewport from 1280×700 to 2560×1440.

**Featured work — the twelve-stage flow** — a numbered rail with a connector line that lights as far
as you've advanced. Selecting a stage swaps a screenshot inside a window frame (chrome bar, stage
name, `01 / 12` counter, prev/next, and a `scaleX` progress rule). Neighbouring stages are preloaded
so the swap never shows a blank frame; arrow keys work. The screen is capped to the story column's
measured height, because the screenshots are portrait (0.54–0.74) and a landscape frame left two
thirds of itself empty.

---

## Generative / canvas layers

All decorative, all with DOM fallbacks — nothing is reachable only through a canvas.

**Dither portrait** — the photos are rendered through an **ordered-dither (Bayer 8×8)** to a
150×150 2D canvas and upscaled with `image-rendering: pixelated`. Roughly 7% of pixels carry a
**green glint** (`#39FF8A`) that pulses on a sine (`rate 2.4`), and only on the brightest levels —
so the portrait sparkles rather than glowing.

**Hero shader** — a WebGL2 fragment shader drawing a warped accent grid behind the hero. It probes
for `webgl2` first and falls back to a CSS radial-masked grid if it isn't there (or if reduced
motion is on). Pauses when off-screen; survives context loss.

**Pipeline slider** (web builds) — a WebGL track with packets running between project nodes, the way
leads move through a GHL workflow. Without WebGL2 it renders a plain tilted card grid, and all copy,
links and focus live in the DOM below the canvas either way.

**Cinematic backdrop** — 40 drifting particles on a 2D canvas, reacting to scroll velocity
(`scrollState.velocity`, shared read-only from the Lenis listener).

**Hero name backdrop** — `AWEE DIGITAL` ghosted at `12vw` in `white/6%` behind the hero, parallaxed
on scroll.

**Status bar** — a fixed bottom strip showing the current section (`04 — PROOF`), updated from a
rAF-throttled scroll listener; hidden below `md`.
