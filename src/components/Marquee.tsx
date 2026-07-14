import { useEffect, useRef } from 'react';

/**
 * Full-bleed section header: the section's name at display scale, repeating off
 * both edges, with a single filled word per repeat and the rest outlined.
 *
 * The scroll is the only thing that moves it: no drift while the page is still,
 * and scrolling back up runs the words back the way they came.
 *
 * The rate is measured off the ABOUT ME band on mauriciojuba.com — the section
 * the reference was actually about. Note his bands are not all the same: the
 * FEATURED WORK one auto-drifts at ~196 px/s and ignores the scroll entirely,
 * which is a different effect. Don't take a reading off that one.
 */
const TRAVEL_PER_PX = 1.34;
/**
 * Where on screen the band starts moving, as a share of viewport height. Below
 * this line it is held at zero offset, so the phrase reads whole — ABOUT ME, not
 * OUT ME ABOU — before it starts to slide.
 */
const ANCHOR_VH = 0.85;

export function Marquee({ text, className = '' }: { text: string; className?: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const group = groupRef.current;
    if (!track || !group) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let groupWidth = group.offsetWidth;
    const ro = new ResizeObserver(() => {
      groupWidth = group.offsetWidth;
    });
    ro.observe(group);

    let raf = 0;
    let inView = true;

    const frame = () => {
      raf = 0;
      if (!inView) return;

      // Travel is a function of where the band sits on screen, so scrolling back
      // up returns it exactly to where it started rather than drifting away.
      const risen = window.innerHeight * ANCHOR_VH - track.getBoundingClientRect().top;
      let offset = Math.max(0, risen) * TRAVEL_PER_PX;

      // Wrap into [0, groupWidth): the track carries two identical groups, so a
      // shift of one group's width is indistinguishable from no shift at all.
      if (groupWidth > 0) offset %= groupWidth;

      track.style.transform = `translate3d(${-offset}px, 0, 0)`;
      raf = requestAnimationFrame(frame);
    };
    const play = () => {
      if (!raf && inView) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) play();
    });
    io.observe(track);
    play();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  // The reference fills exactly one word per repeat and outlines the rest —
  // ABOUT hollow, ME solid — so the band reads as one phrase with an accent
  // rather than a wall of colour. Filling whole repeats, as this used to, made
  // every second phrase shout.
  const words = text.split(' ');

  const phrase = (i: number) => (
    // font-display, explicitly: with no family of its own the band inherits the
    // body face, which is Poppins now — and Poppins is not what these bands are.
    <span
      key={i}
      className="flex shrink-0 items-center whitespace-nowrap font-display font-black uppercase leading-none tracking-tight"
    >
      {words.map((word, w) => (
        <span
          key={w}
          className="mr-[0.18em]"
          style={
            w === words.length - 1
              ? { color: '#39FF8A' }
              : { color: 'transparent', WebkitTextStroke: '2px rgba(57,255,138,0.45)' }
          }
        >
          {word}
        </span>
      ))}
    </span>
  );

  // Two identical groups: the track scrolls one group's width, then wraps, so
  // the seam is never visible.
  const group = (key: string) => (
    <div ref={key === 'a' ? groupRef : undefined} className="flex shrink-0 items-center">
      {[0, 1, 2, 3].map(phrase)}
    </div>
  );

  // Deliberately no w-full: it would pin the width to the parent's content box,
  // and the -mx-6 the sections pass in would only shift the band rather than
  // widen it. Auto width + negative margins is what reaches the viewport edges.
  return (
    <div
      aria-hidden
      className={`pointer-events-none select-none overflow-hidden text-[13vw] ${className}`}
    >
      <div ref={trackRef} className="flex w-max">
        {group('a')}
        {group('b')}
      </div>
    </div>
  );
}
