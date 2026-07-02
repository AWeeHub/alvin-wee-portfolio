# Visual Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `ghl-specialist-portfolio`'s typography, add scroll-triggered
staggered reveals and a cinematic particle backdrop, and fix the oversized
Matisse Academy screenshot, per
`docs/superpowers/specs/2026-07-02-visual-refresh-design.md`.

**Architecture:** A new `Reveal` component wraps each section's inner
content div (same position the plain `<div className="mx-auto max-w-*">`
wrapper already occupies), turning that div's direct children into a GSAP
`ScrollTrigger`-driven staggered fade group. `CinematicBackdrop` is a
separate fixed-position canvas layer mounted once in `App.tsx`, independent
of `Reveal`. Both reuse the Lenis+GSAP `ScrollTrigger` registration already
established in `src/lib/scroll.ts`. `MatisseFlow.tsx` gets a pure CSS
height-cap fix. Font swap is CSS/config only.

**Tech Stack:** React 18, TypeScript, Vite 5, Tailwind CSS 3, GSAP +
ScrollTrigger (already installed), Lenis (already installed), Vitest +
@testing-library/react (existing test setup, `jsdom` environment).

## Global Constraints

- The AVNM Caffè thumbnail swap (spec item 5) is **already complete** —
  `public/work/avnm-caffe.jpg` was replaced and committed prior to this
  plan. No task here touches it; the final verification task just confirms
  `npm run test` (which includes `caseStudies.assets.test.ts`) still passes.
- `Hero.tsx` is explicitly out of scope — do not modify it.
- Canvas/`requestAnimationFrame`-driven code (`CinematicBackdrop`) is
  verified via `npm run build` + manual browser check only, matching this
  repo's own established convention for motion-heavy code (see
  `src/lib/scroll.ts`'s Lenis wiring, which also has no pixel/frame-level
  test — only its mount/unmount contract is tested). Don't invent a
  canvas-rendering test.
- `Reveal` (new GSAP `ScrollTrigger` wrapper) **does** get a real test,
  following the exact `gsap`/`gsap/ScrollTrigger`/`lenis` mocking pattern
  already used in `src/lib/scroll.test.ts` — this repo's convention is to
  test the React-integration contract (mount/unmount, correct calls) of
  GSAP-driven code, not GSAP's own animation math.
- `prefers-reduced-motion: reduce` must make `Reveal` skip animation and
  render children at rest immediately (never hidden), and must make
  `CinematicBackdrop` skip canvas animation entirely.
- Every `useLayoutEffect`/`useEffect` that creates a GSAP context or a
  `requestAnimationFrame` loop must clean up on unmount (`ctx.revert()` /
  `cancelAnimationFrame` + listener removal) — `main.tsx` is not using
  `<StrictMode>` today (verify at Task 2 Step 1; if it is, effects double-
  invoke in dev and cleanup must still be correct either way).
- No `Instrument Serif` or old font-family references may remain in
  `index.html` / `tailwind.config.js` after Task 1.

---

### Task 1: Swap display font to Fraunces

**Files:**
- Modify: `index.html`
- Modify: `tailwind.config.js`

**Interfaces:** None (CSS/config only, no runtime code consumes this
directly beyond Tailwind's generated `font-display` utility class, already
used throughout via `h1, h2, h3 { @apply font-display; }` in
`src/index.css`).

- [ ] **Step 1: Update the Google Fonts link in `index.html`**

Replace:
```html
    <link
      href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=JetBrains+Mono:wght@400;500;600&display=swap"
      rel="stylesheet"
    />
```
with:
```html
    <link
      href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=JetBrains+Mono:wght@400;500;600&display=swap"
      rel="stylesheet"
    />
```

- [ ] **Step 2: Update `tailwind.config.js`**

Replace:
```js
        display: ['Instrument Serif', 'Georgia', 'serif'],
```
with:
```js
        display: ['Fraunces', 'Georgia', 'serif'],
```

- [ ] **Step 3: Verify no old font reference remains**

```bash
grep -n "Instrument Serif" index.html tailwind.config.js
```
Expected: no output.

- [ ] **Step 4: Build**

```bash
npm run build
```
Expected: succeeds.

- [ ] **Step 5: Manual check**

