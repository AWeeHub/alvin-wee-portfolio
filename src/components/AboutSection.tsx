import { useEffect, useRef } from 'react';
import { DitherPortrait } from './DitherPortrait';
import { Marquee } from './Marquee';
import { Reveal } from './Reveal';
import { ScrollHighlightText } from './ScrollHighlightText';
import { SectionHeading } from './SectionHeading';
import { ToolStack } from './ToolStack';

const COPY = [
  "I'm Alvin Wee, a Digital Experience Designer specializing in high-converting websites, landing pages, funnels, and CRM automation.",
  'With a background in IT implementation, operations, and marketing systems, I combine strategy, design, and technology to create digital experiences that are both visually engaging and results-driven.',
  'From crafting premium user interfaces to building automated workflows, my focus is always the same: helping businesses attract, convert, and grow.',
  "I believe great design isn't just about how it looks — it's about creating experiences that solve real problems and deliver measurable results.",
];

/** Scroll distance the pinned panel holds for, per paragraph. */
const HOLD_VH = 45;

/** What the heading and the toolkit keep clear of the pinned panel, in px.
 *  HEAD_GAP is measured against the track, which carries the sticky box's own
 *  padding — the gap you actually see above the portrait comes out ~24px under
 *  it. */
const HEAD_GAP = 84;
const TOOL_GAP = 70;

export function AboutSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLElement>(null);
  const toolkitRef = useRef<HTMLDivElement>(null);

  /**
   * The centred pin leaves (viewport - panel) / 2 of air above and below the
   * panel, so the heading and the toolkit would otherwise sit a screen away from
   * it. Spending that air back is what closes the gaps — but the air is not a
   * constant: it shrinks with the window AND with the panel, which itself grows
   * taller as the column narrows and the copy wraps. Every fixed value tried
   * here (px, then vh) held on one viewport and collided on another.
   *
   * So the offsets are measured, not guessed: read the panel, spend the air it
   * actually leaves, and keep the two gaps above fixed on any screen.
   */
  useEffect(() => {
    const track = trackRef.current;
    const panel = panelRef.current;
    const caption = captionRef.current;
    const toolkit = toolkitRef.current;
    if (!track || !panel || !caption || !toolkit) return;

    const apply = () => {
      // Below lg the panel is top-pinned, not centred: there is no air to spend.
      if (!window.matchMedia('(min-width: 1024px)').matches) {
        track.style.marginTop = '';
        toolkit.style.marginTop = '';
        return;
      }
      const air = (window.innerHeight - panel.offsetHeight) / 2;
      track.style.marginTop = `${-Math.max(0, air - HEAD_GAP)}px`;

      // The caption is not always the panel's lowest edge — when the copy column
      // is the taller of the two, the panel bottom sits below it.
      const below = panel.getBoundingClientRect().bottom - caption.getBoundingClientRect().bottom;
      toolkit.style.marginTop = `${TOOL_GAP - Math.max(0, air) - below}px`;
    };

    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(panel);
    window.addEventListener('resize', apply);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', apply);
    };
  }, []);

  return (
    <section id="about" className="bg-bg">
      <Marquee text="About me" className="mb-xl" />

      {/* Desktop needs no gap of its own: the panel below centres itself in the
          viewport, and the effect above spends that air down to HEAD_GAP. Below
          lg there is no pin and no air, so the gap has to be real padding. */}
      <div className="px-gutter pb-2xl lg:pb-0">
        <Reveal className="mx-auto max-w-shell-text">
          <SectionHeading
            title={
              <>
                Great design isn't how it looks. It's what it{' '}
                <span className="font-black text-accent">does</span>.
              </>
            }
          />
        </Reveal>
      </div>

      {/* The panel holds still while this track scrolls past it, and the track's
          progress is what lights the copy — so the words come up in reading order
          under a portrait that never moves. The sticky box is a full-viewport
          flex row so the panel sits centred while it's held, rather than clinging
          to the top of the screen. */}
      {/* The pull-up that closes the gap to the heading is set in the effect
          above — it depends on the panel, which only the layout knows. */}
      <div
        ref={trackRef}
        className="relative px-gutter"
        style={{ height: `calc(100vh + ${COPY.length * HOLD_VH}vh)` }}
      >
        {/* Below lg the stacked panel is taller than the viewport, so centring it
            would push its top under the header with no way to scroll back to it —
            there it keeps the old top pin. */}
        <div className="sticky top-[clamp(4.5rem,9vh,7rem)] pb-md lg:top-0 lg:flex lg:min-h-screen lg:items-center lg:py-lg">
          <div
            ref={panelRef}
            className="mx-auto grid w-full max-w-shell-text items-start gap-lg lg:grid-cols-[0.8fr_1.2fr]"
          >
            <figure className="relative mx-auto w-full max-w-[min(15rem,60vw)] lg:mx-0 lg:max-w-none">
              <div className="absolute inset-x-4 bottom-0 top-10 -z-10 rounded-t-full bg-accent/10 blur-2xl" />
              {/* Aspect matches the source file, so the dither canvas — which
                  stretches to the box — lands exactly on the photo underneath it
                  instead of drifting off a letterboxed edge. */}
              <div className="aspect-[760/804] w-full">
                <DitherPortrait src="/about-portrait.webp" alt="Alvin Wee" flip />
              </div>
              <figcaption
                ref={captionRef}
                className="mt-sm border-t border-white/10 pt-xs font-mono text-label uppercase tracking-[0.25em] text-muted"
              >
                Remote, worldwide
              </figcaption>
            </figure>

            {/* Small top offset only: the copy is meant to start near the top of
                the portrait, not halfway down it. */}
            <div className="flex flex-col gap-sm lg:pt-2">
              {COPY.map((paragraph, i) => (
                <ScrollHighlightText
                  key={paragraph}
                  driver={trackRef}
                  // Each paragraph owns a slice of the track, so they light one
                  // after another instead of all at once.
                  range={[i / COPY.length, (i + 1) / COPY.length]}
                  className={
                    i === COPY.length - 1
                      ? 'border-l-2 border-accent pl-sm font-sans text-body text-text'
                      : 'font-sans text-body text-text'
                  }
                >
                  {paragraph}
                </ScrollHighlightText>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trailing side of the same pin — offset set in the effect above. */}
      <div ref={toolkitRef} className="overflow-hidden px-gutter pb-2xl">
        <Reveal className="mx-auto max-w-shell-text">
          <p className="font-mono text-label uppercase tracking-[0.3em] text-muted">
            My toolkit
          </p>
          <ToolStack />
        </Reveal>
      </div>
    </section>
  );
}
