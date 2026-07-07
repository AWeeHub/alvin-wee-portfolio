import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';

const STEPS = [
  { step: '01', title: 'Discovery', detail: 'Map your current funnel, CRM, and gaps.' },
  { step: '02', title: 'Build', detail: 'Design and build every page and pipeline the plan calls for.' },
  { step: '03', title: 'Automate', detail: 'Wire up CRM, workflows, and follow-ups.' },
  { step: '04', title: 'Launch', detail: 'Go live, monitor, and refine what converts.' },
];

export function ProcessSection() {
  return (
    <section id="process" className="bg-bg px-6 py-32">
      <Reveal className="mx-auto max-w-5xl">
        <SectionHeading
          index="05"
          node="Sequence"
          title={
            <>
              How I <span className="italic text-accent">work</span>.
            </>
          }
        />
        <div className="mt-16 grid gap-10 sm:grid-cols-4 sm:gap-8">
          {STEPS.map(({ step, title, detail }) => (
            <div key={step} className="relative border-t border-white/10 pt-6">
              <span
                aria-hidden
                className="absolute -top-[3px] left-0 h-[5px] w-[5px] rounded-full bg-accent"
              />
              <p className="font-mono text-sm text-accent">{step}</p>
              <h3 className="mt-3 font-display text-xl text-text sm:text-2xl">{title}</h3>
              <p className="mt-2 font-sans text-sm leading-relaxed text-muted">{detail}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
