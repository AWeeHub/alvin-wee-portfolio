import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { services } from '../data/services';
import { SectionHeading } from './SectionHeading';
import { Marquee } from './Marquee';

gsap.registerPlugin(ScrollTrigger);

/** Scroll distance the pinned panel holds for, per service. */
const HOLD_VH = 55;
/** Per-word delay of the hover sweep, in ms — same cadence as the Symptoms rows. */
const WORD_STEP = 22;

const DESKTOP = '(min-width: 1280px)';

export function ServicesGrid() {
  const trackRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Nothing is open until it is asked for, on any screen. The pane's column is
  // still reserved, so it appears in place instead of shoving the list sideways.
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const rows = rowRefs.current.filter(Boolean) as HTMLDivElement[];
    const settle = (row: HTMLDivElement) => {
      row.style.opacity = '1';
      row.style.transform = 'none';
    };

    // The deal-out belongs to the pinned panel, and the panel is desktop-only.
    // Below lg the section is an ordinary stacked list — see the note on the
    // track below — so the rows simply sit where they are.
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !window.matchMedia(DESKTOP).matches
    ) {
      rows.forEach(settle);
      return;
    }

    // The panel stays put (position: sticky) while the track scrolls past it,
    // and the track's progress is what deals the rows out one at a time. Driving
    // the styles from progress rather than from one-shot triggers means the list
    // rewinds cleanly when you scroll back up.
    const st = ScrollTrigger.create({
      trigger: track,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: ({ progress }) => {
        rows.forEach((row, i) => {
          // Each row owns a slice of the scroll, and the slices overlap slightly
          // so the next one starts moving before the last has fully landed.
          const span = 1 / rows.length;
          const t = Math.max(0, Math.min(1, (progress - i * span * 0.92) / (span * 0.75)));
          const eased = t * t * (3 - 2 * t);
          row.style.opacity = String(eased);
          row.style.transform = `translate3d(0, ${(1 - eased) * 28}px, 0)`;
        });
      },
    });

    return () => st.kill();
  }, []);

  const active = open === null ? null : services[open];

  return (
    <section id="services" className="bg-bg">
      <Marquee text="The build" className="mb-xl" />

      {/* The pin starts at xl, not lg. A pinned panel has to fit inside the
          viewport — one taller than the screen slides its own top out of view —
          and below 1280 there is no room for a column beside the list: the split
          would narrow the rows until their descriptions wrap, which is exactly
          the height the pin cannot afford. So under xl this is an ordinary
          section — the detail opens under its own row, and nothing is pinned. */}
      <div
        ref={trackRef}
        className="relative px-gutter xl:h-[var(--stack-track)]"
        style={
          {
            '--stack-track': `calc(100vh + ${services.length * HOLD_VH}vh)`,
          } as React.CSSProperties
        }
      >
        <div className="mx-auto max-w-shell-text pb-2xl xl:sticky xl:top-[clamp(3.5rem,7vh,6rem)] xl:pb-sm">
          {/* Deliberately not wrapped in <Reveal>: it hides its children again
              once their natural position leaves the viewport, and a pinned panel
              is still on screen long after that. SectionHeading carries its own
              entrance. */}
          <SectionHeading
            title={
              <>
                Five things I build. One{' '}
                <span className="font-black text-accent">machine</span> when combined.
              </>
            }
          />

          {/* Closed, this is the original full-width list. Open, it splits into
              list + detail beside it. The rows are one line of type each either
              way, so the list is the same height in both states and the detail
              is shorter than it — which is what keeps the pinned panel from
              resizing under the cursor when you click. */}
          <div
            className={`mt-md grid gap-lg xl:items-start ${
              active ? 'xl:grid-cols-[1.05fr_0.95fr]' : 'xl:grid-cols-1'
            }`}
          >
            <div className="border-t border-white/10">
              {services.map(({ label, desc, icon: Icon, summary, includes, outcome }, i) => {
                const words = desc.split(' ');
                const isOpen = open === i;
                return (
                  // Same hover gesture as the Symptoms rows: accent title, rule
                  // sweeping in under it, sentence lighting word by word.
                  <div
                    key={label}
                    ref={(el) => {
                      rowRefs.current[i] = el;
                    }}
                    className="cost-row group border-b border-white/10"
                    style={{ opacity: 0, transform: 'translate3d(0, 28px, 0)' }}
                  >
                    {/* A real button now. The arrow at the end used to promise a
                        click target that did not exist. */}
                    <button
                      type="button"
                      onClick={() => setOpen(i)}
                      aria-expanded={isOpen}
                      aria-controls={`service-detail-${i}`}
                      className="flex w-full items-center gap-sm py-xs text-left"
                    >
                      <Icon
                        className={`h-[1.4em] w-[1.4em] shrink-0 transition-colors duration-300 group-hover:text-accent ${
                          isOpen ? 'text-accent' : 'text-muted'
                        }`}
                        aria-hidden="true"
                      />
                      <span className="flex-1">
                        {/* Same brand face as the Symptoms rows — the two lists
                            are the same gesture and should read as a pair. */}
                        <span
                          className={`cost-title block font-logo text-row transition-[color,transform] duration-300 group-hover:translate-x-2 ${
                            isOpen ? 'text-accent' : 'text-text'
                          }`}
                        >
                          {label}
                        </span>
                        <span className="mt-2xs block font-sans text-micro text-text transition-transform duration-300 group-hover:translate-x-2">
                          {words.map((word, w) => (
                            <span
                              // eslint-disable-next-line react/no-array-index-key -- words repeat; position is the identity
                              key={w}
                              className="cost-word"
                              style={{ transitionDelay: `${w * WORD_STEP}ms` }}
                            >
                              {word}
                              {w < words.length - 1 ? ' ' : ''}
                            </span>
                          ))}
                        </span>
                      </span>
                      {/* Rotates to point at the detail rather than off the edge
                          — transform only, like everything else here. */}
                      <span
                        aria-hidden
                        className={`shrink-0 font-mono text-lead transition duration-300 ${
                          isOpen
                            ? 'rotate-90 text-accent opacity-100 xl:rotate-0'
                            : '-translate-x-2 text-accent opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                        }`}
                      >
                        →
                      </span>
                    </button>

                    {/* Below xl the detail lives under the row it belongs to.
                        Nothing is pinned here, so it is free to take the height. */}
                    <div id={`service-detail-${i}`} className="xl:hidden">
                      {isOpen && (
                        <ServiceDetail
                          summary={summary}
                          includes={includes}
                          outcome={outcome}
                          className="pb-md"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop: the column is always reserved, but there is no card in it
                until a service is picked — so the card appears where you are
                looking instead of the list jumping sideways to make room. The
                floor keeps the panel's height from changing between services; a
                pinned panel that resizes under the cursor is the thing to avoid. */}
            {/* No second column at all until a service is picked — the list is
                full width, exactly as it was. */}
            {active && (
              <div
                key={active.label}
                className="hidden rounded-2xl border border-white/10 bg-bg-elev p-md xl:block"
              >
                <ServiceDetail
                  summary={active.summary}
                  includes={active.includes}
                  outcome={active.outcome}
                  heading={active.label}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * The offer, explained — never a case study. No client name appears here: a
 * service that cites one project reads as a one-off rather than as something
 * you can buy. The proof lives in Featured Work.
 */
function ServiceDetail({
  summary,
  includes,
  outcome,
  heading,
  className = '',
}: {
  summary: string;
  includes: string[];
  outcome: string;
  heading?: string;
  className?: string;
}) {
  return (
    // animate-fade-up is opacity + translate — the pane changes content, never
    // its size.
    <div className={`animate-fade-up ${className}`}>
      {heading && (
        <p className="font-mono text-label uppercase tracking-[0.22em] text-accent">{heading}</p>
      )}

      {/* What it actually is, before the list of parts. */}
      <p
        className={`font-sans text-micro leading-relaxed text-text ${heading ? 'mt-sm' : 'mt-2xs'}`}
      >
        {summary}
      </p>

      <p className="mt-md font-mono text-label uppercase tracking-[0.22em] text-muted">
        What you get
      </p>
      <ul className="mt-xs space-y-xs">
        {includes.map((line) => (
          <li key={line} className="flex gap-xs font-sans text-micro leading-relaxed text-text">
            <span aria-hidden className="mt-[0.55em] h-1 w-1 shrink-0 bg-accent" />
            {line}
          </li>
        ))}
      </ul>

      <p className="mt-md border-l-2 border-accent pl-xs font-sans text-micro leading-relaxed text-muted">
        {outcome}
      </p>
    </div>
  );
}
