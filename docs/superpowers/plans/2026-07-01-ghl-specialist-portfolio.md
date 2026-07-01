# GHL Specialist Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page, cinematic, GSAP-driven portfolio site that positions Alvin as a premium GoHighLevel systems builder, per `docs/superpowers/specs/2026-07-01-ghl-specialist-portfolio-design.md`.

**Architecture:** Vite + React 18 + TypeScript SPA. One scrolling page assembled from independent section components (Hero, Problem, Solution, Services, Case Studies, Process, Contact, Footer), each self-contained with its own GSAP/ScrollTrigger animations. A typed `caseStudies.ts` data module drives the Case Studies section so new case studies can be added without touching component code. No backend — contact is direct `wa.me` / `mailto` links.

**Tech Stack:** React 18.3, TypeScript 5.5, Vite 5.4, Tailwind CSS 3.4, GSAP 3.12 (+ ScrollTrigger), Lenis 1.1 (smooth scroll), lucide-react (icons), Vitest + @testing-library/react (unit tests for data/logic).

## Global Constraints

- Repo root: `C:\Users\Alvin\OneDrive\Desktop\Alvin Wee Portfolio\ghl-specialist-portfolio` (git already initialized, spec already committed there).
- All animation must be transform/opacity only (GPU-composited) — never `width`/`height`/`top`/`left`. Applies to every section, especially the Matisse Academy flow connectors and any hover/tilt effects.
- Contact = `wa.me/639455575654` and `mailto:weealvin124@gmail.com` only. No form, no webhook, no Calendly.
- Palette: `bg #05070A`, `bg-elev #0B0D0E`, `text #F4F6F5`, `muted #8A9490`, `accent #39FF8A` (electric green), `accent-dim #1FAE5B`.
- Fonts: `Instrument Serif` (display/headlines), `Bricolage Grotesque` (sans/UI/body), `JetBrains Mono` (technical/labels) — same Google Fonts import used in `awee-digital-portfolio`.
- Case studies, flagship-first order: Matisse Academy, EV Installer (VOLTLINE), IronHaul Logistics, avnm-caffe, Tricia Portfolio.
- Confirmed live URLs for screenshot sourcing: `https://voltline-ev-installer.vercel.app`, `https://ironhaul-logistics-five.vercel.app`, `https://avnm-caffe.vercel.app` (has `og:image` at `/gallery-avnm-coffees.jpg`), `https://tricia-portfolio.vercel.app`.
- GitHub repo to create: `AWeeHub/ghl-specialist-portfolio`. Local git identity for all commands in this repo: `user.name "AWeeHub"`, `user.email "weealvin124@gmail.com"` (already set during `git init`).
- No Solar Panel Project, no Calendly, no contact form — explicitly out of scope per spec.

---

## Task 1: Project scaffold

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/index.css`
- Create: `.gitignore`

**Interfaces:**
- Produces: Tailwind tokens `bg`, `bg-elev`, `text`, `muted`, `accent`, `accent-dim` and font families `sans`, `display`, `mono` — every later component styles against these names.

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "ghl-specialist-portfolio",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "gsap": "^3.12.5",
    "lenis": "^1.1.14",
    "lucide-react": "^0.344.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@testing-library/react": "^16.0.1",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.20",
    "jsdom": "^25.0.1",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.5.3",
    "vite": "^5.4.8",
    "vitest": "^2.1.4"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run: `npm install`
Expected: installs cleanly, creates `node_modules/` and `package-lock.json`.

- [ ] **Step 3: Write `.gitignore`**

```
node_modules
dist
.vercel
*.local
```

- [ ] **Step 4: Write `vite.config.ts`**

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
```

- [ ] **Step 5: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "types": ["vitest/globals"]
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 6: Write `tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 7: Write `tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Bricolage Grotesque', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Instrument Serif', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        bg: '#05070A',
        'bg-elev': '#0B0D0E',
        text: '#F4F6F5',
        muted: '#8A9490',
        accent: '#39FF8A',
        'accent-dim': '#1FAE5B',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 8: Write `postcss.config.js`**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 9: Write `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Alvin Wee — GoHighLevel Systems Builder</title>
    <meta
      name="description"
      content="I build complete customer-acquisition systems — funnels, CRM, automation, and design — for businesses that need more leads, more booked calls, and less manual work."
    />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=JetBrains+Mono:wght@400;500;600&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 10: Write `src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: auto;
}

body {
  @apply bg-bg text-text font-sans antialiased;
}

h1,
h2,
h3 {
  @apply font-display;
}
```

- [ ] **Step 11: Write `src/main.tsx`**

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

Note: `./App` doesn't exist yet — create a placeholder now so the dev server boots; Task 13 replaces it with the real assembled page.

- [ ] **Step 12: Write placeholder `src/App.tsx`**

```tsx
export default function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg text-text">
      <p className="font-mono text-sm text-muted">Scaffold OK</p>
    </main>
  );
}
```

- [ ] **Step 13: Verify the scaffold boots**

Run: `npm run dev` (then stop it with Ctrl+C once confirmed, or check via curl in another shell: `curl -s http://localhost:5173 | grep "Scaffold OK"` — note this checks the raw HTML shell only, since content renders client-side; confirming the dev server responds with HTTP 200 is sufficient here)
Expected: Vite prints `Local: http://localhost:5173/` with no errors.

- [ ] **Step 14: Commit**

