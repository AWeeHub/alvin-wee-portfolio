import { whatsappUrl, mailtoUrl, CONTACT_EMAIL, LINKEDIN_URL } from '../lib/contact';
import { Magnetic } from './Magnetic';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';
import { Marquee } from './Marquee';

export function ContactSection() {
  return (
    // The bottom padding is deliberately short: the footer is the last thing on
    // the page, and with a taller gap the "Stop chasing" heading has already
    // scrolled off by the time you reach it.
    <section id="contact" className="bg-bg-elev px-6 pb-24 pt-32 text-center">
      <Marquee text="Get in touch" className="-mx-6 mb-20" />
      <Reveal className="mx-auto flex max-w-4xl flex-col items-center">
        <SectionHeading
          align="center"
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

        {/* The address and the profile in full, for anyone who would rather copy
            them than click a button. */}
        <div className="mt-12 flex flex-col items-center gap-5 border-t border-white/10 pt-8 sm:flex-row sm:justify-center sm:gap-12">
          <a
            href={mailtoUrl()}
            className="font-mono text-xs uppercase tracking-[0.2em] text-muted transition-colors duration-300 hover:text-accent"
          >
            {CONTACT_EMAIL}
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs uppercase tracking-[0.2em] text-muted transition-colors duration-300 hover:text-accent"
          >
            LinkedIn ↗
          </a>
        </div>
      </Reveal>
    </section>
  );
}
