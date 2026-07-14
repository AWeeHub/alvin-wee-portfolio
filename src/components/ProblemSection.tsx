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
    // No top pad: the band opens the section, and the previous one already ends
    // on its own bottom pad — the same way About sits. pt-32 here stacked a
    // second screenful of air above the large text.
    <section id="problem" className="bg-bg px-gutter pb-2xl">
      <Marquee text="The symptoms" className="-mx-gutter mb-xl" />
      <Reveal className="mx-auto max-w-shell-text">
        <SectionHeading
          title={
            <>
              Every day without a system has a{' '}
              <span className="font-black text-accent">cost</span>.
            </>
          }
        />
      </Reveal>

      <div className="mx-auto mt-lg max-w-shell-text border-t border-white/10">
        {COSTS.map((cost) => {
          const words = cost.detail.split(' ');
          return (
            // The cost lights under the cursor, not under the scroll: you pick
            // which one you're reading.
            <div
              key={cost.title}
              className="cost-row group grid gap-xs border-b border-white/10 py-md sm:grid-cols-[1fr_1.2fr] sm:items-baseline sm:gap-md"
            >
              <h3 className="cost-title font-logo text-row text-muted transition-[color,transform] duration-500 group-hover:translate-x-2">
                {cost.title}
              </h3>
              <p className="font-sans text-body text-text">
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