```bash
git add package.json package-lock.json vite.config.ts tsconfig.json tsconfig.node.json tailwind.config.js postcss.config.js index.html src/main.tsx src/App.tsx src/index.css .gitignore
git commit -m "Scaffold Vite+React+TS+Tailwind project"
```

---

## Task 2: Case study data model

**Files:**
- Create: `src/data/caseStudies.ts`
- Test: `src/data/caseStudies.test.ts`

**Interfaces:**
- Consumes: nothing (leaf module).
- Produces: `CaseStudy`, `FlowStep` types and `caseStudies: CaseStudy[]` array (5 entries, in flagship-first order) — every Case Studies component (Tasks 9–10) imports this array and these types.

- [ ] **Step 1: Write the failing test**

```ts
// src/data/caseStudies.test.ts
import { describe, it, expect } from 'vitest';
import { caseStudies } from './caseStudies';

describe('caseStudies', () => {
  it('has exactly 5 entries in flagship-first order', () => {
    expect(caseStudies.map((c) => c.id)).toEqual([
      'matisse-academy',
      'ev-installer',
      'ironhaul-logistics',
      'avnm-caffe',
      'tricia-portfolio',
    ]);
  });

  it('has unique ids', () => {
    const ids = caseStudies.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('marks Matisse Academy as GHL Automation with an ordered flow and no liveUrl', () => {
    const matisse = caseStudies.find((c) => c.id === 'matisse-academy');
    expect(matisse?.category).toBe('GHL Automation');
    expect(matisse?.liveUrl).toBeUndefined();
    expect(matisse?.flow?.length).toBe(12);
    expect(matisse?.flow?.[0].label).toBe('Challenge Optin');
  });

  it('marks every other entry as Web Build with a liveUrl and no flow', () => {
    const webBuilds = caseStudies.filter((c) => c.id !== 'matisse-academy');
    for (const study of webBuilds) {
      expect(study.category).toBe('Web Build');
      expect(study.liveUrl).toMatch(/^https:\/\/.+\.vercel\.app$/);
      expect(study.flow).toBeUndefined();
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/caseStudies.test.ts`
Expected: FAIL — `Cannot find module './caseStudies'`

- [ ] **Step 3: Write `src/data/caseStudies.ts`**

```ts
export interface FlowStep {
  label: string;
  image: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  category: 'GHL Automation' | 'Web Build';
  problem: string;
  solution: string;
  techStack: string[];
  results?: string;
  liveUrl?: string;
  flow?: FlowStep[];
  images: string[];
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'matisse-academy',
    title: 'Matisse Academy',
    category: 'GHL Automation',
    problem:
      'A legal-education client needed a 3-day challenge funnel that could sell a high-ticket trust bundle without a live sales team chasing every lead by hand.',
    solution:
      'Built the full GoHighLevel automation behind the challenge: optin capture, general/VIP admission upsells, application intake, a bridge-sale bundle offer, payment confirmation, and automatic appointment reminders — all running without manual follow-up.',
    techStack: ['GoHighLevel CRM', 'Workflow Automation', 'Payment Automation', 'Appointment Reminders'],
    results: 'Concept/demo build — full funnel automation, not a public-facing site.',
    images: [],
    flow: [
      { label: 'Challenge Optin', image: '/work/matisse/optin-page.png' },
      { label: 'General Admission', image: '/work/matisse/general-admission.png' },
      { label: 'VIP Admission Upsell', image: '/work/matisse/vip-admission.png' },
      { label: 'Application Submitted', image: '/work/matisse/application-submitted.png' },
      { label: 'Trust Bundle Pre-Call', image: '/work/matisse/trust-bundle-pre-call.png' },
      { label: 'Bridge Sale Purchase', image: '/work/matisse/bridge-sale-purchase.png' },
      { label: 'Bundle Application Submitted', image: '/work/matisse/bundle-application-submitted.png' },
      { label: 'Purchase & Confirmation', image: '/work/matisse/purchase-confirmation.png' },
      { label: 'Payment Fully Paid', image: '/work/matisse/payment-fully-paid.png' },
      { label: 'Appointment Reminders', image: '/work/matisse/appointment-reminders.png' },
      { label: 'Consult Tracking Dashboard', image: '/work/matisse/consult-tracking.png' },
      { label: 'Product Delivery', image: '/work/matisse/product-delivery.png' },
    ],
  },
  {
    id: 'ev-installer',
    title: 'VOLTLINE — EV Installer',
    category: 'Web Build',
    problem:
      'Residential & commercial EV charger installers need a lead-capture site that qualifies property type before a quote request ever reaches a human.',
    solution:
      'Built a cinematic single-page marketing site with a working residential/commercial toggle and a multi-step lead-capture flow, structured to plug straight into a CRM pipeline.',
    techStack: ['HTML/CSS/JS', 'Vercel', 'CRM-ready lead capture'],
    results: 'Concept demo, CRM-ready.',
    liveUrl: 'https://voltline-ev-installer.vercel.app',
    images: ['/work/ev-installer.jpg'],
  },
  {
    id: 'ironhaul-logistics',
    title: 'IronHaul Logistics',
    category: 'Web Build',
    problem:
      'Freight carriers need a site that reads as established and trustworthy, with a fast path from "interested" to "booked."',
    solution:
      'Built a GSAP-animated freight carrier landing page with a booking modal, positioning the client for direct quote requests instead of generic contact-us forms.',
    techStack: ['HTML/CSS/JS', 'GSAP', 'Vercel'],
    results: 'Concept demo.',
    liveUrl: 'https://ironhaul-logistics-five.vercel.app',
    images: ['/work/ironhaul-logistics.jpg'],
  },
  {
    id: 'avnm-caffe',
    title: 'AVNM Caffè',
    category: 'Web Build',
    problem:
      'A real coffee-shop client needed a site that felt as premium as their product, with a full menu and gallery instead of a static one-pager.',
    solution:
      'Built a Vite + GSAP + Lenis site with scroll-reveals, parallax, and a full modular menu/gallery — real client work, not a demo.',
    techStack: ['Vite', 'GSAP', 'Lenis', 'Vercel'],
    results: 'Live client project.',
    liveUrl: 'https://avnm-caffe.vercel.app',
    images: ['/work/avnm-caffe.jpg'],
  },
  {
    id: 'tricia-portfolio',
    title: 'Tricia Claire Navales — VA/EA Portfolio',
    category: 'Web Build',
    problem:
      'A virtual/executive assistant needed a portfolio that reads as editorial and premium, not a generic freelancer template.',
    solution:
      'Built a single-page plum/mauve editorial portfolio site tailored to a VA/EA personal brand.',
    techStack: ['HTML/CSS/JS', 'Vercel'],
    results: 'Live personal-brand project.',
    liveUrl: 'https://tricia-portfolio.vercel.app',
    images: ['/work/tricia-portfolio.jpg'],
  },
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/caseStudies.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/data/caseStudies.ts src/data/caseStudies.test.ts
git commit -m "Add case study data model and content"
```

