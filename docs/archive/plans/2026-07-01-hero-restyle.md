# Hero Restyle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the Hero section of the already-deployed GHL specialist portfolio to borrow structural/visual ideas from aaabadcode.com (oversized background name typography, centered personal avatar, pill-shaped nav) while keeping the site's existing dark/electric-green theme, per `docs/superpowers/specs/2026-07-01-hero-restyle-design.md`.

**Architecture:** Two new small presentational components (`HeroNameBackdrop`, `HeroNavPills`) composed inside the existing `Hero.tsx`, which keeps its current eyebrow line, pain-point rotator, and trimmed sub-copy. One new static asset (`public/avatar.png`). No new dependencies, no changes outside `Hero.tsx` and its two new siblings.

**Tech Stack:** React 18 + TypeScript (existing project stack), Tailwind CSS, lucide-react (already installed).

## Global Constraints

- Scope is `src/components/Hero.tsx` plus two new files it composes. No other section, no theme/token changes, no new dependencies.
- Dark theme unchanged: `bg #05070A`, `bg-elev #0B0D0E`, `text #F4F6F5`, `muted #8A9490`, `accent #39FF8A`, `accent-dim #1FAE5B`.
- No chatbot, no LLM integration, no search/quick-nav input (functional or decorative) — dropped entirely per spec.
- All animation/visual effects must be transform/opacity/filter only (GPU-composited) — no width/height/top/left animation, no `box-shadow` size animation (use `filter: drop-shadow` instead).
- Pill nav has exactly 4 items: Services (`#services`), Case Studies (`#case-studies`), Process (`#process`), Contact (`#contact`) — all four section ids already exist on the page from the original build.
- Oversized backdrop text must not cause horizontal scroll at any viewport width; section keeps `overflow-hidden`.
- Source asset: `Alvin Wee Portfolio/Alvin Images/avatar-Photoroom.png` (one level up from repo root) → copy to `public/avatar.png`.
- Repo root: `C:\Users\Alvin\OneDrive\Desktop\Alvin Wee Portfolio\ghl-specialist-portfolio` (already deployed to `ghl-specialist-portfolio.vercel.app`; no GitHub remote yet).

---

## Task 1: Copy and verify the avatar asset

