import { toolkit } from '../data/about';
import { Marquee } from './Marquee';
import { Reveal } from './Reveal';
import { SectionHeading } from './SectionHeading';

export function AboutSection() {
  return (
    <section id="about" className="bg-bg px-6 py-32">
      <Marquee text="About" className="-mx-6 mb-20" />

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

        <div className="mt-14 grid gap-10 md:grid-cols-2">
          <p className="font-sans text-base leading-relaxed text-muted sm:text-lg">
            I'm Alvin Wee, a Digital Experience Designer specializing in
            high-converting websites, landing pages, funnels, and CRM automation.
          </p>
          <p className="font-sans text-base leading-relaxed text-muted sm:text-lg">
            With a background in IT implementation, operations, and marketing
            systems, I combine strategy, design, and technology to build digital
            experiences that are both visually engaging and results-driven —
            from premium interfaces to the automated workflows underneath them.
          </p>
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
