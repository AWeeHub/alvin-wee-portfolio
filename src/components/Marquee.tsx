import { useEffect, useRef } from 'react';
import { scrollState } from '../lib/scroll';

/**
 * Full-bleed section header: one word at display scale, running off both edges,
 * alternating solid and outlined. It runs continuously, and scroll speed adds
 * to it — the page reacts to how fast you move through it without ever going
 * still.
 */
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
    let last = performance.now();
    // Integrated, like the spine packets: changing speed changes the rate
    // without teleporting the track.
    let offset = 0;

    const frame = (now: number) => {
      raf = 0;
      if (!inView) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      // The band has to read as moving on its own, not only when the page does:
      // at rest it drifts at a steady clip, and scrolling only adds to that.
      const boost = Math.min(Math.abs(scrollState.velocity) / 30, 1);
      offset += dt * (160 + 220 * boost);
      if (groupWidth > 0) offset %= groupWidth;

      track.style.transform = `translate3d(${-offset}px, 0, 0)`;
      raf = requestAnimationFrame(frame);
    };
    const play = () => {
      if (!raf && inView) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      last = performance.now();
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

  // Two identical groups: the track scrolls one group's width, then wraps, so
  // the seam is never visible.
  const group = (key: string) => (
    <div ref={key === 'a' ? groupRef : undefined} className="flex shrink-0 items-center">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="whitespace-nowrap px-[0.12em] font-black uppercase leading-none tracking-tight"
          style={
            i % 2 === 0
              ? { color: '#39FF8A' }
              : {
                  color: 'transparent',
                  WebkitTextStroke: '1px rgba(57,255,138,0.45)',
                }
          }
        >
          {text}
        </span>
      ))}
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
