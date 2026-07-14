import { useEffect, useRef } from 'react';

const ACCENT = '#39FF8A';

const SECTIONS = [
  { id: 'hero', label: '00 — TRIGGER' },
  { id: 'problem', label: '01 — CONDITION' },
  { id: 'solution', label: '02 — ACTION' },
  { id: 'services', label: '03 — STACK' },
  { id: 'case-studies', label: '04 — PROOF' },
  { id: 'process', label: '05 — SEQUENCE' },
  { id: 'contact', label: '06 — GOAL' },
];

/**
 * Persistent instrument chrome along the bottom of the viewport: scroll
 * position, cursor travel, the section you're in, the theme colour, and a live
 * clock. Reads as a machine you're operating rather than a page you're reading
 * — which is the whole positioning ("I build systems").
 *
 * Everything updates by writing to DOM refs inside one rAF loop. Putting these
 * in React state would re-render the tree on every mouse move.
 */
export function StatusBar() {
  const scrollRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const sectionRef = useRef<HTMLSpanElement>(null);
  const clockRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Total distance the cursor has travelled, the way a mouse odometer would
    // read it — a number that only ever climbs, so it always looks live.
    let travel = 0;
    let lastX: number | null = null;
    let lastY: number | null = null;

    const onMove = (e: PointerEvent) => {
      if (lastX !== null && lastY !== null) {
        travel += Math.hypot(e.clientX - lastX, e.clientY - lastY);
      }
      lastX = e.clientX;
      lastY = e.clientY;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    const tz = -new Date().getTimezoneOffset() / 60;
    const tzLabel = `${tz >= 0 ? '+' : '-'}${String(Math.abs(tz)).padStart(2, '0')}`;

    let raf = 0;
    const frame = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      if (scrollRef.current) scrollRef.current.textContent = progress.toFixed(2);

      if (cursorRef.current) cursorRef.current.textContent = travel.toFixed(3);

      const mid = window.innerHeight / 2;
      let active = SECTIONS[0];
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= mid) active = s;
      }
      if (sectionRef.current) sectionRef.current.textContent = active.label;

      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      if (clockRef.current) clockRef.current.textContent = `${hh}:${mm}:${ss} ${tzLabel}`;

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 hidden items-center justify-between border-t border-white/10 bg-bg/80 px-6 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted backdrop-blur-sm tabular-nums md:flex"
    >
      <div className="flex gap-6">
        <span>
          SCRL <span ref={scrollRef} className="font-bold text-text">0.00</span>
        </span>
        <span>
          CRSR <span ref={cursorRef} className="font-bold text-text">0.000</span>
        </span>
      </div>

      <span ref={sectionRef} className="font-bold text-text">
        00 — TRIGGER
      </span>

      <div className="flex items-center gap-6">
        <span className="flex items-center gap-2">
          THEME
          <span className="inline-block h-2 w-2" style={{ backgroundColor: ACCENT }} />
          <span className="font-bold text-text">{ACCENT}</span>
        </span>
        <span ref={clockRef} className="font-bold text-text">
          00:00:00
        </span>
      </div>
    </div>
  );
}
