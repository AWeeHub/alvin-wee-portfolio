# AWee Digital — portfolio

Personal portfolio for **Alvin Wee**, GoHighLevel systems builder — funnels, CRM, automation and
web design.

**Live:** https://awee.digital

A single dark scrolling page that makes one argument: what a broken system costs you → what I build
→ who I am → proof it works → how to reach me. Scroll-driven throughout; the type and spacing scale
continuously from a 375px phone to a 2560px monitor.

---

## Stack

| | |
|---|---|
| Framework | React 18 + TypeScript, built with Vite 5 |
| Styling | Tailwind CSS 3 + a small hand-written CSS layer (`src/index.css`) |
| Motion | GSAP 3 with ScrollTrigger; Lenis for smooth scroll |
| Type | Saira, Archivo, Poppins — all self-hosted via `@fontsource` |
| Icons | lucide-react |
| Tests | Vitest + @testing-library/react (jsdom) |
| Hosting | Vercel |

## Scripts

```bash
npm install
npm run dev        # dev server
npm run build      # tsc && vite build
npm run preview    # serve the production build
npm test           # vitest run
```

## Layout

```
src/
  App.tsx                  page composition — the section order is the argument
  main.tsx                 entry; font imports live here
  index.css                fluid design tokens + the CSS animation layer
  components/
    Hero, ProblemSection, ServicesGrid, AboutSection,
    ContactSection, Footer, SiteHeader, StatusBar          the page
    CaseStudies/                                            featured work (GHL flow + WebGL pipeline)
    Marquee, CompanyMarquee, ToolStack, SectionHeading      repeated pieces
    Reveal, MaskedText, ScrollHighlightText, Tilt, Magnetic motion primitives
    DitherPortrait, HeroShader, CinematicBackdrop,
    HeroNameBackdrop, CustomCursor, Preloader, AWeeLogo     the atmosphere
  data/                    copy and content (services, case studies, toolkit, companies)
  lib/                     scroll engine, contact links, hooks
docs/
  BUILD-PROMPT.md          the brief this site was built from
  TYPOGRAPHY-AND-MOTION.md fonts, effects and animation, with the real values
  archive/                 the original planning docs, superseded but kept
public/                    portraits, logos, case-study screenshots
```

## The rules this codebase holds to

These are load-bearing — breaking one of them is what caused most of the bugs that got fixed here.

1. **Animate transforms and opacity only.** No `width`, `height`, `top`, `left` or `margin`
   animations. Progress bars are `scaleX`. Keeps everything on the compositor and layouts stable
   under zoom.
2. **Position-derived, never accumulated.** Scroll animations compute state from where the element
   *is*, so scrolling up is an exact inverse of scrolling down.
3. **Fluid, not breakpointed.** `clamp()` tokens between 375px and 2560px; breakpoints only for
   genuine structural switches (two columns → one).
4. **Measure, don't guess.** Where layout depends on runtime geometry — the height of a pinned
   panel, the width of a card deck — a `ResizeObserver` measures it. Pixel constants tuned on one
   screen break on the next.
5. **Everything degrades.** `prefers-reduced-motion` is honoured by every effect, and no content is
   reachable only through a canvas.

Full detail in [`docs/TYPOGRAPHY-AND-MOTION.md`](docs/TYPOGRAPHY-AND-MOTION.md).
