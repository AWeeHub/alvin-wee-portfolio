import { useEffect, useRef, type ReactNode } from 'react';

type MagneticProps = {
  children: ReactNode;
  strength?: number;
  className?: string;
};

export function Magnetic({ children, strength = 0.25, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
    };
    const onLeave = () => {
      el.style.transform = 'translate(0px, 0px)';
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      el.style.transform = '';
    };
  }, [strength]);

  return (
    <div
      ref={ref}
      className={`transition-transform duration-300 ease-out ${className ?? ''}`}
    >
      {children}
    </div>
  );
}
