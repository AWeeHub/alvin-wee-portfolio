import { useEffect, useRef } from 'react';

const SECTIONS = [
  { id: 'hero', label: '00 — TRIGGER' },
  { id: 'problem', label: '01 — CONDITION' },
  { id: 'services', label: '02 — STACK' },
  { id: 'about', label: '03 — ABOUT' },
  { id: 'case-studies', label: '04 — PROOF' },
  { id: 'contact', label: '05 — CONTACT' },
];

/**
 * The one piece of persistent chrome: a bar along the bottom naming the section
 * you're in. The readouts that used to sit beside it — scroll position, cursor
 * odometer, theme swatch, clock — were instrumentation for its own sake.
 *
 * The label is written straight to a ref inside one rAF loop. Holding it in
 * React state would re-render the tree on every frame of a scroll.
 */
export function StatusBar() {
  const sectionRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf = 0;
    const frame = () => {
      // The last section whose top has passed the middle of the screen — which
      // keeps the final label ("05 — GOAL") in place all the way through the
      // footer, rather than blanking once you scroll past the section itself.
      const mid = window.innerHeight / 2;
      let active = SECTIONS[0];
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= mid) active = s;
      }
      if (sectionRef.current) sectionRef.current.textContent = active.label;

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 hidden items-center justify-center border-t border-white/10 bg-bg/80 px-6 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted backdrop-blur-sm tabular-nums md:flex"
    >
      <span ref={sectionRef} className="font-bold text-text">
        00 — TRIGGER
      </span>
    </div>
  );
}
