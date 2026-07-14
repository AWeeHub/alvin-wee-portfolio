import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';
import { Marquee } from './Marquee';

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

/** Per-word delay of the hover sweep, in ms. */
const WORD_STEP = 22;

export function ProblemSection() {
  return (
    <section id="problem" className="bg-bg px-6 py-32">
      <Marquee text="The real cost" className="-mx-6 mb-20" />
      <Reveal className="mx-auto max-w-5xl">
        <SectionHeading
          index="01"
          node="Condition"
          title={
            <>
              Every day without a system has a{' '}
              <span className="font-black text-accent">cost</span>.
            </>
          }
        />
      </Reveal>

      <div className="mx-auto mt-16 max-w-5xl border-t border-white/10">
        {COSTS.map((cost) => {
          const words = cost.detail.split(' ');
          return (
            // The cost lights under the cursor, not under the scroll: you pick
            // which one you're reading.
            <div
              key={cost.title}
              className="cost-row group grid gap-2 border-b border-white/10 py-8 sm:grid-cols-[1fr_1.2fr] sm:items-baseline sm:gap-8 sm:py-10"
            >
              <h3 className="cost-title font-display text-2xl text-muted transition-[color,transform] duration-500 group-hover:translate-x-2 sm:text-3xl">
                {cost.title}
              </h3>
              <p className="font-sans text-sm leading-relaxed text-text sm:text-base">
                {words.map((word, i) => (
                  <span
                    // eslint-disable-next-line react/no-array-index-key -- words repeat; position is the identity
                    key={i}
                    className="cost-word"
                    // Staggered delay, so the line lights left to right rather
                    // than all at once.
                    style={{ transitionDelay: `${i * WORD_STEP}ms` }}
                  >
                    {word}
                    {i < words.length - 1 ? ' ' : ''}
                  </span>
                ))}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
