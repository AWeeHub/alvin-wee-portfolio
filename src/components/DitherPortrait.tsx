import { useEffect, useRef } from 'react';
import { scrollState } from '../lib/scroll';

/** Low-res buffer size. The canvas is CSS-scaled up with image-rendering:
 *  pixelated, so this number is literally the resolution of the portrait. */
const RES = 150;

/** Grey levels the image is quantised to after dithering. */
const LEVELS = 5;

/** Bayer 8x8 ordered-dither matrix, normalised to 0..1. */
const BAYER = [
  0, 32, 8, 40, 2, 34, 10, 42,
  48, 16, 56, 24, 50, 18, 58, 26,
  12, 44, 4, 36, 14, 46, 6, 38,
  60, 28, 52, 20, 62, 30, 54, 22,
  3, 35, 11, 43, 1, 33, 9, 41,
  51, 19, 59, 27, 49, 17, 57, 25,
  15, 47, 7, 39, 13, 45, 5, 37,
  63, 31, 55, 23, 61, 29, 53, 21,
].map((v) => (v + 0.5) / 64);

/**
 * The portrait, rendered as an ordered-dithered pixel grid rather than a photo.
 *
 * Deliberately not WebGL: the whole effect is a 150x150 buffer that the browser
 * upscales with image-rendering: pixelated, so a 2D canvas is both enough and
 * cheaper than a shader would be.
 *
 * A soft lens follows the cursor and lifts luminance locally, so more of the
 * face resolves where you're looking — the image reacts to being read.
 */
interface DitherPortraitProps {
  className?: string;
  src?: string;
  alt?: string;
  /**
   * Mirror the subject. The flip is baked into the source buffer and applied to
   * the photo with CSS, rather than transforming the wrapper — a transform on
   * the wrapper would mirror the canvas too, and the cursor lens would then
   * track the opposite side of the face from the one you're pointing at.
   */
  flip?: boolean;
}

export function DitherPortrait({
  className = '',
  src: source = '/portrait.webp',
  alt = 'Alvin Wee',
  flip = false,
}: DitherPortraitProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = RES;
    canvas.height = RES;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Source buffer: the photo drawn once at RES, read back as pixels. Redrawing
    // the image every frame would re-do the expensive downscale for nothing.
    const src = document.createElement('canvas');
    src.width = RES;
    src.height = RES;
    const srcCtx = src.getContext('2d', { willReadFrequently: true });
    if (!srcCtx) return;

    let pixels: Uint8ClampedArray | null = null;
    let raf = 0;
    let inView = true;
    let disposed = false;

    // Lens position in buffer coords, and where it's easing toward.
    const lens = { x: RES * 0.5, y: RES * 0.4 };
    const target = { x: lens.x, y: lens.y };
    let hasPointer = false;

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0) return;
      target.x = ((e.clientX - rect.left) / rect.width) * RES;
      target.y = ((e.clientY - rect.top) / rect.height) * RES;
      hasPointer = true;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const out = ctx.createImageData(RES, RES);
    const start = performance.now();

    const render = (t: number) => {
      if (!pixels) return;

      // Scroll speed widens the lens: the portrait resolves as you move.
      const vel = Math.min(Math.abs(scrollState.velocity) / 30, 1);
      const inner = RES * (0.11 + 0.09 * vel); // fully clear inside this
      const outer = RES * (0.21 + 0.13 * vel); // fully dithered outside this
      const intro = Math.min(1, t / 0.9);

      const data = out.data;
      for (let y = 0; y < RES; y++) {
        for (let x = 0; x < RES; x++) {
          const i = (y * RES + x) * 4;
          const a = pixels[i + 3];

          // Transparent background stays transparent — the dither only ever
          // covers the subject, so the page shows through around him.
          if (a < 128) {
            data[i + 3] = 0;
            continue;
          }

          const lum =
            (0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2]) / 255;

          const threshold = BAYER[(y & 7) * 8 + (x & 7)];
          // Ordered dither: nudge by the matrix, then quantise. The matrix is
          // what turns banding into texture. The gain lifts the face out of the
          // suit, which otherwise crushes to near-black at five levels.
          const v = lum * 1.18 - 0.5 / LEVELS;
          const q = Math.max(0, Math.min(LEVELS - 1, Math.round(v * (LEVELS - 1) + (threshold - 0.5))));
          const grey = Math.round((q / (LEVELS - 1)) * 255);

          // The lens dissolves the dither instead of brightening it, so the
          // sharp photo layered underneath shows through: he resolves where you
          // look. Doing it here — as alpha in the buffer we already write — is
          // free, where an animated CSS mask would repaint the element a frame.
          const d = Math.hypot(x - lens.x, y - lens.y);
          const e = Math.max(0, Math.min(1, (d - inner) / Math.max(outer - inner, 0.001)));
          const reveal = e * e * (3 - 2 * e); // smoothstep

          data[i] = grey;
          data[i + 1] = grey;
          data[i + 2] = grey;
          data[i + 3] = Math.round(255 * intro * reveal);
        }
      }
      ctx.putImageData(out, 0, 0);
    };

    const frame = (now: number) => {
      raf = 0;
      if (!inView || disposed) return;
      const t = (now - start) / 1000;

      if (!hasPointer) {
        // Idle drift, so touch devices still see the lens move.
        target.x = RES * (0.5 + 0.16 * Math.sin(t * 0.35));
        target.y = RES * (0.42 + 0.1 * Math.cos(t * 0.27));
      }
      lens.x += (target.x - lens.x) * 0.08;
      lens.y += (target.y - lens.y) * 0.08;

      render(t);
      raf = requestAnimationFrame(frame);
    };

    const play = () => {
      if (!raf && inView && !disposed && pixels) raf = requestAnimationFrame(frame);
    };

    const img = new Image();
    img.decoding = 'async';
    img.src = source;
    img
      .decode()
      .then(() => {
        if (disposed) return;
        srcCtx.imageSmoothingEnabled = true;
        srcCtx.imageSmoothingQuality = 'high';
        srcCtx.clearRect(0, 0, RES, RES);
        srcCtx.save();
        if (flip) {
          srcCtx.translate(RES, 0);
          srcCtx.scale(-1, 1);
        }
        srcCtx.drawImage(img, 0, 0, RES, RES);
        srcCtx.restore();
        pixels = srcCtx.getImageData(0, 0, RES, RES).data;

        if (reduced) {
          // One static pass, no loop.
          render(1);
          return;
        }
        play();
      })
      .catch(() => {
        /* No portrait: the canvas stays empty and the layout still holds. */
      });

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView && !reduced) play();
    });
    io.observe(canvas);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, [source, flip]);

  // The source photo is a square crop, so it ends on a hard horizontal edge.
  // Fading the last stretch dissolves him into the page instead. It sits on the
  // wrapper so it applies to both layers at once — the canvas's own alpha is
  // already spoken for by the lens.
  const fade =
    'linear-gradient(to bottom, black 0%, black 72%, rgba(0,0,0,0.35) 90%, transparent 100%)';

  return (
    <div
      className={`relative h-full w-full ${className}`}
      style={{ maskImage: fade, WebkitMaskImage: fade }}
    >
      {/* The sharp photo, revealed wherever the dither above it dissolves. Same
          file the canvas samples, so it costs no extra request. Full colour: the
          jump from monochrome pixels to a real person is the whole point. */}
      <img
        src={source}
        alt={alt}
        className={`absolute inset-0 h-full w-full object-contain ${flip ? '-scale-x-100' : ''}`}
      />
      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute inset-0 block h-full w-full [image-rendering:pixelated]"
      />
    </div>
  );
}
