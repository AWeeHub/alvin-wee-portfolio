import { whatsappUrl, mailtoUrl } from '../lib/contact';
import { Reveal } from './Reveal';

export function ContactSection() {
  return (
    <section id="contact" className="bg-bg-elev px-6 py-32 text-center">
      <Reveal className="mx-auto max-w-3xl">
        <h2 className="font-display text-3xl text-text sm:text-4xl">
          Let's build your growth system.
        </h2>
        <p className="mt-4 font-sans text-lg text-muted">
          Tell me what's slowing your leads down — I'll tell you what to
          automate first.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={whatsappUrl("Hi Alvin, I'd like to talk about a GoHighLevel system.")}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-accent px-8 py-3 font-sans text-sm uppercase tracking-widest text-bg transition hover:bg-accent-dim"
          >
            Message on WhatsApp
          </a>
          <a
            href={mailtoUrl()}
            className="rounded-full border border-accent px-8 py-3 font-sans text-sm uppercase tracking-widest text-accent transition hover:bg-accent hover:text-bg"
          >
            Email me
          </a>
        </div>
      </Reveal>
    </section>
  );
}
