import { useEffect, useState } from 'react';
import { usePainPointRotator } from '../lib/usePainPointRotator';
import { DitherPortrait } from './DitherPortrait';
import { HeroNameBackdrop } from './HeroNameBackdrop';
import { HeroShader } from './HeroShader';
import { MaskedText } from './MaskedText';
import { NodeChip } from './SectionHeading';
import { Reveal } from './Reveal';

// Standing facts under the headline — the reference's equivalent strip is what
// makes it read as a person with a track record rather than a brand statement.
const FACTS = [
  'GoHighLevel specialist',
  'Based in the Philippines',
  'Open to new projects',
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
    <section
      id="hero"
      className="relative isolate flex min-h-screen flex-col justify-center overflow-hidden bg-bg px-6 pb-24 pt-28"
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
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-8">
        <Reveal className="flex flex-col items-start" stagger={0.14} paused={!introReady}>
          <NodeChip label="GoHighLevel Systems Builder" />
          {/* The weight jump — light pain point, black promise — carries the
              emphasis the serif italic used to. */}
          <h1 className="mt-8 font-display text-3xl leading-[1.02] tracking-tight text-text sm:text-5xl lg:text-6xl">
            <span key={index} className="block animate-fade-up font-light">
              {PAIN_POINTS[index]}
            </span>
            <MaskedText
              className="mt-3 block font-black uppercase tracking-tight text-accent"
              paused={!introReady}
              scroll={false}
            >
              I build the system that fixes it.
            </MaskedText>
          </h1>
          <p className="mt-8 max-w-xl font-sans text-base text-muted sm:text-lg">
            Funnels, CRM, and automation working as one machine — every lead
            captured, followed up, and booked without manual chasing.
          </p>

          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            {FACTS.map((fact) => (
              <li key={fact} className="flex items-center gap-2">
                <span aria-hidden className="h-1.5 w-1.5 shrink-0 bg-accent" />
                {fact}
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="relative mx-auto aspect-square w-full max-w-md lg:max-w-none">
          <DitherPortrait />
        </div>
      </div>
    </section>
  );
}
