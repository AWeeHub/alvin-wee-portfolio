import { toolkit } from '../data/about';
import { DitherPortrait } from './DitherPortrait';
import { Marquee } from './Marquee';
import { Reveal } from './Reveal';
import { SectionHeading } from './SectionHeading';

export function AboutSection() {
  return (
    <section id="about" className="bg-bg px-6 py-32">
      <Marquee text="About me" className="-mx-6 mb-20" />

      <Reveal className="mx-auto max-w-5xl">
        <SectionHeading
          index="04"
          node="Operator"
          title={
            <>
              Great design isn't how it looks. It's what it{' '}
              <span className="font-black text-accent">does</span>.
            </>
          }
        />

        {/* Portrait left, one column of copy right. The previous two-column
            split forced the reader to jump back up the page mid-thought. */}
        <div className="mt-16 grid items-start gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <figure className="relative mx-auto w-full max-w-xs lg:mx-0 lg:max-w-none">
            <div className="absolute inset-x-4 bottom-0 top-10 -z-10 rounded-t-full bg-accent/10 blur-2xl" />
            {/* Aspect matches the source file, so the dither canvas — which
                stretches to the box — lands exactly on the photo underneath it
                instead of drifting off a letterboxed edge. */}
            <div className="aspect-[760/804] w-full">
              <DitherPortrait src="/about-portrait.webp" alt="Alvin Wee" flip />
            </div>
            <figcaption className="mt-6 border-t border-white/10 pt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
              Alvin Wee — Cebu, Philippines
            </figcaption>
          </figure>

          <div className="flex flex-col gap-7">
            <p className="font-sans text-lg leading-relaxed text-text sm:text-xl">
              I'm Alvin Wee, a Digital Experience Designer specializing in
              high-converting websites, landing pages, funnels, and CRM
              automation.
            </p>
            <p className="font-sans text-base leading-relaxed text-muted sm:text-lg">
              With a background in IT implementation, operations, and marketing
              systems, I combine strategy, design, and technology to create
              digital experiences that are both visually engaging and
              results-driven.
            </p>
            <p className="font-sans text-base leading-relaxed text-muted sm:text-lg">
              From crafting premium user interfaces to building automated
              workflows, my focus is always the same: helping businesses
              attract, convert, and grow.
            </p>
            <p className="border-l-2 border-accent pl-5 font-sans text-base leading-relaxed text-text sm:text-lg">
              I believe great design isn't just about how it looks — it's about
              creating experiences that solve real problems and deliver
              measurable results.
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal className="mx-auto mt-28 max-w-5xl">
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
    </section>
  );
}
