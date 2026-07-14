import { useEffect, useRef, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Resting opacity of a word that hasn't been lit yet. 0.5 is the floor: below it
 * the text drops under 4.5:1 against the page and stops being readable at all
 * for anyone who needs the contrast — an unlit word is still a word someone may
 * be trying to read.
 */
const DIM = 0.5;

interface ScrollHighlightTextProps {
  children: string;
  className?: string;
  /**
   * Element whose scroll progress lights the words. Defaults to the text block
   * itself; pass a taller track when the text is pinned and can't move through
   * the viewport on its own.
   */
  driver?: RefObject<HTMLElement | null>;
  /**
   * Slice of the driver's progress this block owns, 0..1. Several blocks sharing
   * one pinned track each take a slice, so they light in sequence rather than
   * all at once.
   */
  range?: [number, number];
}

/**
 * Text that lights up word by word as you scroll through it: the words start
 * dim and reach full weight in reading order.
 *
 * Progress drives the styles directly rather than a one-shot tween, so the
 * sentence un-lights on the way back up instead of staying lit.
 */
export function ScrollHighlightText({
  children,
  className = '',
  driver,
  range = [0, 1],
}: ScrollHighlightTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [from, to] = range;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const words = Array.from(el.querySelectorAll<HTMLElement>('[data-word]'));
    if (words.length === 0) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      words.forEach((w) => {
        w.style.opacity = '1';
      });
      return;
    }

    const trigger = driver?.current ?? el;
    const usingDriver = trigger !== el;

    const paint = (progress: number) => {
      // Map the driver's whole progress onto this block's slice.
      const span = Math.max(to - from, 0.0001);
      const local = Math.max(0, Math.min(1, (progress - from) / span));

      words.forEach((word, i) => {
        const step = 1 / words.length;
        // Each word's window overlaps its neighbours, so the light sweeps the
        // line rather than snapping word to word.
        const t = Math.max(0, Math.min(1, (local - i * step * 0.85) / (step * 1.7)));
        word.style.opacity = String(DIM + (1 - DIM) * t);
      });
    };

    const st = ScrollTrigger.create({
      trigger,
      start: usingDriver ? 'top top' : 'top 82%',
      end: usingDriver ? 'bottom bottom' : 'bottom 55%',
      onUpdate: ({ progress }) => paint(progress),
    });
    paint(st.progress);

    return () => st.kill();
  }, [children, driver, from, to]);

  return (
    <p ref={ref} className={className}>
      {children.split(' ').map((word, i) => (
        // eslint-disable-next-line react/no-array-index-key -- words repeat; position is the identity
        <span key={i} data-word style={{ opacity: DIM }}>
          {word}
          {i < children.split(' ').length - 1 ? ' ' : ''}
        </span>
      ))}
    </p>
  );
}
