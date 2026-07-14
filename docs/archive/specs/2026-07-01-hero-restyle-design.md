# Hero Restyle — Design Spec

Date: 2026-07-01
Reference: https://www.aaabadcode.com/ (Toukoum / "Fastfolio" — visual style only, not the
AI-chatbot functionality; see Scope below)
Prior spec: `2026-07-01-ghl-specialist-portfolio-design.md` (unchanged — this spec modifies
only the Hero section of that already-built, already-deployed site)

## Purpose

Restyle the Hero section of the already-live GHL specialist portfolio
(`ghl-specialist-portfolio.vercel.app`) to borrow structural/visual ideas from
aaabadcode.com's landing screen — oversized background name typography, a
centered personal avatar, and pill-shaped navigation — while keeping the
site's existing dark, electric-green premium theme untouched.

## Scope

**In scope:** `src/components/Hero.tsx` only, plus two new sub-components it
composes. No other section, no theme/token changes, no new dependencies.

**Explicitly out of scope** (decided during brainstorming, not to be
revisited without a new discussion):
- The reference site's core feature — an LLM-backed conversational chatbot
  ("Fastfolio" product, GPT-5, "Ask me anything" input) — is **not** being
  built. This spec borrows only static visual/structural elements.
- No theme switch. The site stays on its existing dark palette
  (`bg #05070A`, `accent #39FF8A`, etc. — see prior spec's Global
  Constraints). A light/white theme was considered and rejected.
- No functional search/quick-nav input. The reference's "Ask me anything"
  bar is dropped entirely — no decorative or functional replacement.
- No literal copy of the reference's copy, logo, or product branding
  ("Toukoum", "Fastfolio", the bird logo, memoji artwork). Only the layout
  pattern (eyebrow line → bold headline → avatar → pill nav) is reused.

## Reference site findings (for context, not literal reproduction)

Visited aaabadcode.com directly. It's Aaaaby ("Toukoum")'s AI engineer
portfolio, built on a product called Fastfolio. The entire page is a single
hero-like screen: small "Hey, I'm Aaaaby 👋" eyebrow line, bold static role
line ("AI Engineer"), a memoji-style illustrated avatar, a chat-style
"Ask me anything" input, and a row of pill-shaped nav buttons (Me, Projects,
Skills, Fun, Contact) that each fire a canned question into the chatbot.
Clicking a pill immediately hit the product's own free-tier message limit
during this review. A giant, very-low-opacity "Toukoum" wordmark sits behind
the fold as a background typography layer. White background, black text,
minimal color throughout.

## New Hero structure (top to bottom, replacing current `Hero.tsx` body)

1. **Eyebrow line** — unchanged: "GoHighLevel Systems Builder", small
   uppercase mono, `text-accent`.
2. **Rotating pain-point headline** — unchanged: existing
   `usePainPointRotator` + `PAIN_POINTS` array, unchanged copy and timing.
3. **Avatar** — `avatar-Photoroom.png` (from
   `Alvin Wee Portfolio/Alvin Images/avatar-Photoroom.png`, copied into
   `public/avatar.png`), centered below the headline. Circular/contained
   sizing (e.g. ~140–180px), subtle `accent`-tinted glow/drop-shadow
   (`filter: drop-shadow(...)`, transform/opacity-safe — no layout-affecting
   box-shadow animation) to tie the already-green-rim-lit illustration into
   the dark theme. Static image, no animation required beyond the section's
   existing entrance treatment.
4. **Oversized name backdrop** — new `HeroNameBackdrop` component: "ALVIN
   WEE" (or "ALVIN", final wording decided at implementation time if it reads
   better cropped) rendered at a very large font size, very low opacity
   (roughly 4–8%, tuned visually), `position: absolute`, centered, sitting
   behind the eyebrow/headline/avatar/pills (`z-index` below them), clipped
   by `overflow-hidden` on the section so it can bleed off the edges without
   causing horizontal scroll. Purely decorative — `aria-hidden="true"`.
5. **Pill nav row** — new `HeroNavPills` component, replacing the current
   single "See the systems I've built" CTA anchor. Four pill buttons, each
   `rounded-full border border-white/10` with a small lucide icon + label,
   `hover:border-accent/50` (consistent with existing hover patterns
   elsewhere on the site):
   - Services → `#services` (icon: `Wrench` or similar — pick one not
     already used in `services.ts` for visual distinction, or reuse `Zap`)
   - Case Studies → `#case-studies` (icon: `Briefcase`)
   - Process → `#process` (icon: `Workflow`, already used in `services.ts`
     for "Workflow Automation" — acceptable, different context)
   - Contact → `#contact` (icon: `MessageSquare`)
   Each is a plain anchor (`<a href="#...">`), matching the existing
   in-page anchor-link pattern (no JS scroll library beyond the site's
   existing Lenis smooth scroll, which already intercepts anchor navigation
   site-wide).
6. **Sub-copy** — existing paragraph ("I build complete customer-acquisition
   systems...") kept but trimmed to a single short sentence, since the pill
   row now carries primary navigation.

## Component breakdown

- `src/components/Hero.tsx` — modified. Keeps `usePainPointRotator` usage
  and the eyebrow/headline. Composes the two new components below it in the
  existing section markup. Owns overall section layout (`overflow-hidden`
  for the backdrop, stacking order via `relative`/`z-10` on foreground
  content).
- `src/components/HeroNameBackdrop.tsx` — new, no props (or an optional
  `name` prop defaulting to `"ALVIN WEE"` — implementer's call, YAGNI says
  no prop needed since there's exactly one caller). Pure presentational,
  `aria-hidden="true"`.
- `src/components/HeroNavPills.tsx` — new, no props. Owns the pill data
  array (label/href/icon) internally, same pattern as `services.ts` but
  small enough to inline in the component rather than a separate data
  module (4 static items, single consumer — a separate `data/` file would
  be premature per the project's YAGNI convention).

## Asset handling

Copy `Alvin Wee Portfolio/Alvin Images/avatar-Photoroom.png` (source, one
level up from the repo root, same relative-path pattern already used for the
Matisse Academy screenshots in the prior spec) to
`ghl-specialist-portfolio/public/avatar.png`. Verify the file is a real,
non-empty PNG with a transparent/near-white background suitable for sitting
on the dark hero (already confirmed visually during brainstorming — no
further editing needed).

## Animation constraint (standing rule, unchanged)

Everything new must be transform/opacity only, per the project's
cross-cutting animation rule. The avatar glow uses `filter: drop-shadow`
(GPU-safe), not `box-shadow` size animation. No new width/height/top/left
animations anywhere in this change.

## Testing / QA approach

- Type-check (`npx tsc --noEmit`) after the component changes.
- Manual visual check (claude-in-chrome or `run` skill) at mobile (375px),
  tablet (768px), and desktop (1440px): oversized backdrop text doesn't
  cause horizontal scroll at any width, pill row wraps sensibly on mobile
  (allow wrapping to 2 rows rather than forcing 4-across), avatar stays
  centered and legible against the dark background at all sizes.
- Confirm all 4 pill links still scroll to the correct existing section ids
  (`#services`, `#case-studies`, `#process`, `#contact` — all already exist
  on the page from the original build).
- No new automated tests required — this is a presentational-only change
  with no new logic/data to unit test (the existing `usePainPointRotator`
  tests already cover the one piece of logic involved, and it is unchanged).

## Out of scope (reaffirmed)

- No chatbot, no LLM integration, no "Ask me anything" input (functional or
  decorative).
- No theme/palette change.
- No changes to any section other than Hero.
- No reproduction of the reference site's actual branding, logo, product
  name, or memoji artwork.
