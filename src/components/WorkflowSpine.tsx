import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const NODES = [
  { id: 'hero', label: '00 / TRIGGER' },
  { id: 'problem', label: '01 / CONDITION' },
  { id: 'solution', label: '02 / ACTION' },
  { id: 'services', label: '03 / STACK' },
  { id: 'case-studies', label: '04 / PROOF' },
  { id: 'process', label: '05 / SEQUENCE' },
  { id: 'contact', label: '06 / GOAL' },
];

export function WorkflowSpine() {
  const fillRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const fill = fillRef.current;
    if (!fill) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        fill,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
        }
      );
    });

    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = window.innerHeight / 2;
      let index = 0;
      NODES.forEach(({ id }, i) => {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= mid) index = i;
      });
      setActive(index);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, []);

  return (
    <aside
      aria-hidden
      className="pointer-events-none fixed inset-y-0 left-6 z-40 hidden w-6 flex-col items-center lg:flex"
    >
      <div className="relative mb-8 mt-24 w-px flex-1 bg-white/10">
        <div
          ref={fillRef}
          className="absolute inset-0 origin-top bg-accent"
          style={{ transform: 'scaleY(0)' }}
        />
      </div>
      <p className="mb-10 font-mono text-[10px] uppercase tracking-[0.3em] text-muted [writing-mode:vertical-rl]">
        {NODES[active].label}
      </p>
    </aside>
  );
}
