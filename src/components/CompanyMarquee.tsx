import { useEffect, useRef, useState } from 'react';
import { companies } from '../data/about';

/**
 * Client logos directly under the hero, riding an endless marquee.
 *
 * The track carries the list several times over and slides by exactly one copy
 * per cycle, so the next copy lands where the last one started and the loop has
 * no seam. Two copies is the minimum, but two is not always enough: zoom out far
 * enough (or open this on a very wide screen) and the viewport grows past the
 * width of both copies, which would leave the band visibly cut with empty space
 * running through it. So the copy count is measured, not assumed.
 */
/**
 * Every mark gets the same box and is fitted inside it, by request.
 *
 * Same *height* for all of them is not the same thing: a bare wordmark like
 * ORACLE is ~8x as wide as it is tall, so at a crest's height it runs several
 * hundred px wide and swamps the band. A shared box normalises the footprint —
 * wide marks land width-first, tall ones height-first, and none dominates.
 */
const LOGO_BOX = {
  height: 'clamp(2rem, 2.8vw, 3.5rem)',
  width: 'clamp(6.5rem, 9.5vw, 12rem)',
} as const;

function Lane({
  duplicate,
  innerRef,
}: {
  duplicate?: boolean;
  innerRef?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={innerRef}
      className="flex shrink-0 items-center"
      aria-hidden={duplicate || undefined}
    >
      {companies.map((company) => (
        <span key={company.name} className="flex items-center">
          <img
            src={company.logo}
            // The duplicates are decorative — announcing every company several
            // times over is what the aria-hidden lanes are there to prevent.
            alt={duplicate ? '' : company.name}
            // Not lazy: the copies sit off the right edge of the track, so a
            // lazy loader never fetches them, and a lane whose images never load
            // collapses to a fraction of its width — which is the gap the copy
            // count exists to prevent. They are the same six files as the first
            // lane, so this costs nothing beyond a cache hit.
            decoding="async"
            fetchPriority="low"
            style={LOGO_BOX}
            className="max-w-none object-contain opacity-90"
          />
          <span
            aria-hidden
            className="mx-[clamp(1.6rem,4vw,3.25rem)] inline-block h-2 w-2 rotate-45 bg-accent"
          />
        </span>
      ))}
    </div>
  );
}

export function CompanyMarquee() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const laneRef = useRef<HTMLDivElement>(null);
  const [copies, setCopies] = useState(2);

  useEffect(() => {
    const viewport = viewportRef.current;
    const lane = laneRef.current;
    if (!viewport || !lane) return;

    const measure = () => {
      const laneWidth = lane.getBoundingClientRect().width;
      // The logos are lazy-loaded, so the lane is briefly narrower than it will
      // end up. Re-measuring on its resize is what catches the final width.
      if (laneWidth <= 0) return;
      const viewportWidth = viewport.getBoundingClientRect().width;
      // One spare copy beyond what the viewport can show: the track is mid-slide
      // for most of the cycle, so the trailing edge needs somewhere to go.
      setCopies(Math.max(2, Math.ceil(viewportWidth / laneWidth) + 1));
    };

    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(viewport);
    ro.observe(lane);
    return () => ro.disconnect();
  }, []);

  return (
    <section aria-label="Some of the companies I've worked with" className="bg-bg">
      {/* Hairlines rather than a colour change: the band still reads as its own
          register on the page, but the ground stays black so the logos keep
          their real colours instead of being flipped to fit a light plate. */}
      <div className="overflow-hidden border-y border-white/10 pb-xl pt-md">
        {/* Brand face, like the rest of the chrome labels. */}
        <p className="px-gutter text-center font-mono text-label font-light uppercase tracking-[0.22em] text-muted">
          Some of the companies I&apos;ve worked with
        </p>

        <div
          ref={viewportRef}
          className="logo-marquee mt-md overflow-hidden"
        >
          {/* One copy's width as a share of the whole track — the exact distance
              that makes the loop seamless, whatever the copy count is. */}
          <div
            className="logo-marquee-track flex w-max items-center"
            style={{ '--marquee-shift': `${-100 / copies}%` } as React.CSSProperties}
          >
            {Array.from({ length: copies }, (_, i) => (
              <Lane
                key={i}
                duplicate={i > 0}
                innerRef={i === 0 ? laneRef : undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
