import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';

const COSTS = [
  {
    title: 'Leads go cold',
    detail: 'No system means every lead depends on someone remembering to follow up.',
  },
  {
    title: 'Manual work compounds',
    detail: 'Every repetitive task done by hand is hours you never get back to spend on growth.',
  },
  {
    title: 'Booked calls slip away',
    detail: 'A disorganized CRM turns interested buyers into no-shows and ghosts.',
  },
];

export function ProblemSection() {
  return (
    <section id="problem" className="bg-bg px-6 py-32">
      <Reveal className="mx-auto max-w-5xl">
        <SectionHeading
          index="01"
          node="Condition"
          title={
            <>
              Every day without a system has a{' '}
              <span className="italic text-accent">cost</span>.
            </>
          }
        />
        <div className="mt-16 border-t border-white/10">
          {COSTS.map((cost) => (
            <div
              key={cost.title}
              className="group grid gap-2 border-b border-white/10 py-8 sm:grid-cols-[1fr_1.2fr] sm:items-baseline sm:gap-8 sm:py-10"
            >
              <h3 className="font-display text-2xl text-text transition-transform duration-300 group-hover:translate-x-2 sm:text-3xl">
                {cost.title}
              </h3>
              <p className="font-sans text-sm leading-relaxed text-muted sm:text-base">
                {cost.detail}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