---

## Task 3: Source case-study screenshots

**Files:**
- Create: `public/work/matisse/*.png` (12 files, renamed from source assets)
- Create: `public/work/ev-installer.jpg`
- Create: `public/work/ironhaul-logistics.jpg`
- Create: `public/work/avnm-caffe.jpg`
- Create: `public/work/tricia-portfolio.jpg`
- Test: `src/data/caseStudies.assets.test.ts`

**Interfaces:**
- Consumes: `caseStudies` array from Task 2 (every `image`/`flow[].image` path must resolve to a real file created here).
- Produces: the actual asset files referenced by `caseStudies.ts` and, indirectly, by the components built in Tasks 9–10.

- [ ] **Step 1: Copy and rename the Matisse Academy screenshots**

Run (from the repo root):

```bash
mkdir -p public/work/matisse
SRC="../Sample Projects/../Matisse Academy Sample Work/Sample Automation"
cp "$SRC/3-day challenge/Optin Page.png" "public/work/matisse/optin-page.png"
cp "$SRC/3-day challenge/Master Your Rights - General Admission.png" "public/work/matisse/general-admission.png"
cp "$SRC/3-day challenge/Master Your Rights - VIP Admission.png" "public/work/matisse/vip-admission.png"
cp "$SRC/Application Submitted.png" "public/work/matisse/application-submitted.png"
cp "$SRC/Bundle - Living Estate Trust Pre-Call.png" "public/work/matisse/trust-bundle-pre-call.png"
cp "$SRC/DFY Trust with 11 Direct Consultation/Bridge Sale Purchase.png" "public/work/matisse/bridge-sale-purchase.png"
cp "$SRC/DFY Trust with 11 Direct Consultation/Bundle Application Submitted.png" "public/work/matisse/bundle-application-submitted.png"
cp "$SRC/DFY Trust with 11 Direct Consultation/Purchase & Confimation.png" "public/work/matisse/purchase-confirmation.png"
cp "$SRC/DFY Trust with 11 Direct Consultation/Payment Option Fully Paid.png" "public/work/matisse/payment-fully-paid.png"
cp "$SRC/DFY Trust with 11 Direct Consultation/Living Estate Trust Pre-Call - Appointment Reminders.png" "public/work/matisse/appointment-reminders.png"
cp "$SRC/Track & Reduce Bundle Consults.png" "public/work/matisse/consult-tracking.png"
cp "$SRC/Consultation Bundle Session - Product Delivery.png" "public/work/matisse/product-delivery.png"
ls public/work/matisse
```

Expected: 12 `.png` files listed, matching every `flow[].image` filename in `caseStudies.ts`.

- [ ] **Step 2: Screenshot the three sites without an `og:image`**

Run (from the repo root, using the headless-Chrome method already validated on this machine):

```bash
CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
SCRATCH="$TEMP/claude-shots"
mkdir -p "$SCRATCH"
"$CHROME" --headless --disable-gpu --hide-scrollbars --window-size=1400,900 --virtual-time-budget=3000 --screenshot="$SCRATCH/ev-installer.png" https://voltline-ev-installer.vercel.app
"$CHROME" --headless --disable-gpu --hide-scrollbars --window-size=1400,900 --virtual-time-budget=3000 --screenshot="$SCRATCH/ironhaul-logistics.png" https://ironhaul-logistics-five.vercel.app
"$CHROME" --headless --disable-gpu --hide-scrollbars --window-size=1400,900 --virtual-time-budget=3000 --screenshot="$SCRATCH/tricia-portfolio.png" https://tricia-portfolio.vercel.app
```

Expected: three `.png` files written to the scratch dir. If Chrome's own working directory refuses the write ("Access is denied"), the `--screenshot` path above already routes around that by pointing at the scratch dir directly.

