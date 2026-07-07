import { useEffect, useRef, useState } from 'react';

const SCALE = { base: 1, link: 1.5, view: 2.6 } as const;

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (fine && !reduced) setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    document.documentElement.classList.add('has-custom-cursor');

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let rx = tx;
    let ry = ty;
    let scale = 1;
    let targetScale: number = SCALE.base;
    let pressed = false;
    let visible = false;
    let raf = 0;

    const setVisible = (v: boolean) => {
      visible = v;
      const o = v ? '1' : '0';
      dot.style.opacity = o;
      ring.style.opacity = o;
    };

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!visible) {
        rx = tx;
        ry = ty;
        setVisible(true);
      }
    };

    const onOver = (e: PointerEvent) => {
      const t = e.target instanceof Element ? e.target : null;
      if (t?.closest('[data-cursor="view"]')) {
        targetScale = SCALE.view;
        label.style.opacity = '1';
      } else if (t?.closest('a, button, [role="button"]')) {
        targetScale = SCALE.link;
        label.style.opacity = '0';
      } else {
        targetScale = SCALE.base;
        label.style.opacity = '0';
      }
    };

    const onDown = () => {
      pressed = true;
    };
    const onUp = () => {
      pressed = false;
    };
    const onLeaveWindow = () => setVisible(false);

    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('pointerdown', onDown, { passive: true });
    document.addEventListener('pointerup', onUp, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeaveWindow);

    const loop = () => {
      rx += (tx - rx) * 0.18;
      ry += (ty - ry) * 0.18;
      const s = targetScale * (pressed ? 0.85 : 1);
      scale += (s - scale) * 0.2;
      dot.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) scale(${scale})`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerup', onUp);
      document.documentElement.removeEventListener('mouseleave', onLeaveWindow);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90]">
      <div
        ref={ringRef}
        className="absolute left-0 top-0 -ml-[18px] -mt-[18px] flex h-9 w-9 items-center justify-center rounded-full border border-white/30 opacity-0"
      >
        <span
          ref={labelRef}
          className="font-mono text-[8px] uppercase tracking-[0.2em] text-accent opacity-0 transition-opacity duration-200"
        >
          View
        </span>
      </div>
      <div
        ref={dotRef}
        className="absolute left-0 top-0 -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-accent opacity-0"
      />
    </div>
  );
}
