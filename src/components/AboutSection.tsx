import { useRef } from 'react';
import { toolkit } from '../data/about';
import { DitherPortrait } from './DitherPortrait';
import { Marquee } from './Marquee';
import { Reveal } from './Reveal';
import { ScrollHighlightText } from './ScrollHighlightText';
import { SectionHeading } from './SectionHeading';

const COPY = [
  "I'm Alvin Wee, a Digital Experience Designer specializing in high-converting websites, landing pages, funnels, and CRM automation.",
  'With a background in IT implementation, operations, and marketing systems, I combine strategy, design, and technology to create digital experiences that are both visually engaging and results-driven.',
  'From crafting premium user interfaces to building automated workflows, my focus is always the same: helping businesses attract, convert, and grow.',
  "I believe great design isn't just about how it looks — it's about creating experiences that solve real problems and deliver measurable results.",
];

/** Scroll distance the pinned panel holds for, per paragraph. */
const HOLD_VH = 45;

export function AboutSection() {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <section id="about" className="bg-bg">
      <Marquee text="About me" className="mb-20" />

      <div className="px-6">
        <Reveal className="mx-auto max-w-5xl">
          <SectionHeading
            index="03"
            node="Operator"
            title={
              <>
                Great design isn't how it looks. It's what it{' '}
                <span className="font-black text-accent">does</span>.
              </>
            }
          />
        </Reveal>
      </div>

      {/* The panel holds still while this track scrolls past it, and the track's
          progress is what lights the copy — so the words come up in reading order
          under a portrait that never moves. */}
      <div
        ref={trackRef}
        className="relative px-6"
        style={{ height: `calc(100vh + ${COPY.length * HOLD_VH}vh)` }}
      >
        <div className="sticky top-24 mx-auto grid max-w-5xl items-start gap-12 pb-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <figure className="relative mx-auto w-full max-w-[15rem] lg:mx-0 lg:max-w-none">
            <div className="absolute inset-x-4 bottom-0 top-10 -z-10 rounded-t-full bg-accent/10 blur-2xl" />
            {/* Aspect matches the source file, so the dither canvas — which
                stretches to the box — lands exactly on the photo underneath it
                instead of drifting off a letterboxed edge. */}
            <div className="aspect-[760/804] w-full">
              <DitherPortrait src="/about-portrait.webp" alt="Alvin Wee" flip />
            </div>
            <figcaption className="mt-5 border-t border-white/10 pt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
              Alvin Wee — Cebu, Philippines
            </figcaption>
          </figure>

          <div className="flex flex-col gap-6">
            {COPY.map((paragraph, i) => (
              <ScrollHighlightText
                key={paragraph}
                driver={trackRef}
                // Each paragraph owns a slice of the track, so they light one
                // after another instead of all at once.
                range={[i / COPY.length, (i + 1) / COPY.length]}
                className={
                  i === COPY.length - 1
                    ? 'border-l-2 border-accent pl-5 font-sans text-base leading-relaxed text-text sm:text-lg'
                    : 'font-sans text-base leading-relaxed text-text sm:text-lg'
                }
              >
                {paragraph}
              </ScrollHighlightText>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 pb-32">
        <Reveal className="mx-auto max-w-5xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
            My toolkit
          </p>
          <dl className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {toolkit.map((group) => (
              <div key={group.label} className="border-t border-white/10 pt-5">
                <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
                  {group.label}
                </dt>
                <dd className="mt-4 flex flex-col gap-2">
                  {group.tools.map((tool) => (
                    <span key={tool} className="font-sans text-base text-text">
                      {tool}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
