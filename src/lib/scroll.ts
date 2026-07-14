import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Live scroll physics shared with visual layers (read-only elsewhere). */
export const scrollState = { velocity: 0 };

export function useSmoothScroll(): void {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    });

    lenis.on('scroll', (e: { velocity: number }) => {
      scrollState.velocity = e.velocity;
      ScrollTrigger.update();
    });

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // ScrollTrigger caches each trigger's start/end as absolute scroll offsets.
    // The page keeps growing after those are measured — screenshots and logos
    // load in, fonts swap — so every offset below the growth ends up short, and
    // near the bottom of the page a reveal can decide it has been scrolled past
    // and hide itself again. Re-measure whenever the document changes height.
    let lastHeight = document.documentElement.scrollHeight;
    let refreshFrame = 0;
    const ro =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(() => {
            const height = document.documentElement.scrollHeight;
            if (height === lastHeight) return;
            lastHeight = height;
            // A refresh re-measures every trigger on the page, so it is not
            // something to run once per image that lands. Images arrive in
            // bursts; collapse a burst into one refresh on the next frame.
            if (refreshFrame) return;
            refreshFrame = requestAnimationFrame(() => {
              refreshFrame = 0;
              ScrollTrigger.refresh();
            });
          });
    ro?.observe(document.body);

    return () => {
      cancelAnimationFrame(refreshFrame);
      ro?.disconnect();
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);
}
