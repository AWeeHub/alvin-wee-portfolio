import { whatsappUrl, mailtoUrl } from '../lib/contact';
import { Magnetic } from './Magnetic';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';
import { Marquee } from './Marquee';

export function ContactSection() {
  return (
    <section id="contact" className="bg-bg-elev px-6 py-40 text-center">
      <Marquee text="Get in touch" className="-mx-6 mb-20" />
      <Reveal className="mx-auto flex max-w-4xl flex-col items-center">
        <SectionHeading
          align="center"
          index="05"
          node="Goal"
          title={
            <>
              Stop chasing. Start{' '}
              <span className="font-black text-accent">booking</span>.
            </>
          }
        />
        <p className="mt-6 max-w-xl font-sans text-lg text-muted">
          Tell me what's slowing your leads down — I'll tell you what to
          automate first.
        </p>
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Magnetic>
            <a
              href={whatsappUrl("Hi Alvin, I'd like to talk about a GoHighLevel system.")}
              target="_blank"
              rel="noreferrer"
              className="block rounded-full bg-accent px-10 py-4 font-sans text-sm uppercase tracking-widest text-bg transition duration-300 hover:bg-accent-dim"
            >
              Message on WhatsApp
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href={mailtoUrl()}
              className="block rounded-full border border-accent px-10 py-4 font-sans text-sm uppercase tracking-widest text-accent transition duration-300 hover:bg-accent hover:text-bg"
            >
              Email me
            </a>
          </Magnetic>
        </div>
      </Reveal>
    </section>
  );
}
