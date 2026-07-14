import { useEffect, useRef } from 'react';
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

export function ServicesGrid() {
  const trackRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const rows = rowRefs.current.filter(Boolean) as HTMLDivElement[];
    const settle = (row: HTMLDivElement) => {
      row.style.opacity = '1';
      row.style.transform = 'none';
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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

  return (
    <section id="services" className="bg-bg">
      <Marquee text="The build" className="mb-xl" />

      <div
        ref={trackRef}
        className="relative px-gutter"
        style={{ height: `calc(100vh + ${services.length * HOLD_VH}vh)` }}
      >
        {/* The panel has to fit inside the viewport, heading and all five rows:
            a sticky box taller than the screen slides its own top out of view,
            which would push the heading off exactly when the last row lands. */}
        <div className="sticky top-[clamp(3.5rem,7vh,6rem)] mx-auto max-w-shell-text pb-sm">
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

          <div className="mt-md border-t border-white/10">
            {services.map(({ label, desc, icon: Icon }, i) => {
              const words = desc.split(' ');
              return (
                // Same hover gesture as the Symptoms rows: accent title, rule
                // sweeping in under it, sentence lighting word by word.
                <div
                  key={label}
                  ref={(el) => {
                    rowRefs.current[i] = el;
                  }}
                  className="cost-row group flex items-center gap-sm border-b border-white/10 py-xs"
                  style={{ opacity: 0, transform: 'translate3d(0, 28px, 0)' }}
                >
                  <Icon
                    className="h-[1.4em] w-[1.4em] shrink-0 text-muted transition-colors duration-300 group-hover:text-accent"
                    aria-hidden="true"
                  />
                  <div className="flex-1">
                    {/* Same brand face as the Symptoms rows — the two lists are
                        the same gesture and should read as a pair. */}
                    <h3 className="cost-title font-logo text-row text-text transition-[color,transform] duration-300 group-hover:translate-x-2">
                      {label}
                    </h3>
                    <p className="mt-2xs font-sans text-micro text-text transition-transform duration-300 group-hover:translate-x-2">
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
                    </p>
                  </div>
                  <span
                    aria-hidden
                    className="-translate-x-2 font-mono text-lead text-accent opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                  >
                    →
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
