import { useEffect, useState } from 'react';
import { usePainPointRotator } from '../lib/usePainPointRotator';
import { DitherPortrait } from './DitherPortrait';
import { HeroNameBackdrop } from './HeroNameBackdrop';
import { HeroShader } from './HeroShader';
import { MaskedText } from './MaskedText';
import { Reveal } from './Reveal';

// Standing facts under the headline — the reference's equivalent strip is what
// makes it read as a person with a track record rather than a brand statement.
const FACTS = [
  'GoHighLevel specialist',
  'Open to new projects',
  // Last, so it takes the second row on its own rather than splitting the pair
  // above it. No home city: hiring him is not a geography question.
  'Remote — open to relocation',
];

const PAIN_POINTS = [
  "Your funnel isn't converting.",
  'Your CRM is a mess.',
  'Your leads are slipping away.',
  'Your follow-up depends on memory.',
  'Your manual work never stops.',
];

type HeroProps = {
  introReady?: boolean;
};

export function Hero({ introReady = true }: HeroProps) {
  const index = usePainPointRotator(PAIN_POINTS);
  const [shaderOk, setShaderOk] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;
    const probe = document.createElement('canvas');
    if (probe.getContext('webgl2')) setShaderOk(true);
  }, []);

  return (
    // No bottom padding: the portrait is meant to stand ON the rule that closes
    // the hero, the way the reference does it, rather than float above a band of
    // empty black. The floor is set just under what the portrait plus header
    // clearance need, so the section is as tall as its content and no taller —
    // at 86vh it carried ~220px of empty sky above the type, which is what made
    // it read heavy.
    <section
      id="hero"
      className="relative isolate flex min-h-[68vh] flex-col justify-end overflow-hidden bg-bg px-gutter pb-0 pt-[clamp(5rem,9vh+3rem,9rem)]"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {shaderOk ? (
          <HeroShader />
        ) : (
          <>
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(57,255,138,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(57,255,138,0.16) 1px, transparent 1px)',
                backgroundSize: '48px 48px',
                maskImage: 'radial-gradient(65% 65% at 50% 35%, black 0%, transparent 80%)',
                WebkitMaskImage: 'radial-gradient(65% 65% at 50% 35%, black 0%, transparent 80%)',
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(60% 50% at 50% 30%, rgba(57,255,138,0.32) 0%, transparent 70%)',
              }}
            />
          </>
        )}
      </div>

      <HeroNameBackdrop />

      {/* Asymmetric split: type left, portrait right. The centred stack this
          replaced is what made the hero read as a template. */}
      {/* grow, so the row is as tall as the hero: only then does self-end put the
          portrait ON the closing rule instead of at the bottom of a centred block
          floating above it. The type stays optically centred. */}
      {/* The split is a ratio, not a breakpoint stack: below 60rem there isn't
          room for two columns of this weight, so the grid collapses to one — the
          only structural switch in the hero.

          items-center, and no grow: the row is exactly as tall as the portrait
          (its tallest item), so centring the type in the row centres it ON the
          portrait — no pad to keep in step with it. The pad this replaced was a
          fixed share of the portrait, and it broke the moment the type column
          grew: the section anchors to the bottom (justify-end), which is what
          keeps the portrait standing on the closing rule. */}
      <div className="mx-auto grid w-full max-w-shell grid-cols-1 items-center gap-lg lg:grid-cols-[1.15fr_1fr] lg:gap-md">
        <Reveal
          className="flex flex-col items-start pb-xl lg:pb-0"
          stagger={0.14}
          paused={!introReady}
        >
          {/* Was a pill with a pulsing dot — the badge every generated landing
              page wears. A rule running into the role reads like a masthead
              instead, and says the same thing. */}
          <p className="flex items-center gap-sm font-mono text-label uppercase tracking-[0.3em] text-muted">
            <span aria-hidden className="h-px w-[clamp(2.5rem,4vw,5rem)] bg-accent" />
            GoHighLevel Systems Builder
          </p>
          {/* The weight jump — light pain point, black promise — carries the
              emphasis the serif italic used to. */}
          <h1 className="mt-md font-logo text-hero tracking-tight text-text">
            {/* The pain point sits a step below the promise now: it is the setup,
                not the line you are meant to leave with. */}
            <span key={index} className="block animate-fade-up text-pain font-light">
              {PAIN_POINTS[index]}
            </span>
            {/* The one line that stays in the display face: Archivo at 900. The
                brand face cannot land this — it is the weight that does it. */}
            <MaskedText
              className="mt-2xs block font-display font-black uppercase tracking-tight text-accent"
              paused={!introReady}
              scroll={false}
            >
              I build the system that fixes it.
            </MaskedText>
          </h1>
          <p className="mt-sm max-w-[38ch] font-sans text-lead text-muted">
            Funnels, CRM, and automation working as one machine — every lead
            captured, followed up, and booked without manual chasing.
          </p>

          <ul className="mt-md flex flex-wrap gap-x-lg gap-y-xs font-mono text-label uppercase tracking-[0.2em] text-muted">
            {FACTS.map((fact) => (
              <li key={fact} className="flex items-center gap-2xs">
                <span aria-hidden className="h-1.5 w-1.5 shrink-0 bg-accent" />
                {fact}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Bleeds a little off the right edge (the section clips it) so he isn't
            sitting politely inside the grid — but only a little: at 112% he made
            the whole hero read as one heavy block. */}
        <div className="relative mx-auto aspect-square w-full max-w-[min(28rem,80vw)] lg:-mr-[6%] lg:w-[112%] lg:max-w-none">
          <DitherPortrait fadeBottom={false} />
        </div>
      </div>
    </section>
  );
}
