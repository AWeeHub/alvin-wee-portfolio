import { useEffect, useState } from 'react';
import { usePainPointRotator } from '../lib/usePainPointRotator';
import { HeroNameBackdrop } from './HeroNameBackdrop';
import { HeroShader } from './HeroShader';
import { MaskedText } from './MaskedText';
import { NodeChip } from './SectionHeading';
import { Reveal } from './Reveal';
import { SystemLog } from './SystemLog';

const PAIN_POINTS = [
  "Your funnel isn't converting.",
  'Your CRM is disorganized.',
  'Your leads are slipping away.',
  'Your follow-ups are inconsistent.',
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
      className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden bg-bg px-6 pt-20 text-center"
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

      <Reveal className="flex flex-col items-center" stagger={0.14} paused={!introReady}>
        <NodeChip index="00" node="GoHighLevel Systems Builder" />
        <h1 className="mt-10 max-w-5xl font-display text-4xl leading-[1.06] tracking-tight text-text sm:text-6xl md:text-7xl">
          <span key={index} className="block animate-fade-up">
            {PAIN_POINTS[index]}
          </span>
          <MaskedText
            className="mt-3 block italic text-accent"
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
      </Reveal>

      <SystemLog />

      <div
        aria-hidden
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
          The system starts here
        </span>
        <span className="relative block h-10 w-px overflow-hidden bg-white/10">
          <span className="absolute inset-0 bg-accent motion-safe:animate-scroll-cue" />
        </span>
      </div>
    </section>
  );
}
