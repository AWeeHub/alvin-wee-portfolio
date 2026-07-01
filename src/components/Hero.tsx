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
