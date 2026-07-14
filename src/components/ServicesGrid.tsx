import { services } from '../data/services';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';
import { Marquee } from './Marquee';

export function ServicesGrid() {
  return (
    <section id="services" className="bg-bg px-6 py-32">
      <Marquee text="The stack" className="-mx-6 mb-20" />
      <Reveal className="mx-auto max-w-5xl">
        <SectionHeading
          index="03"
          node="Stack"
          title={
            <>
              Four things I build. One{' '}
              <span className="font-black text-accent">machine</span> when combined.
            </>
          }
        />
        <div className="mt-16 border-t border-white/10">
          {services.map(({ label, desc, icon: Icon }) => (
            <div
              key={label}
              className="group flex items-center gap-5 border-b border-white/10 py-7 sm:gap-8 sm:py-9"
            >
              <Icon
                className="h-5 w-5 shrink-0 text-muted transition-colors duration-300 group-hover:text-accent"
                aria-hidden="true"
              />
              <div className="flex-1">
                <h3 className="font-display text-2xl text-text transition-transform duration-300 group-hover:translate-x-2 sm:text-4xl">
                  {label}
                </h3>
                <p className="mt-1.5 font-sans text-sm text-muted transition-transform duration-300 group-hover:translate-x-2">
                  {desc}
                </p>
              </div>
              <span
                aria-hidden
                className="-translate-x-2 font-mono text-lg text-accent opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100"
              >
                →
              </span>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