- [ ] **Step 3: Fetch the avnm-caffe og:image directly**

Run: `curl -s -o "$TEMP/claude-shots/avnm-caffe.jpg" https://avnm-caffe.vercel.app/gallery-avnm-coffees.jpg`
Expected: file downloaded, non-zero size (`ls -la "$TEMP/claude-shots/avnm-caffe.jpg"`).

- [ ] **Step 4: Convert the three PNG screenshots to JPG and move everything into `public/work/`**

```bash
mkdir -p public/work
ffmpeg -y -i "$SCRATCH/ev-installer.png" public/work/ev-installer.jpg
ffmpeg -y -i "$SCRATCH/ironhaul-logistics.png" public/work/ironhaul-logistics.jpg
ffmpeg -y -i "$SCRATCH/tricia-portfolio.png" public/work/tricia-portfolio.jpg
cp "$SCRATCH/avnm-caffe.jpg" public/work/avnm-caffe.jpg
ls public/work
```

Expected: `ev-installer.jpg`, `ironhaul-logistics.jpg`, `tricia-portfolio.jpg`, `avnm-caffe.jpg` all present alongside `matisse/`.

- [ ] **Step 5: Write the failing test**

```ts
// src/data/caseStudies.assets.test.ts
import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { caseStudies } from './caseStudies';

function assertPublicAssetExists(publicPath: string) {
  const filePath = resolve(process.cwd(), 'public', publicPath.replace(/^\//, ''));
  expect(existsSync(filePath), `missing asset: ${publicPath}`).toBe(true);
}

describe('caseStudies image assets', () => {
  it('every top-level image path resolves to a real file', () => {
    for (const study of caseStudies) {
      for (const image of study.images) {
        assertPublicAssetExists(image);
      }
    }
  });

  it('every Matisse Academy flow step image resolves to a real file', () => {
    const matisse = caseStudies.find((c) => c.id === 'matisse-academy');
    for (const step of matisse?.flow ?? []) {
      assertPublicAssetExists(step.image);
    }
  });
});
```

Note: this test is written after Steps 1–4 on purpose — the "failing" state to verify first is what happens if any copy/screenshot step above was skipped, not a red-green-red cycle for its own sake.

- [ ] **Step 6: Run test to verify it fails if any asset is missing, then passes**

Run: `npx vitest run src/data/caseStudies.assets.test.ts`
Expected: PASS (2 tests) if Steps 1–4 completed correctly. If it FAILS, the error message names the exact missing file — go back and re-run the corresponding copy/screenshot command.

- [ ] **Step 7: Commit**

```bash
git add public/work src/data/caseStudies.assets.test.ts
git commit -m "Source case study screenshots and verify asset paths"
```

---

## Task 4: Smooth-scroll hook (Lenis + GSAP)

**Files:**
- Create: `src/lib/scroll.ts`
- Test: `src/lib/scroll.test.ts`

**Interfaces:**
- Consumes: `lenis`, `gsap`, `gsap/ScrollTrigger` packages (installed in Task 1).
- Produces: `useSmoothScroll(): void` — called once in `App.tsx` (Task 13) to wire up Lenis-driven smooth scroll synced to GSAP's ticker for every section's ScrollTrigger animations.

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/scroll.test.ts
import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

vi.mock('lenis', () => ({
  default: vi.fn().mockImplementation(() => ({
    on: vi.fn(),
    raf: vi.fn(),
    destroy: vi.fn(),
  })),
}));