**Files:**
- Create: `public/avatar.png`
- Test: `src/data/avatar.asset.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `public/avatar.png` — referenced by `Hero.tsx` in Task 4 as `<img src="/avatar.png" ...>`.

- [ ] **Step 1: Copy the source file**

Run (from the repo root):

```bash
cp "../Alvin Images/avatar-Photoroom.png" public/avatar.png
ls -la public/avatar.png
```

Expected: file copied, non-zero size.

- [ ] **Step 2: Write the asset-existence test**

```ts
// src/data/avatar.asset.test.ts
import { describe, it, expect } from 'vitest';
import { existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

describe('hero avatar asset', () => {
  it('public/avatar.png exists and is non-empty', () => {
    const filePath = resolve(process.cwd(), 'public', 'avatar.png');
    expect(existsSync(filePath)).toBe(true);
    expect(statSync(filePath).size).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 3: Run the test to verify it passes**

Run: `npx vitest run src/data/avatar.asset.test.ts`
Expected: PASS (1 test). If it fails, the copy in Step 1 did not complete — re-run it.

- [ ] **Step 4: Commit**

```bash
git add public/avatar.png src/data/avatar.asset.test.ts
git commit -m "Add Hero avatar asset and existence test"
```

---

## Task 2: `HeroNameBackdrop` component

**Files:**
- Create: `src/components/HeroNameBackdrop.tsx`

**Interfaces:**
- Consumes: nothing external.
- Produces: `HeroNameBackdrop` component (named export, no props) — imported by `Hero.tsx` in Task 4 as the bottommost layer of the section's stacking context.

- [ ] **Step 1: Write `src/components/HeroNameBackdrop.tsx`**

```tsx
export function HeroNameBackdrop() {
  return (
    <p
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 select-none whitespace-nowrap text-center font-display text-[18vw] leading-none text-white/5"
    >
      ALVIN WEE
    </p>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/HeroNameBackdrop.tsx
git commit -m "Add HeroNameBackdrop component"
```

---

## Task 3: `HeroNavPills` component

**Files:**
- Create: `src/components/HeroNavPills.tsx`

**Interfaces:**
- Consumes: `lucide-react` icon components (already installed).
- Produces: `HeroNavPills` component (named export, no props) — imported by `Hero.tsx` in Task 4, replacing the current single CTA anchor.

- [ ] **Step 1: Write `src/components/HeroNavPills.tsx`**

```tsx
import { Wrench, Briefcase, Workflow, MessageSquare, type LucideIcon } from 'lucide-react';

interface NavPill {
  label: string;
  href: string;
  icon: LucideIcon;
}

const PILLS: NavPill[] = [
  { label: 'Services', href: '#services', icon: Wrench },
  { label: 'Case Studies', href: '#case-studies', icon: Briefcase },
  { label: 'Process', href: '#process', icon: Workflow },
  { label: 'Contact', href: '#contact', icon: MessageSquare },
];

export function HeroNavPills() {
  return (
    <nav className="mt-10 flex flex-wrap items-center justify-center gap-3">
      {PILLS.map(({ label, href, icon: Icon }) => (
        <a
          key={label}
          href={href}
          className="flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 font-sans text-sm text-text transition hover:border-accent/50 hover:text-accent"
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
          {label}
        </a>
      ))}
    </nav>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors. If `Wrench` or `Briefcase` are not exported by the installed `lucide-react` version, this step will fail with a named-import error — if so, stop and report rather than substituting a different icon silently (report as NEEDS_CONTEXT/BLOCKED so the controller can pick a confirmed-available replacement).

- [ ] **Step 3: Commit**

```bash
git add src/components/HeroNavPills.tsx
git commit -m "Add HeroNavPills component"
```

---

## Task 4: Assemble the restyled Hero

**Files:**
- Modify: `src/components/Hero.tsx`

**Interfaces:**
- Consumes: `HeroNameBackdrop` (Task 2), `HeroNavPills` (Task 3), `public/avatar.png` (Task 1), existing `usePainPointRotator` (unchanged).
- Produces: the final restyled `Hero` component — nothing downstream depends on its internals beyond the existing `id="hero"` and its export name, both unchanged.

- [ ] **Step 1: Replace `src/components/Hero.tsx` with the restyled version**

```tsx
import { usePainPointRotator } from '../lib/usePainPointRotator';
import { HeroNameBackdrop } from './HeroNameBackdrop';
import { HeroNavPills } from './HeroNavPills';

const PAIN_POINTS = [
  "Your funnel isn't converting.",
  'Your CRM is disorganized.',
  'Your leads are slipping away.',
  'Your follow-ups are inconsistent.',
  'Your business is doing repetitive manual work every day.',
];

export function Hero() {
  const index = usePainPointRotator(PAIN_POINTS);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-bg px-6 text-center"
    >
      <HeroNameBackdrop />

      <p className="font-mono text-sm uppercase tracking-[0.3em] text-accent">
        GoHighLevel Systems Builder
      </p>
      <h1 className="mt-6 max-w-4xl font-display text-4xl leading-tight text-text sm:text-6xl md:text-7xl">
        <span key={index} className="block animate-fade-up">
          {PAIN_POINTS[index]}
        </span>
      </h1>

      <img
        src="/avatar.png"
        alt="Alvin Wee"
        className="mt-8 h-36 w-36 object-contain [filter:drop-shadow(0_0_24px_rgba(57,255,138,0.35))] sm:h-44 sm:w-44"
      />

      <p className="mt-8 max-w-xl font-sans text-lg text-muted">
        I build complete customer-acquisition systems, not websites.
      </p>

      <HeroNavPills />
    </section>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Run the full test suite**

Run: `npm test`
Expected: all existing tests still pass, plus the new asset-existence test from Task 1.

- [ ] **Step 4: Manual visual check**

Run: `npm run dev`, open `http://localhost:5173` in a real browser (via the `run` skill or claude-in-chrome), check the Hero at mobile (375px), tablet (768px), and desktop (1440px) widths.
Verify: no horizontal scroll at any width; the "ALVIN WEE" backdrop text is visible but subtle behind the foreground content; the avatar is centered, legible, and has a soft green glow against the dark background; the pill row wraps to 2 rows on narrow mobile widths rather than overflowing; all 4 pills navigate to their existing sections when clicked; the pain-point rotator still cycles correctly.
Expected: no console errors, no visible layout breakage.

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero.tsx
git commit -m "Restyle Hero with oversized name backdrop, avatar, and pill nav"
```

---

## Self-Review Notes

- **Spec coverage:** eyebrow/headline unchanged ✅ (Task 4, kept verbatim), avatar ✅ (Tasks 1, 4), oversized name backdrop ✅ (Task 2), pill nav ✅ (Task 3), sub-copy trimmed ✅ (Task 4), animation constraint (`filter: drop-shadow`, no width/height/top/left) ✅ (Task 4), out-of-scope items (no chatbot, no theme change, no search bar) honored — none of these appear anywhere in the plan.
- **Type consistency:** `HeroNameBackdrop` and `HeroNavPills` both take no props, matching their Task 4 call sites (`<HeroNameBackdrop />`, `<HeroNavPills />`). `NavPill`/`PILLS` are internal to `HeroNavPills.tsx`, not exported — no cross-task type mismatch risk.
- **No placeholders:** every step has complete code; no "TBD" or "similar to Task N" shortcuts.
