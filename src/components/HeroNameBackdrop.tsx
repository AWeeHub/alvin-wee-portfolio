import { useEffect, useRef } from 'react';

export function HeroNameBackdrop() {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      // Only matters while the hero is on screen.
      if (y < window.innerHeight * 1.5) {
        el.style.transform = `translateY(-50%) translateY(${y * 0.3}px)`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <p
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 select-none whitespace-nowrap text-center font-display text-[18vw] leading-none text-white/5"
    >
      AWEE DIGITAL
    </p>
  );
}