```bash
npm run dev
```
Open the printed local URL. Expected: every heading (Hero pain-point line,
each section's `<h2>`) renders in Fraunces — visibly heavier/higher-contrast
serif than before, not the old thin Instrument Serif. Stop the dev server
(Ctrl+C) when done.

- [ ] **Step 6: Commit**

```bash
git add index.html tailwind.config.js
git commit -m "Swap display font from Instrument Serif to Fraunces"
```

---

### Task 2: `Reveal` scroll-stagger wrapper (with test)

**Files:**
- Create: `src/components/Reveal.tsx`
- Test: `src/components/Reveal.test.tsx`

**Interfaces:**
- Produces: `<Reveal className?: string; stagger?: number>{children}</Reveal>`
  — renders a `<div ref className>{children}</div>`; on mount, treats the
  div's **direct children** as a GSAP `ScrollTrigger` fade+translateY
  stagger group (`opacity 0→1`, `y 24→0`, `stagger` default `0.08`,
  `duration 0.7`, `ease 'power3.out'`, trigger `start: 'top 80%'`,
  `toggleActions: 'play none none none'`). Under
  `prefers-reduced-motion: reduce`, sets children to their resting state
  immediately via `gsap.set` instead of animating.
- Consumes: `gsap` default export (`registerPlugin`, `context`, `fromTo`,
  `set`) and `ScrollTrigger` from `gsap/ScrollTrigger` — both already
  dependencies.

- [ ] **Step 1: Check whether `main.tsx` uses `StrictMode`**

```bash
cat src/main.tsx
```
Note the result (referenced by the Global Constraints cleanup requirement
above) — no code change from this step, just confirms whether effects will
double-invoke in dev.

- [ ] **Step 2: Write the failing test**

Create `src/components/Reveal.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';

const fromToMock = vi.fn();
const setMock = vi.fn();
const revertMock = vi.fn();
const contextMock = vi.fn((fn: () => void) => {
  fn();
  return { revert: revertMock };
});

vi.mock('gsap', () => ({
  default: {
    registerPlugin: vi.fn(),
    context: contextMock,
    fromTo: fromToMock,
    set: setMock,
  },
}));

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {},
}));

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

beforeAll(() => {
  mockMatchMedia(false);
});

describe('Reveal', () => {
  it('renders its children', async () => {
    const { Reveal } = await import('./Reveal');
    render(
      <Reveal>
        <p>First</p>
        <p>Second</p>
      </Reveal>
    );
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  it('animates direct children via gsap.fromTo with a ScrollTrigger', async () => {
    fromToMock.mockClear();
    const { Reveal } = await import('./Reveal');
    render(
      <Reveal stagger={0.12}>
        <p>First</p>
        <p>Second</p>
      </Reveal>
    );

    expect(fromToMock).toHaveBeenCalledTimes(1);
    const [targets, fromVars, toVars] = fromToMock.mock.calls[0];
    expect(targets).toHaveLength(2);
    expect(fromVars).toEqual({ opacity: 0, y: 24 });
    expect(toVars).toMatchObject({
      opacity: 1,
      y: 0,
      stagger: 0.12,
      ease: 'power3.out',
    });
    expect(toVars.scrollTrigger).toMatchObject({
      start: 'top 80%',
      toggleActions: 'play none none none',
    });
  });

  it('skips animation and sets resting state under prefers-reduced-motion', async () => {
    mockMatchMedia(true);
    fromToMock.mockClear();
    setMock.mockClear();
    const { Reveal } = await import('./Reveal');
    render(
      <Reveal>
        <p>First</p>
      </Reveal>
    );

    expect(fromToMock).not.toHaveBeenCalled();
    expect(setMock).toHaveBeenCalledTimes(1);
    const [targets, vars] = setMock.mock.calls[0];
    expect(targets).toHaveLength(1);
    expect(vars).toEqual({ opacity: 1, y: 0 });

    mockMatchMedia(false);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

```bash
npx vitest run src/components/Reveal.test.tsx
```
Expected: FAIL — `Failed to resolve import "./Reveal"` (file doesn't exist
yet).

- [ ] **Step 4: Write `src/components/Reveal.tsx`**

```tsx
import { useLayoutEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type RevealProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
};

export function Reveal({ children, className, stagger = 0.08 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = Array.from(el.children) as HTMLElement[];
    if (targets.length === 0) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger,
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

```bash
npx vitest run src/components/Reveal.test.tsx
```
Expected: PASS — 3 tests.

- [ ] **Step 6: Build**

```bash
npm run build
```
Expected: succeeds.

- [ ] **Step 7: Commit**

```bash
git add src/components/Reveal.tsx src/components/Reveal.test.tsx
git commit -m "Add Reveal GSAP ScrollTrigger stagger wrapper"
```

---

### Task 3: Wrap sections in `Reveal`

**Files:**
- Modify: `src/components/ProblemSection.tsx`
- Modify: `src/components/SolutionSection.tsx`
- Modify: `src/components/ServicesGrid.tsx`
- Modify: `src/components/ProcessSection.tsx`
- Modify: `src/components/ContactSection.tsx`
- Modify: `src/components/CaseStudies/CaseStudiesSection.tsx`

**Interfaces:**
- Consumes: `Reveal` from Task 2 (`src/components/Reveal.tsx`).

In each file, the existing inner `<div className="mx-auto max-w-*">...</div>`
is replaced by `<Reveal className="mx-auto max-w-*">...</Reveal>` with the
same className and same children — no other content changes.

- [ ] **Step 1: `src/components/ProblemSection.tsx`**

Add the import:
```tsx
import { Reveal } from './Reveal';
```

Replace:
```tsx
      <div className="mx-auto max-w-5xl">
        <h2 className="font-display text-3xl text-text sm:text-4xl">
          Every day without a system has a cost.
        </h2>
        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {COSTS.map((cost) => (
            <div
              key={cost.title}
              className="rounded-2xl border border-white/10 bg-bg-elev p-6 transition hover:border-accent/40"
            >
              <h3 className="font-sans text-lg text-text">{cost.title}</h3>
              <p className="mt-3 font-sans text-sm text-muted">{cost.detail}</p>
            </div>
          ))}
        </div>
      </div>
```
with:
```tsx
      <Reveal className="mx-auto max-w-5xl">
        <h2 className="font-display text-3xl text-text sm:text-4xl">
          Every day without a system has a cost.
        </h2>
        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {COSTS.map((cost) => (
            <div
              key={cost.title}
              className="rounded-2xl border border-white/10 bg-bg-elev p-6 transition hover:border-accent/40"
            >
              <h3 className="font-sans text-lg text-text">{cost.title}</h3>
              <p className="mt-3 font-sans text-sm text-muted">{cost.detail}</p>
            </div>
          ))}
        </div>
      </Reveal>
```

- [ ] **Step 2: `src/components/SolutionSection.tsx`**

Add the import:
```tsx
import { Reveal } from './Reveal';
```

Replace:
```tsx
      <div className="mx-auto max-w-4xl text-center">
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-accent">
          The Solution
        </p>
        <h2 className="mt-6 font-display text-3xl text-text sm:text-4xl">
          I don't sell websites. I build complete customer-acquisition
          systems.
        </h2>
        <p className="mt-6 font-sans text-lg text-muted">
          Funnels, CRM, automation, and design working as one system — so you
          get more leads, more booked calls, and less manual work, instead of
          another disconnected tool.
        </p>
      </div>
```
with:
```tsx
      <Reveal className="mx-auto max-w-4xl text-center">
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-accent">
          The Solution
        </p>
        <h2 className="mt-6 font-display text-3xl text-text sm:text-4xl">
          I don't sell websites. I build complete customer-acquisition
          systems.
        </h2>
        <p className="mt-6 font-sans text-lg text-muted">
          Funnels, CRM, automation, and design working as one system — so you
          get more leads, more booked calls, and less manual work, instead of
          another disconnected tool.
        </p>
      </Reveal>
```

- [ ] **Step 3: `src/components/ServicesGrid.tsx`**

Add the import:
```tsx
import { Reveal } from './Reveal';
```

Replace:
```tsx
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-3xl text-text sm:text-4xl">
          Everything a growth system needs, under one roof.
        </h2>
        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {services.map(({ label, icon: Icon }) => (
            <div
              key={label}
              className="flex flex-col items-start gap-3 rounded-xl border border-white/10 bg-bg-elev p-5 transition hover:-translate-y-1 hover:border-accent/50"
            >
              <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
              <span className="font-sans text-sm text-text">{label}</span>
            </div>
          ))}
        </div>
      </div>
```
with:
```tsx
      <Reveal className="mx-auto max-w-6xl">
        <h2 className="font-display text-3xl text-text sm:text-4xl">
          Everything a growth system needs, under one roof.
        </h2>
        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {services.map(({ label, icon: Icon }) => (
            <div
              key={label}
              className="flex flex-col items-start gap-3 rounded-xl border border-white/10 bg-bg-elev p-5 transition hover:-translate-y-1 hover:border-accent/50"
            >
              <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
              <span className="font-sans text-sm text-text">{label}</span>
            </div>
          ))}
        </div>
      </Reveal>
```

- [ ] **Step 4: `src/components/ProcessSection.tsx`**

Add the import:
```tsx
import { Reveal } from './Reveal';
```

Replace:
```tsx
      <div className="mx-auto max-w-5xl">
        <h2 className="font-display text-3xl text-text sm:text-4xl">How I work.</h2>
        <div className="mt-16 grid gap-8 sm:grid-cols-4">
          {STEPS.map(({ step, title, detail }) => (
            <div key={step}>
              <p className="font-mono text-sm text-accent">{step}</p>
              <h3 className="mt-2 font-sans text-lg text-text">{title}</h3>
              <p className="mt-2 font-sans text-sm text-muted">{detail}</p>
            </div>
          ))}
        </div>
      </div>
```
with:
```tsx
      <Reveal className="mx-auto max-w-5xl">
        <h2 className="font-display text-3xl text-text sm:text-4xl">How I work.</h2>
        <div className="mt-16 grid gap-8 sm:grid-cols-4">
          {STEPS.map(({ step, title, detail }) => (
            <div key={step}>
              <p className="font-mono text-sm text-accent">{step}</p>
              <h3 className="mt-2 font-sans text-lg text-text">{title}</h3>
              <p className="mt-2 font-sans text-sm text-muted">{detail}</p>
            </div>
          ))}
        </div>
      </Reveal>
```

- [ ] **Step 5: `src/components/ContactSection.tsx`**

Add the import:
```tsx
import { Reveal } from './Reveal';
```

Replace:
```tsx
      <div className="mx-auto max-w-3xl">
        <h2 className="font-display text-3xl text-text sm:text-4xl">
          Let's build your growth system.
        </h2>
        <p className="mt-4 font-sans text-lg text-muted">
          Tell me what's slowing your leads down — I'll tell you what to
          automate first.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={whatsappUrl("Hi Alvin, I'd like to talk about a GoHighLevel system.")}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-accent px-8 py-3 font-sans text-sm uppercase tracking-widest text-bg transition hover:bg-accent-dim"
          >
            Message on WhatsApp
          </a>
          <a
            href={mailtoUrl()}
            className="rounded-full border border-accent px-8 py-3 font-sans text-sm uppercase tracking-widest text-accent transition hover:bg-accent hover:text-bg"
          >
            Email me
          </a>
        </div>
      </div>
```
with:
```tsx
      <Reveal className="mx-auto max-w-3xl">
        <h2 className="font-display text-3xl text-text sm:text-4xl">
          Let's build your growth system.
        </h2>
        <p className="mt-4 font-sans text-lg text-muted">
          Tell me what's slowing your leads down — I'll tell you what to
          automate first.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={whatsappUrl("Hi Alvin, I'd like to talk about a GoHighLevel system.")}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-accent px-8 py-3 font-sans text-sm uppercase tracking-widest text-bg transition hover:bg-accent-dim"
          >
            Message on WhatsApp
          </a>
          <a
            href={mailtoUrl()}
            className="rounded-full border border-accent px-8 py-3 font-sans text-sm uppercase tracking-widest text-accent transition hover:bg-accent hover:text-bg"
          >
            Email me
          </a>
        </div>
      </Reveal>
```

- [ ] **Step 6: `src/components/CaseStudies/CaseStudiesSection.tsx`**

Add the import:
```tsx
import { Reveal } from '../Reveal';
```

Replace:
```tsx
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-3xl text-text sm:text-4xl">
          Proof, not promises.
        </h2>

        <div className="mt-16">
          <MatisseFlow study={matisse} />
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          {webBuilds.map((study) => (
            <CaseStudyCard key={study.id} study={study} />
          ))}
        </div>
      </div>
```
with:
```tsx
      <Reveal className="mx-auto max-w-6xl">
        <h2 className="font-display text-3xl text-text sm:text-4xl">
          Proof, not promises.
        </h2>

        <div className="mt-16">
          <MatisseFlow study={matisse} />
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          {webBuilds.map((study) => (
            <CaseStudyCard key={study.id} study={study} />
          ))}
        </div>
      </Reveal>
```

- [ ] **Step 7: Build**

```bash
npm run build
```
Expected: succeeds.

- [ ] **Step 8: Run full test suite**

```bash
npm run test -- --run
```
Expected: all existing tests still pass (no test targets these components
directly, so this just confirms nothing else broke).

- [ ] **Step 9: Manual check**

```bash
npm run dev
```
Scroll from top to bottom. Expected: Problem, Solution, Services, Case
Studies, Process, and Contact sections each stagger-fade their content in
once as they cross into view, without re-triggering on scroll-back-up.
Stop the dev server when done.

- [ ] **Step 10: Commit**

```bash
git add src/components/ProblemSection.tsx src/components/SolutionSection.tsx src/components/ServicesGrid.tsx src/components/ProcessSection.tsx src/components/ContactSection.tsx src/components/CaseStudies/CaseStudiesSection.tsx
git commit -m "Wrap Problem/Solution/Services/CaseStudies/Process/Contact in Reveal"
```

---

### Task 4: `CinematicBackdrop` particle + fog layer

**Files:**
- Create: `src/components/CinematicBackdrop.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Produces: `<CinematicBackdrop />` — self-contained, no props, mounts a
  fixed `z-0` layer behind all page content.

- [ ] **Step 1: Create `src/components/CinematicBackdrop.tsx`**

```tsx
import { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 40;

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
};

function createParticles(width: number, height: number): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.08,
    vy: (Math.random() - 0.5) * 0.08,
    radius: Math.random() * 1.4 + 0.4,
    alpha: Math.random() * 0.4 + 0.1,
  }));
}

