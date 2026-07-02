import { Reveal } from './Reveal';

const STEPS = [
  { step: '01', title: 'Discovery', detail: 'Map your current funnel, CRM, and gaps.' },
  { step: '02', title: 'Build', detail: 'Design and build the site, funnel, or system.' },
  { step: '03', title: 'Automate', detail: 'Wire up CRM, workflows, and follow-ups.' },
  { step: '04', title: 'Launch', detail: 'Go live, monitor, and refine what converts.' },
];

export function ProcessSection() {
  return (
    <section id="process" className="bg-bg px-6 py-32">
      <Reveal className="mx-auto max-w-5xl">
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
      </Reveal>
    </section>
  );
}
