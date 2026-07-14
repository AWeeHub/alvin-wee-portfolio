import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';
import { ScrollHighlightText } from './ScrollHighlightText';
import { Marquee } from './Marquee';

gsap.registerPlugin(ScrollTrigger);

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
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const rows = rowRefs.current.filter(Boolean) as HTMLDivElement[];
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // The cost you are level with is the one lit: it crosses the middle band of
    // the screen, takes the accent, and hands it to the next one on the way out.
    const triggers = rows.map((row) =>
      ScrollTrigger.create({
        trigger: row,
        start: 'top 68%',
        end: 'bottom 38%',
        onToggle: ({ isActive }) => row.classList.toggle('is-lit', isActive),
      })
    );

    return () => triggers.forEach((t) => t.kill());
  }, []);

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
        {COSTS.map((cost, i) => (
          <div
            key={cost.title}
            ref={(el) => {
              rowRefs.current[i] = el;
            }}
            className="cost-row group grid gap-2 border-b border-white/10 py-8 sm:grid-cols-[1fr_1.2fr] sm:items-baseline sm:gap-8 sm:py-10"
          >
            <h3 className="cost-title font-display text-2xl text-muted transition-[color,transform] duration-500 group-hover:translate-x-2 sm:text-3xl">
              {cost.title}
            </h3>
            <ScrollHighlightText className="font-sans text-sm leading-relaxed text-text sm:text-base">
              {cost.detail}
            </ScrollHighlightText>
          </div>
        ))}
      </div>
    </section>
  );
}
