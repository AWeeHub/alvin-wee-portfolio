# GHL Specialist Portfolio — Design Spec

Date: 2026-07-01
Source brief: `../../../# MASTER PROMPT - GHL.md` (one level up from repo root)

## Purpose

A new, standalone portfolio site for Alvin Wee positioning him as a premium
GoHighLevel specialist who builds complete customer-acquisition systems
(funnels, CRM, automation, lead capture, booking) — not a generalist web
developer and not "someone who knows GoHighLevel." The site itself must read
as a Stripe/Linear/Framer-tier interactive product demo, not a resume.

This is a **fresh build**, separate from the existing `awee-digital-portfolio`
repo/site (which stays live and untouched).

## Architecture

- **Location**: `Alvin Wee Portfolio/ghl-specialist-portfolio/` (sibling to
  the master prompt, `Sample Projects/`, and `Alvin Images/`)
- **Stack**: Vite + React 18 + TypeScript, Tailwind CSS, GSAP + ScrollTrigger
  (cinematic scroll motion), Lenis (smooth scroll). Chosen over Framer Motion
  because ScrollTrigger is the stronger tool for long cinematic scroll
  narratives and matches the stack already used in avnm-caffe / IronHaul /
  EV Installer.
- **Type**: static SPA, no backend. Contact is direct links only (WhatsApp +
  email) — no form, no webhook, no Calendly.
- **Repo**: new GitHub repo `AWeeHub/ghl-specialist-portfolio` (local git
  identity: `user.name "AWeeHub"`, `user.email "weealvin124@gmail.com"`,
  matching the pattern used on the user's other repos).
- **Deploy**: new Vercel project, auto-deploy on push to `main`.

## Animation rule (standing constraint)

All animation must be transform/opacity-driven (GPU-composited), never
width/height/top/left, per the user's cross-project standing rule. Watch for
this specifically in: the Matisse Academy flow-node connectors, any
underline/hover states, and mockup tilt-on-scroll effects.

## Page structure (single page, cinematic scroll, top to bottom)

1. **Hero** — problem-first hook. Rotating/typed pain-point lines ("Your
   funnel isn't converting." / "Your CRM is disorganized." / "Your leads are
   slipping away." / "Your follow-ups are inconsistent.") resolving into a
   positioning statement introducing systems-building, not software
   knowledge.
2. **The Problem** — brief section naming the cost of manual/disorganized
   ops. Visual motif: scattered/broken pipeline.
3. **The Solution (intro Alvin)** — reframes to "I build complete customer
   acquisition systems," answers "why hire me over another GHL expert."
4. **Expertise/Services grid** — GHL CRM, sales funnels, landing pages,
   marketing automation, pipeline management, lead capture, calendar booking
   systems, AI automations, workflow automation, email/SMS automation,
   forms/surveys, membership areas, integrations, data migration, CRO.
   Interactive cards, not a bullet list.
5. **Case Studies** (see data model below), flagship-first order:
   1. Matisse Academy (real GHL automation — leads, since it's the only
      genuine GHL client-automation proof)
   2. EV Installer (VOLTLINE)
   3. IronHaul Logistics
   4. avnm-caffe
   5. Tricia Portfolio
6. **Process / How I Work** — short scroll-driven timeline: discovery → build
   → automate → launch.
7. **CTA / Contact** — headline + WhatsApp button (`wa.me/639455575654`) +
   email link (`mailto:weealvin124@gmail.com`). No form.
8. **Footer** — name, short tagline, copyright. No social links on file yet.

## Case study data model

```ts
interface CaseStudy {
  id: string;
  title: string;
  category: "GHL Automation" | "Web Build";
  problem: string;
  solution: string;
  techStack: string[];
  results?: string;       // omit/mark "concept demo" when not measurable
  liveUrl?: string;       // web builds only
  flow?: FlowStep[];       // Matisse Academy only
  images: string[];
}

interface FlowStep {
  label: string;
  image: string;
}
```

- **Matisse Academy** (`category: "GHL Automation"`) — no live-site
  screenshot exists; it's backend workflow proof, not a public page.
  Rendered as an animated **flow visualization**: connected step-nodes
  revealing their real screenshot on scroll/click, in this order: Optin Page
  → Application Submitted → Consultation Bundle (Living Estate Trust
  Pre-Call) → Bridge Sale Purchase → Bundle Application Submitted → Purchase
  & Confirmation → Payment Option Fully Paid → Appointment Reminders → 3-Day
  Challenge (Master Your Rights: General/VIP Admission). Source images:
  `Sample Projects/../Matisse Academy Sample Work/Sample Automation/**`
  (paths relative to the portfolio root, one level up from this repo).
- **EV Installer, IronHaul Logistics, avnm-caffe, Tricia Portfolio**
  (`category: "Web Build"`) — shown in a browser/device mockup using a
  screenshot of the live deployed URL, plus problem/solution/stack copy and
  a link to the live site. All four are confirmed deployed on Vercel already
  (EV Installer, IronHaul, Tricia have live `*.vercel.app` URLs per existing
  project memory; avnm-caffe has a `.vercel` project link, live URL to be
  confirmed during implementation).
- Screenshot method: reuse the established approach from the
  awee-digital-portfolio work — `curl` the `og:image` if present, otherwise
  headless Chrome screenshot
  (`chrome.exe --headless --disable-gpu --hide-scrollbars --window-size=1400,900 --virtual-time-budget=3000 --screenshot=out.png URL`),
  writing to the scratchpad dir first, then converting to the project's
  `public/work/` folder.

## Visual & motion system

- **Palette**: dark, premium SaaS base (near-black background) with an
  **electric green** accent — distinct from the existing awee-digital-
  portfolio's purple/green obsidian palette, giving this site its own
  identity.
- **Typography**: reuse the existing brand trio — Instrument Serif (display),
  Bricolage Grotesque (headlines/UI), JetBrains Mono (technical/labels) —
  for personal brand consistency across sites.
- **Motion**: Lenis for base smooth scroll; GSAP ScrollTrigger for section
  pinning/reveals, parallax on Hero/Problem sections, animated connector
  lines in the Matisse Academy flow visualization, magnetic buttons on CTAs,
  perspective/tilt on device mockups as they scroll into view.
- **Performance budget**: lazy-load case-study images, animate only
  transform/opacity, target Lighthouse ≥90 on Performance and Accessibility.

## Out of scope (for this build)

- Funnel-build case studies beyond Matisse Academy — user has more funnel
  work in progress that isn't ready yet; site structure should make it easy
  to add more `CaseStudy` entries later without redesign.
- Calendly integration — explicitly declined by user in favor of direct
  WhatsApp/email contact.
- Contact form / webhook backend — explicitly declined; direct links only.
- Solar Panel Project (Vite+R3F e-commerce site) — not part of this
  portfolio's case studies unless requested later.

## Testing / QA approach

- Responsive check across desktop/tablet/mobile breakpoints.
- Manual scroll-through in a real browser (via claude-in-chrome or `run`
  skill) to verify ScrollTrigger pinning/reveals feel cinematic and don't
  jank.
- Lighthouse pass for Core Web Vitals + accessibility before calling it done.
- Verify all case-study images load (no broken screenshot links) and the
  Matisse Academy flow order matches the sequence above.
