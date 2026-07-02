import { services } from '../data/services';
import { Reveal } from './Reveal';

export function ServicesGrid() {
  return (
    <section id="services" className="bg-bg px-6 py-32">
      <Reveal className="mx-auto max-w-6xl">
        <h2 className="font-display text-3xl text-text sm:text-4xl">
          Everything a growth system needs, under one roof.
        </h2>
        <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
          {services.map(({ label, icon: Icon }) => (
            <div
              key={label}
              className="flex flex-col items-start gap-3 rounded-xl border border-white/10 bg-bg-elev p-5 transition hover:-translate-y-1 hover:border-accent/50"
            >
              <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
              <span className="font-sans text-sm text-text">{label}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
