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
