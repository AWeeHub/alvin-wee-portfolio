import { usePainPointRotator } from '../lib/usePainPointRotator';
import { HeroNameBackdrop } from './HeroNameBackdrop';

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
      className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden bg-bg px-6 pt-20 text-center"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
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
      </div>

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
    </section>
  );
}
