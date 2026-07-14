import { whatsappUrl, mailtoUrl } from '../lib/contact';
import { Magnetic } from './Magnetic';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';
import { Marquee } from './Marquee';

export function ContactSection() {
  return (
    // The bottom padding is deliberately short: the footer is the last thing on
    // the page, and with a taller gap the "Stop chasing" heading has already
    // scrolled off by the time you reach it.
    // Band opens the section, like About — see ProblemSection.
    <section id="contact" className="bg-bg-elev px-gutter pb-xl text-center">
      <Marquee text="Get in touch" className="-mx-gutter mb-xl" />
      <Reveal className="mx-auto flex max-w-shell-text flex-col items-center">
        <SectionHeading
          align="center"
          title={
            <>
              Stop chasing. Start{' '}
              <span className="font-black text-accent">booking</span>.
            </>
          }
        />
        <p className="mt-sm max-w-[46ch] font-sans text-lead text-muted">
          Tell me what's slowing your leads down — I'll tell you what to
          automate first.
        </p>
        {/* Wraps by content, not by breakpoint: the buttons sit side by side
            wherever two of them fit and stack when they don't. */}
        <div className="mt-lg flex flex-wrap items-center justify-center gap-xs">
          <Magnetic>
            <a
              href={whatsappUrl("Hi Alvin, I'd like to talk about a GoHighLevel system.")}
              target="_blank"
              rel="noreferrer"
              className="block rounded-full bg-accent px-md py-xs font-sans text-micro uppercase tracking-widest text-bg transition duration-300 hover:bg-accent-dim"
            >
              Message on WhatsApp
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href={mailtoUrl()}
              className="block rounded-full border border-accent px-md py-xs font-sans text-micro uppercase tracking-widest text-accent transition duration-300 hover:bg-accent hover:text-bg"
            >
              Email me
            </a>
          </Magnetic>
        </div>
      </Reveal>
    </section>
  );
}