describe('useSmoothScroll', () => {
  it('creates a Lenis instance on mount and destroys it on unmount', async () => {
    const { useSmoothScroll } = await import('./scroll');
    const Lenis = (await import('lenis')).default as unknown as ReturnType<typeof vi.fn>;

    const { unmount } = renderHook(() => useSmoothScroll());
    expect(Lenis).toHaveBeenCalledTimes(1);

    const instance = (Lenis as any).mock.results[0].value;
    unmount();
    expect(instance.destroy).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/scroll.test.ts`
Expected: FAIL — `Cannot find module './scroll'`

- [ ] **Step 3: Write `src/lib/scroll.ts`**

```ts
import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useSmoothScroll(): void {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/scroll.test.ts`
Expected: PASS (1 test)

- [ ] **Step 5: Commit**

```bash
git add src/lib/scroll.ts src/lib/scroll.test.ts
git commit -m "Add Lenis+GSAP smooth-scroll hook"
```

---

## Task 5: Hero section

**Files:**
- Create: `src/lib/usePainPointRotator.ts`
- Create: `src/components/Hero.tsx`
- Test: `src/lib/usePainPointRotator.test.ts`

**Interfaces:**
- Consumes: nothing external beyond React.
- Produces: `Hero` component (default export via named export `Hero`) — imported by `App.tsx` in Task 13 as the first section, `id="hero"`.

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/usePainPointRotator.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePainPointRotator } from './usePainPointRotator';

describe('usePainPointRotator', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts at index 0 and advances on each interval, wrapping around', () => {
    const lines = ['a', 'b', 'c'];
    const { result } = renderHook(() => usePainPointRotator(lines, 1000));

    expect(result.current).toBe(0);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current).toBe(1);

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current).toBe(0);
  });

  it('never advances when given a single line', () => {
    const { result } = renderHook(() => usePainPointRotator(['only'], 1000));
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(result.current).toBe(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/usePainPointRotator.test.ts`
Expected: FAIL — `Cannot find module './usePainPointRotator'`

- [ ] **Step 3: Write `src/lib/usePainPointRotator.ts`**

```ts
import { useEffect, useState } from 'react';

export function usePainPointRotator(lines: string[], intervalMs = 2600): number {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (lines.length <= 1) return;
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % lines.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [lines, intervalMs]);

  return index;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/usePainPointRotator.test.ts`
Expected: PASS (2 tests)

- [ ] **Step 5: Write `src/components/Hero.tsx`**

```tsx
import { usePainPointRotator } from '../lib/usePainPointRotator';

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
      <p className="font-mono text-sm uppercase tracking-[0.3em] text-accent">
        GoHighLevel Systems Builder
      </p>
      <h1 className="mt-6 max-w-4xl font-display text-4xl leading-tight text-text sm:text-6xl md:text-7xl">
        <span key={index} className="block animate-fade-up">
          {PAIN_POINTS[index]}
        </span>
      </h1>
      <p className="mt-8 max-w-2xl font-sans text-lg text-muted">
        I build complete customer-acquisition systems — funnels, CRM,
        automation, and design — so the problem above stops being yours to
        worry about.
      </p>
      <a
        href="#case-studies"
        className="mt-10 rounded-full border border-accent px-8 py-3 font-sans text-sm uppercase tracking-widest text-accent transition hover:bg-accent hover:text-bg"
      >
        See the systems I've built
      </a>
    </section>
  );
}
```

- [ ] **Step 6: Manual render check**

Run: `npm run dev`, open `http://localhost:5173` in a browser (via the `run` skill or claude-in-chrome).
Expected: since `App.tsx` is still the Task 1 placeholder, this step is deferred to Task 13's full-page check — for now, just run `npx tsc --noEmit` to confirm `Hero.tsx` type-checks cleanly with no unused/undefined references.
Expected: no TypeScript errors.

- [ ] **Step 7: Commit**

```bash
git add src/lib/usePainPointRotator.ts src/lib/usePainPointRotator.test.ts src/components/Hero.tsx
git commit -m "Add Hero section with pain-point rotator"
```

---

## Task 6: Problem section

**Files:**
- Create: `src/components/ProblemSection.tsx`

**Interfaces:**
- Consumes: nothing external.
- Produces: `ProblemSection` component — imported by `App.tsx` (Task 13) as the second section, `id="problem"`.

- [ ] **Step 1: Write `src/components/ProblemSection.tsx`**

```tsx
const COSTS = [
  {
    title: 'Leads go cold',
    detail: 'No system means every lead depends on someone remembering to follow up.',
  },
  {
    title: 'Manual work compounds',
    detail: 'Every repetitive task by hand is time that never goes back into growth.',
  },
  {
    title: 'Booked calls slip away',
    detail: 'A disorganized CRM turns interested buyers into no-shows and ghosts.',
  },
];

export function ProblemSection() {
  return (
    <section id="problem" className="bg-bg px-6 py-32">
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
    </section>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ProblemSection.tsx
git commit -m "Add Problem section"
```

---

## Task 7: Solution section

**Files:**
- Create: `src/components/SolutionSection.tsx`

**Interfaces:**
- Consumes: nothing external.
- Produces: `SolutionSection` component — imported by `App.tsx` (Task 13) as the third section, `id="solution"`.

- [ ] **Step 1: Write `src/components/SolutionSection.tsx`**

```tsx
export function SolutionSection() {
  return (
    <section id="solution" className="bg-bg-elev px-6 py-32">
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
    </section>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/SolutionSection.tsx
git commit -m "Add Solution section"
```

---

## Task 8: Services grid

**Files:**
- Create: `src/data/services.ts`
- Create: `src/components/ServicesGrid.tsx`
- Test: `src/data/services.test.ts`

**Interfaces:**
- Consumes: `lucide-react` icon components.
- Produces: `services: Service[]` and `ServicesGrid` component — imported by `App.tsx` (Task 13) as the fourth section, `id="services"`.

- [ ] **Step 1: Write the failing test**

```ts
// src/data/services.test.ts
import { describe, it, expect } from 'vitest';
import { services } from './services';

describe('services', () => {
  it('has 18 unique, non-empty labels', () => {
    expect(services.length).toBe(18);
    const labels = services.map((s) => s.label);
    expect(new Set(labels).size).toBe(18);
    for (const label of labels) {
      expect(label.trim().length).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/services.test.ts`
Expected: FAIL — `Cannot find module './services'`

- [ ] **Step 3: Write `src/data/services.ts`**

```ts
import {
  Database,
  Filter,
  LayoutTemplate,
  Globe,
  Zap,
  Settings,
  GitBranch,
  UserPlus,
  Calendar,
  Bot,
  Workflow,
  Mail,
  MessageSquare,
  FileText,
  Users,
  Plug,
  History,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';

export interface Service {
  label: string;
  icon: LucideIcon;
}

export const services: Service[] = [
  { label: 'GoHighLevel CRM', icon: Database },
  { label: 'Sales Funnel Development', icon: Filter },
  { label: 'Landing Page Design', icon: LayoutTemplate },
  { label: 'High-Converting Websites', icon: Globe },
  { label: 'Marketing Automation', icon: Zap },
  { label: 'CRM Setup', icon: Settings },
  { label: 'Pipeline Management', icon: GitBranch },
  { label: 'Lead Capture Systems', icon: UserPlus },
  { label: 'Calendar Booking Systems', icon: Calendar },
  { label: 'AI Automations', icon: Bot },
  { label: 'Workflow Automation', icon: Workflow },
  { label: 'Email Marketing Automation', icon: Mail },
  { label: 'SMS Automation', icon: MessageSquare },
  { label: 'Forms & Surveys', icon: FileText },
  { label: 'Membership Areas', icon: Users },
  { label: 'Integrations', icon: Plug },
  { label: 'Data Migration', icon: History },
  { label: 'Conversion Optimization', icon: TrendingUp },
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/services.test.ts`
Expected: PASS (1 test)

- [ ] **Step 5: Write `src/components/ServicesGrid.tsx`**

```tsx
import { services } from '../data/services';

export function ServicesGrid() {
  return (
    <section id="services" className="bg-bg px-6 py-32">
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
    </section>
  );
}
```

- [ ] **Step 6: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add src/data/services.ts src/data/services.test.ts src/components/ServicesGrid.tsx
git commit -m "Add Services grid"
```

---

## Task 9: Case study mockup card (web builds)

**Files:**
- Create: `src/components/CaseStudies/CaseStudyCard.tsx`
- Create: `src/components/CaseStudies/CaseStudiesSection.tsx`

**Interfaces:**
- Consumes: `CaseStudy` type and `caseStudies` array (Task 2).
- Produces: `CaseStudyCard` (props: `{ study: CaseStudy }`, renders the browser-mockup variant for any `category: 'Web Build'` study) and `CaseStudiesSection` — the latter is imported by `App.tsx` (Task 13) as the fifth section, `id="case-studies"`. `CaseStudiesSection` also renders `MatisseFlow` (Task 10) for the one `'GHL Automation'` entry.

- [ ] **Step 1: Write `src/components/CaseStudies/CaseStudyCard.tsx`**

```tsx
import { useState } from 'react';
import type { CaseStudy } from '../../data/caseStudies';

export function CaseStudyCard({ study }: { study: CaseStudy }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="rounded-2xl border border-white/10 bg-bg-elev p-6">
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        aria-expanded={expanded}
        className="w-full text-left"
      >
        <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40">
          <div className="flex items-center gap-1.5 border-b border-white/10 bg-bg px-3 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          </div>
          <img
            src={study.images[0]}
            alt={`${study.title} preview`}
            loading="lazy"
            className="aspect-video w-full object-cover object-top transition duration-500 group-hover:scale-105"
          />
        </div>
        <h3 className="mt-5 font-sans text-xl text-text">{study.title}</h3>
        <p className="mt-1 font-mono text-xs uppercase tracking-widest text-accent">
          {study.category}
        </p>
      </button>

      {expanded && (
        <div className="mt-6 space-y-4 border-t border-white/10 pt-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted">Problem</p>
            <p className="mt-1 font-sans text-sm text-text">{study.problem}</p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted">Solution</p>
            <p className="mt-1 font-sans text-sm text-text">{study.solution}</p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted">Stack</p>
            <p className="mt-1 font-sans text-sm text-text">{study.techStack.join(' · ')}</p>
          </div>
          {study.results && (
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted">Results</p>
              <p className="mt-1 font-sans text-sm text-text">{study.results}</p>
            </div>
          )}
          {study.liveUrl && (
            <a
              href={study.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block font-sans text-sm text-accent underline"
            >
              View live site →
            </a>
          )}
        </div>
      )}
    </article>
  );
}
```

- [ ] **Step 2: Write `src/components/CaseStudies/CaseStudiesSection.tsx`**

```tsx
import { caseStudies } from '../../data/caseStudies';
import { CaseStudyCard } from './CaseStudyCard';
import { MatisseFlow } from './MatisseFlow';

export function CaseStudiesSection() {
  const [matisse, ...webBuilds] = caseStudies;

  return (
    <section id="case-studies" className="bg-bg-elev px-6 py-32">
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
    </section>
  );
}
```

Note: this imports `MatisseFlow` from Task 10 — the two components are built as a pair because `CaseStudiesSection` cannot render without both variants existing. Task 10 must be completed before this file will type-check.

- [ ] **Step 3: Type-check (expect this to fail until Task 10 is done)**

Run: `npx tsc --noEmit`
Expected: FAILS with `Cannot find module './MatisseFlow'` — this is expected at this point in the plan; Task 10 resolves it. Do not commit yet.

- [ ] **Step 4: Commit `CaseStudyCard.tsx` only for now**

```bash
git add src/components/CaseStudies/CaseStudyCard.tsx
git commit -m "Add case study browser-mockup card component"
```

(`CaseStudiesSection.tsx` is committed at the end of Task 10, once it type-checks.)

---

## Task 10: Matisse Academy flow visualization

**Files:**
- Create: `src/components/CaseStudies/MatisseFlow.tsx`

**Interfaces:**
- Consumes: `CaseStudy` type (Task 2), `CaseStudiesSection.tsx` written in Task 9 (uncommitted, staged only).
- Produces: `MatisseFlow` (props: `{ study: CaseStudy }`) — completes the import `CaseStudiesSection.tsx` is waiting on.

- [ ] **Step 1: Write `src/components/CaseStudies/MatisseFlow.tsx`**

```tsx
import { useState } from 'react';
import type { CaseStudy } from '../../data/caseStudies';

export function MatisseFlow({ study }: { study: CaseStudy }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const steps = study.flow ?? [];
  const activeStep = steps[activeIndex];

  return (
    <div className="rounded-2xl border border-white/10 bg-bg p-6">
      <div>
        <h3 className="font-sans text-xl text-text">{study.title}</h3>
        <p className="mt-1 font-mono text-xs uppercase tracking-widest text-accent">
          {study.category}
        </p>
        <p className="mt-4 max-w-2xl font-sans text-sm text-muted">{study.solution}</p>
      </div>

      <div className="mt-8 flex gap-3 overflow-x-auto pb-2">
        {steps.map((step, i) => (
          <button
            key={step.label}
            type="button"
            onClick={() => setActiveIndex(i)}
            className={`flex-shrink-0 rounded-full border px-4 py-2 font-mono text-xs whitespace-nowrap transition ${
              i === activeIndex
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-white/10 text-muted hover:border-white/30'
            }`}
          >
            {i + 1}. {step.label}
          </button>
        ))}
      </div>

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
    </div>
  );
}
```

- [ ] **Step 2: Type-check the whole Case Studies section**

Run: `npx tsc --noEmit`
Expected: no errors — `CaseStudiesSection.tsx` now resolves `MatisseFlow`.

- [ ] **Step 3: Commit**

```bash
git add src/components/CaseStudies/MatisseFlow.tsx src/components/CaseStudies/CaseStudiesSection.tsx
git commit -m "Add Matisse Academy flow visualization and assemble Case Studies section"
```

---

## Task 11: Process section

**Files:**
- Create: `src/components/ProcessSection.tsx`

**Interfaces:**
- Consumes: nothing external.
- Produces: `ProcessSection` component — imported by `App.tsx` (Task 13) as the sixth section, `id="process"`.

- [ ] **Step 1: Write `src/components/ProcessSection.tsx`**

```tsx
const STEPS = [
  { step: '01', title: 'Discovery', detail: 'Map your current funnel, CRM, and gaps.' },
  { step: '02', title: 'Build', detail: 'Design and build the site, funnel, or system.' },
  { step: '03', title: 'Automate', detail: 'Wire up CRM, workflows, and follow-ups.' },
  { step: '04', title: 'Launch', detail: 'Go live, monitor, and refine what converts.' },
];

export function ProcessSection() {
  return (
    <section id="process" className="bg-bg px-6 py-32">
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
    </section>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ProcessSection.tsx
git commit -m "Add Process section"
```

---

## Task 12: Contact section + Footer

**Files:**
- Create: `src/lib/contact.ts`
- Create: `src/components/ContactSection.tsx`
- Create: `src/components/Footer.tsx`
- Test: `src/lib/contact.test.ts`

**Interfaces:**
- Consumes: nothing external.
- Produces: `whatsappUrl(message?: string): string` and `mailtoUrl(): string` — used by `ContactSection`; `ContactSection` and `Footer` are imported by `App.tsx` (Task 13) as the seventh and eighth (final) sections.

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/contact.test.ts
import { describe, it, expect } from 'vitest';
import { whatsappUrl, mailtoUrl } from './contact';

describe('contact links', () => {
  it('builds a wa.me link with the correct number and no message by default', () => {
    expect(whatsappUrl()).toBe('https://wa.me/639455575654');
  });

  it('builds a wa.me link with a URL-encoded message when provided', () => {
    expect(whatsappUrl('Hi Alvin, interested in a GHL system')).toBe(
      'https://wa.me/639455575654?text=Hi%20Alvin%2C%20interested%20in%20a%20GHL%20system',
    );
  });

  it('builds the mailto link for the public contact email', () => {
    expect(mailtoUrl()).toBe('mailto:weealvin124@gmail.com');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/contact.test.ts`
Expected: FAIL — `Cannot find module './contact'`

- [ ] **Step 3: Write `src/lib/contact.ts`**

```ts
const WHATSAPP_NUMBER = '639455575654';
const CONTACT_EMAIL = 'weealvin124@gmail.com';

export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function mailtoUrl(): string {
  return `mailto:${CONTACT_EMAIL}`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/contact.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 5: Write `src/components/ContactSection.tsx`**

```tsx
import { whatsappUrl, mailtoUrl } from '../lib/contact';

export function ContactSection() {
  return (
    <section id="contact" className="bg-bg-elev px-6 py-32 text-center">
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
    </section>
  );
}
```

- [ ] **Step 6: Write `src/components/Footer.tsx`**

```tsx
export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-bg px-6 py-10 text-center">
      <p className="font-sans text-sm text-text">Alvin Wee</p>
      <p className="mt-1 font-mono text-xs text-muted">
        GoHighLevel Systems Builder — funnels, CRM, automation, and design.
      </p>
      <p className="mt-4 font-mono text-xs text-muted">
        © {new Date().getFullYear()} Alvin Wee. All rights reserved.
      </p>
    </footer>
  );
}
```

- [ ] **Step 7: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 8: Commit**

```bash
git add src/lib/contact.ts src/lib/contact.test.ts src/components/ContactSection.tsx src/components/Footer.tsx
git commit -m "Add Contact section and Footer with WhatsApp/email links"
```

---

## Task 13: Assemble the page

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: every section component from Tasks 5–12, plus `useSmoothScroll` (Task 4).
- Produces: the final rendered page — nothing downstream depends on `App.tsx`; this is the integration point.

- [ ] **Step 1: Replace `src/App.tsx` with the real assembled page**

```tsx
import { useSmoothScroll } from './lib/scroll';
import { Hero } from './components/Hero';
import { ProblemSection } from './components/ProblemSection';
import { SolutionSection } from './components/SolutionSection';
import { ServicesGrid } from './components/ServicesGrid';
import { CaseStudiesSection } from './components/CaseStudies/CaseStudiesSection';
import { ProcessSection } from './components/ProcessSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

export default function App() {
  useSmoothScroll();

  return (
    <main>
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <ServicesGrid />
      <CaseStudiesSection />
      <ProcessSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
```

- [ ] **Step 2: Add a focus-visible outline for keyboard accessibility to `src/index.css`**

Add to the end of the file:

```css
a:focus-visible,
button:focus-visible {
  outline: 2px solid theme('colors.accent');
  outline-offset: 2px;
}
```

- [ ] **Step 3: Type-check the whole project**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Run the full test suite**

Run: `npm test`
Expected: all tests across every task pass (data model, assets, scroll hook, pain-point rotator, services, contact links).

- [ ] **Step 5: Manual full-page scroll check**

Run: `npm run dev`, open `http://localhost:5173` in a real browser (via the `run` skill or claude-in-chrome tools).
Verify: all 8 sections render top to bottom in order (Hero → Problem → Solution → Services → Case Studies → Process → Contact → Footer); the Hero pain-point line changes every ~2.6s; clicking a web-build case study card expands it in place with problem/solution/stack; clicking a Matisse flow step swaps the displayed screenshot; both Contact buttons have the correct `href` (inspect via dev tools — `wa.me/639455575654...` and `mailto:weealvin124@gmail.com`).
Expected: no console errors, no visibly broken images, no layout jank on scroll.

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx src/index.css
git commit -m "Assemble full single-page site"
```

---

## Task 14: GitHub repo and push

**Files:** none (repo-level operation only)

- [ ] **Step 1: Create the GitHub repo**

Run: `gh repo create AWeeHub/ghl-specialist-portfolio --private --source=. --remote=origin`
Expected: repo created, `origin` remote added.

Note: confirm with the user whether the repo should be public or private before running this — the other AWeeHub demo repos (IronHaul, EV Installer, Tricia) are public; match that unless told otherwise.

- [ ] **Step 2: Push**

Run: `git push -u origin master`
Expected: push succeeds, branch tracking set up.

---

## Task 15: Vercel deploy

**Files:** none (deploy-level operation only)

- [ ] **Step 1: Link and deploy via the Vercel MCP tool or CLI**

Run: `npx vercel --prod` (or use `mcp__plugin_vercel_vercel__deploy_to_vercel` if preferred) from the repo root.
Expected: new Vercel project created (suggest naming it `ghl-specialist-portfolio` to match the repo), production deployment succeeds, returns a live `*.vercel.app` URL.

- [ ] **Step 2: Verify the live deployment**

Run: `curl -sI https://<the-returned-url> | head -1`
Expected: `HTTP/2 200`

---

## Task 16: Final QA pass

**Files:** none (verification-only task)

- [ ] **Step 1: Responsive check**

Using claude-in-chrome or the `run` skill, load the live (or local) site and check layout at mobile (375px), tablet (768px), and desktop (1440px) widths for all 8 sections.
Expected: no horizontal overflow, no overlapping text, Services grid reflows (4→3→2 columns), Case Studies cards stack to 1 column on mobile.

- [ ] **Step 2: Lighthouse pass**

Run a Lighthouse audit (via `mcp__plugin_chrome-devtools-mcp_chrome-devtools__lighthouse_audit` or Chrome DevTools directly) against the deployed URL.
Expected: Performance and Accessibility scores ≥ 90, per the spec's testing section. If below target, the most likely fix is lazy-loading/compressing the Matisse Academy screenshots (12 PNGs) — convert any oversized ones to compressed JPG/WebP in `public/work/matisse/` and re-run.

- [ ] **Step 3: Broken-asset check**

Run: `npx vitest run src/data/caseStudies.assets.test.ts` once more against the final committed state, to reconfirm no asset path drifted during later edits.
Expected: PASS.

---

## Self-Review Notes

- **Spec coverage:** architecture ✅ (Task 1), page structure ✅ (Tasks 5–13, order matches spec), case study data model + both mockup variants ✅ (Tasks 2, 3, 9, 10), visual/motion system ✅ (Task 1 tokens + Task 4 scroll + Task 13 assembly), contact/footer ✅ (Task 12), GitHub/Vercel ✅ (Tasks 14–15), QA approach ✅ (Task 16 mirrors the spec's testing section verbatim).
- **Type consistency checked:** `CaseStudy`/`FlowStep` (Task 2) match the fields consumed in `CaseStudyCard.tsx` and `MatisseFlow.tsx` (Tasks 9–10); `useSmoothScroll` (Task 4) and `usePainPointRotator` (Task 5) signatures match their call sites in `scroll.ts`'s consumer (`App.tsx`, Task 13) and `Hero.tsx`.
- **Out-of-scope items honored:** no Calendly, no contact form/webhook, no Solar Panel Project case study — matches the spec's "Out of scope" section.
