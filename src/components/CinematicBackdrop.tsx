import { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 40;

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
};

function createParticles(width: number, height: number): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.08,
    vy: (Math.random() - 0.5) * 0.08,
    radius: Math.random() * 1.4 + 0.4,
    alpha: Math.random() * 0.4 + 0.1,
  }));
}

export function CinematicBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles = createParticles(width, height);
    let frameId = 0;
    let running = true;
    let resizeTimeout: number;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width;
      canvas!.height = height;
      particles = createParticles(width, height);
    }
    resize();

    function onResize() {
      window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(resize, 200);
    }
    window.addEventListener('resize', onResize);

    function onVisibilityChange() {
      running = document.visibilityState === 'visible';
      if (running) frameId = requestAnimationFrame(tick);
    }
    document.addEventListener('visibilitychange', onVisibilityChange);

    function tick() {
      if (!running) return;
      ctx!.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(57, 255, 138, ${p.alpha})`;
        ctx!.fill();
      }
      frameId = requestAnimationFrame(tick);
    }
    frameId = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(frameId);
      window.clearTimeout(resizeTimeout);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 30%, rgba(57,255,138,0.08) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}