export function CinematicBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles = createParticles(width, height);
    let frameId = 0;
    let running = true;
    let resizeTimeout: number;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width;
      canvas!.height = height;
      particles = createParticles(width, height);
    }
    resize();

    function onResize() {
      window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(resize, 200);
    }
    window.addEventListener('resize', onResize);

    function onVisibilityChange() {
      running = document.visibilityState === 'visible';
      if (running) frameId = requestAnimationFrame(tick);
    }
    document.addEventListener('visibilitychange', onVisibilityChange);

    function tick() {
      if (!running) return;
      ctx!.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(57, 255, 138, ${p.alpha})`;
        ctx!.fill();
      }
      frameId = requestAnimationFrame(tick);
    }
    frameId = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(frameId);
      window.clearTimeout(resizeTimeout);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 30%, rgba(57,255,138,0.08) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Mount it in `src/App.tsx`**

Add the import:
```tsx
import { CinematicBackdrop } from './components/CinematicBackdrop';
```

Replace:
```tsx
  return (
    <main>
      <Hero />
```
with:
```tsx
  return (
    <main>
      <CinematicBackdrop />
      <Hero />
```

- [ ] **Step 3: Build**

```bash
npm run build
```
Expected: succeeds.

- [ ] **Step 4: Run full test suite**

```bash
npm run test -- --run
```
Expected: all existing tests still pass.

- [ ] **Step 5: Manual check**

```bash
npm run dev
```
Open the site. Expected: a faint drifting green particle field and soft fog
are visible behind the Hero section (which has no opaque background of its
own beyond `bg-bg`). Scroll down — note whether the backdrop is also visible
behind `bg-bg-elev` sections (Solution, Contact) or fully occluded by their
solid background color. **If occluded, this is expected per the design spec
— do not "fix" it by stripping section backgrounds in this task.** Report it
in the Task 6 verification results as a flagged follow-up instead. Stop the
dev server when done.

- [ ] **Step 6: Commit**

```bash
git add src/components/CinematicBackdrop.tsx src/App.tsx
git commit -m "Add cinematic particle/fog backdrop behind all sections"
```

---

### Task 5: Fix Matisse Academy screenshot sizing

**Files:**
- Modify: `src/components/CaseStudies/MatisseFlow.tsx`

**Interfaces:** None (JSX/className change only).

- [ ] **Step 1: Cap the screenshot height**

Replace:
```tsx
      {activeStep && (
        <div className="mt-6 overflow-hidden rounded-xl border border-white/10">
          <img
            src={activeStep.image}
            alt={activeStep.label}
            loading="lazy"
            className="w-full object-contain"
          />
        </div>
      )}
```
with:
```tsx
      {activeStep && (
        <div className="mt-6 flex max-h-[360px] items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/40 sm:max-h-[520px]">
          <img
            src={activeStep.image}
            alt={activeStep.label}
            loading="lazy"
            className="max-h-[360px] w-full object-contain sm:max-h-[520px]"
          />
        </div>
      )}
```

- [ ] **Step 2: Build**

```bash
npm run build
```
Expected: succeeds.

- [ ] **Step 3: Manual check**

```bash
npm run dev
```
Open the Case Studies section, open the Matisse Academy flow, click through
several steps (especially the tallest screenshots, e.g. "Consult Tracking
Dashboard"). Expected: no step ever expands the card past the capped
height; every screenshot stays fully visible (letterboxed on `bg-black/40`
if its aspect ratio doesn't fill the frame), nothing cropped. Stop the dev
server when done.

- [ ] **Step 4: Commit**

```bash
git add src/components/CaseStudies/MatisseFlow.tsx
git commit -m "Cap Matisse Academy flow screenshot height to fix oversized images"
```

---

### Task 6: Full verification pass

No new files — runs the complete verification plan from the design spec
end-to-end against the finished state.

**Files:** none (verification only)

- [ ] **Step 1: Full test suite**

```bash
npm run test -- --run
```
Expected: all tests pass, including `caseStudies.assets.test.ts` (confirms
the already-swapped AVNM thumbnail still resolves) and the new
`Reveal.test.tsx`.

- [ ] **Step 2: Production build**

```bash
npm run build
```
Expected: succeeds with no TypeScript or Vite errors.

- [ ] **Step 3: Start dev server and open in browser**

```bash
npm run dev
```

- [ ] **Step 4: Typography check**

Confirm Fraunces renders on every heading site-wide (Hero, Problem,
Solution, Services, Case Studies, Process, Contact) — no Instrument Serif
remaining anywhere.

- [ ] **Step 5: Motion check**

Scroll top to bottom. Confirm each of Problem/Solution/Services/Case
Studies/Process/Contact stagger-fades its content in once on scroll-down,
without re-triggering or jank on scroll-up.

- [ ] **Step 6: Backdrop check**

Confirm the particle/fog backdrop is visible behind the Hero. Note (don't
fix) whether it's also visible behind `bg-bg-elev` sections — record this as
a pass/flagged-follow-up in your final report per Task 4 Step 5.

- [ ] **Step 7: Matisse image check**

Click through all 12 Matisse Academy flow steps. Confirm none expands the
card beyond the capped height and none is cropped.

- [ ] **Step 8: AVNM thumbnail check**

Confirm the AVNM Caffè card in the Case Studies grid shows the landing-page
hero screenshot (headline over dark backdrop with the product shot), not
the old tray/product close-up.

- [ ] **Step 9: Reduced-motion check**

Enable "prefers reduced motion" (OS-level or browser devtools rendering
emulation), reload the page. Confirm: backdrop particle animation stops
(fog gradient may remain, it's static CSS), all `Reveal`-wrapped sections
show their content immediately at rest (no stagger-in), nothing is hidden.

- [ ] **Step 10: Responsive check**

Resize to mobile (~375px), tablet (~768px), desktop (~1440px). Confirm no
layout breakage from the backdrop, `Reveal` wrapper, or Matisse's capped
image height.

- [ ] **Step 11: Stop the dev server**

Ctrl+C in the terminal running `npm run dev`.

- [ ] **Step 12: Report results**

If every check in Steps 4–10 passes (or is a known, expected flagged item
per Step 6), the visual refresh is complete. If anything else fails, note
exactly which check and what was observed instead — do not commit a "fix"
without first identifying the specific broken behavior.
