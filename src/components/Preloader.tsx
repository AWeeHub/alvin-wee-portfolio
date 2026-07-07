import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { AWeeLogo } from './AWeeLogo';

type PreloaderProps = {
  onComplete: () => void;
};

export function Preloader({ onComplete }: PreloaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) {
      setDone(true);
      completeRef.current();
      return;
    }

    // The intro sequence assumes we start at the top; disable the
    // browser's scroll restoration so a reload doesn't land mid-page.
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = 'hidden';

    const unlock = () => {
      html.style.overflow = prevOverflow;
    };

    const state = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        unlock();
        setDone(true);
      },
    });

    tl.to(state, {
      v: 100,
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (countRef.current) {
          countRef.current.textContent = String(Math.round(state.v)).padStart(3, '0');
        }
        if (barRef.current) {
          gsap.set(barRef.current, { scaleX: state.v / 100 });
        }
      },
    })
      .to(overlay, { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, '+=0.15')
      .add(() => completeRef.current(), '<+=0.25');

    return () => {
      tl.kill();
      unlock();
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-bg"
    >
      <AWeeLogo size="lg" />
      <div className="relative h-px w-56 overflow-hidden bg-white/10">
        <div
          ref={barRef}
          className="absolute inset-0 origin-left bg-accent"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
        <span ref={countRef} className="text-accent">
          000
        </span>{' '}
        / systems online
      </p>
    </div>
  );
}
