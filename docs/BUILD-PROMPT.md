# Build prompt — AWee Digital portfolio

The prompt below is what you would hand to an AI coding agent (Claude Code, Cursor, etc.) to
build this site from an empty folder. It is written as a brief, not a checklist: it states the
intent, the constraints, and the decisions that are not negotiable, and leaves the rest open.

Live site: https://awee.digital

---

## The prompt

> Build a personal portfolio site for **Alvin Wee**, a GoHighLevel systems builder trading as
> **AWee Digital** — funnels, CRM, automation, and web design. The site has to survive being
> looked at by people who look at sites for a living: think Awwwards, not a template. It is a
> single scrolling page, dark, with one green accent.
>
> **Stack:** React 18 + TypeScript + Vite. Tailwind CSS 3 for styling. GSAP with ScrollTrigger for
> scroll-driven motion, Lenis for smooth scrolling. Vitest + @testing-library/react for tests.
> No UI kit, no component library, no CSS-in-JS — the styling is Tailwind utilities and a small
> layer of hand-written CSS for the things Tailwind cannot express.
>
> **Voice.** The site argues, in order: here is what a broken system costs you (Symptoms) → here
> is what I build (Build) → here is who I am (About) → here is proof it works (Featured work) →
> here is how to reach me (Contact). Copy is direct and unhedged. No "passionate about", no
> "innovative solutions", no badge that says AI-POWERED.
>
> **Sections, in page order:**
> 1. **Preloader** — the brand lockup, a counter to 100, a progress rule; the overlay slides up
>    and hands off to the hero, which only then plays its entrance.
> 2. **Hero** — an asymmetric split: type left, a dithered portrait right, standing on the rule
>    that closes the section. A rotating pain point ("Your funnel isn't converting.") sits above
>    the one fixed promise: *I build the system that fixes it.* Underneath, a subline and three
>    standing facts.
> 3. **Company marquee** — client logos on an endless loop, all in one shared box so no wordmark
>    swamps the band.
> 4. **Symptoms** — four costs of having no system, as a list of rows that light under the cursor.
> 5. **Build** — five services, dealt out one at a time as a pinned panel is scrolled past.
> 6. **About** — a pinned portrait with the copy lighting paragraph by paragraph beside it, and a
>    toolkit below it as a deck of cards that fans on hover.
> 7. **Featured work** — the GHL build as a twelve-stage workflow you can step through, and the web
>    builds on a WebGL pipeline track.
> 8. **Contact** — one heading, two buttons (WhatsApp, email).
> 9. **Footer** — mark, contact, copyright.
>
> **Every section opens with a full-bleed band** of its own name at display scale, running off both
> edges, with exactly one word filled and the rest hollow (`THE ▢ SYMPTOMS`). The band moves only
> when the page moves — it is scroll-driven, not auto-playing — and scrolling back up runs it back
> the way it came.
>
> **Hard constraints:**
> - **Animate transforms and opacity only.** Never animate `width`, `height`, `top`, `left`, or
>   `margin`. A progress bar is a `scaleX`, not a width. This is the standing rule; if a design
>   needs a width animation, change the design.
> - **Position-derived, not accumulated.** Scroll animations read the element's position and
>   compute their state from it, so scrolling up is an exact inverse of scrolling down. Never
>   accumulate deltas.
> - **Fluid, not breakpointed.** Type and spacing interpolate with `clamp()` between a 375px phone
>   and a 2560px monitor. `text-4xl sm:text-5xl md:text-6xl` ladders are a smell. Keep breakpoints
>   for genuine structural switches only (two columns → one).
> - **Measure, don't guess.** Where a layout depends on something only the browser knows — the
>   height of a pinned panel, the width of a card deck — measure it with a `ResizeObserver` and
>   derive the number. Magic pixel constants tuned on one screen break on the next.
> - **Everything degrades.** Honour `prefers-reduced-motion` everywhere. WebGL layers are
>   decorative and must have a DOM fallback; nothing may be reachable only through a canvas.
> - Contrast floors on all muted text. One-row mobile nav. No horizontal overflow at any width.
>
> Ship it to Vercel.

---

## What the prompt does not say (and why)

A few things in this build came out of iteration, not the brief, and are worth knowing if you
rebuild it:

- **The marquee's speed was measured off a reference site**, not chosen. It travels `1.34px` per
  pixel scrolled. Two earlier readings were wrong because they sampled a band that was off-screen
  (and therefore paused) and a band that auto-drifts rather than tracking scroll.
- **The pinned About panel** cannot use a fixed pull-up. The air a centred sticky panel leaves is
  `(viewport − panel) / 2`, and the panel gets taller as the column narrows and the copy wraps —
  so the offset has to be measured at runtime or the heading collides with the portrait on some
  screen you did not test.
- **The case-study screenshots are portrait** (0.54–0.74 aspect). A landscape frame leaves two
  thirds of itself empty. The screen column is capped to the story column's height instead.
- **Eurostile is licensed** (Linotype/URW) and cannot be self-hosted from a free-font site. Saira
  is the stand-in that carries the same squared, technical feel. See `TYPOGRAPHY-AND-MOTION.md`.

---

## Running it

```bash
npm install
npm run dev        # vite dev server
npm run build      # tsc && vite build
npm test           # vitest run
npx vercel deploy --prod
```
