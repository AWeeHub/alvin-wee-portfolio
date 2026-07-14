import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollState } from '../lib/scroll';

gsap.registerPlugin(ScrollTrigger);

/** Packets riding the rail: leads moving through the system, section to section. */
const PACKETS = [0, 1, 2, 3];

/**
 * The rail down the left edge: how far through the page you are, with packets
 * riding it. It used to name the current section too, but the bar along the
 * bottom already does that — one indicator, not two.
 */
export function WorkflowSpine() {
  const fillRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const packetRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let height = rail.clientHeight;
    const ro = new ResizeObserver(() => {
      height = rail.clientHeight;
    });
    ro.observe(rail);

    let raf = 0;
    let last = performance.now();
    // Accumulated travel rather than a function of elapsed time: scroll speed
    // changes the rate, and integrating it keeps the packets from jumping
    // position whenever the rate changes.
    let travel = 0;

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const boost = Math.min(Math.abs(scrollState.velocity) / 30, 1);
      travel += dt * (0.09 + 0.5 * boost);

      packetRefs.current.forEach((el, i) => {
        if (!el) return;
        const p = (travel + i / PACKETS.length) % 1;
        el.style.transform = `translateY(${p * height}px)`;
        el.style.opacity = String(Math.sin(p * Math.PI));
      });

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

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

    return () => ctx.revert();
  }, []);

  return (
    <aside
      aria-hidden
      className="pointer-events-none fixed inset-y-0 left-6 z-40 hidden w-6 flex-col items-center lg:flex"
    >
      <div ref={railRef} className="relative mb-8 mt-24 w-px flex-1 bg-white/10">
        <div
          ref={fillRef}
          className="absolute inset-0 origin-top bg-accent"
          style={{ transform: 'scaleY(0)' }}
        />
        {PACKETS.map((i) => (
          <div
            key={i}
            ref={(el) => {
              packetRefs.current[i] = el;
            }}
            className="absolute left-0 top-0 h-6 w-px bg-accent"
            style={{ opacity: 0, boxShadow: '0 0 6px #39FF8A' }}
          />
        ))}
      </div>
    </aside>
  );
}
