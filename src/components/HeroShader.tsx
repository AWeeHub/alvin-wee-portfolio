import { useEffect, useRef } from 'react';
import { scrollState } from '../lib/scroll';

const VERT = `#version 300 es
void main() {
  vec2 pos = vec2(gl_VertexID == 2 ? 3.0 : -1.0, gl_VertexID == 1 ? 3.0 : -1.0);
  gl_Position = vec4(pos, 0.0, 1.0);
}`;

// All distances in CSS pixels (gl_FragCoord divided by uDpr) so the
// field renders identically across device pixel ratios.
const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform float uTime;
uniform float uIntro;
uniform float uDpr;
uniform float uVel;
uniform float uScroll;
out vec4 outColor;

float hash(float n) {
  return fract(sin(n) * 43758.5453123);
}

void main() {
  vec2 p = gl_FragCoord.xy / max(uDpr, 1.0);
  vec2 res = max(uRes, vec2(1.0));
  vec2 m = vec2(uMouse.x, res.y - uMouse.y);

  // Cursor lens: push grid space away from the pointer.
  vec2 d = p - m;
  float dist = length(d);
  float warp = (30.0 + 24.0 * uVel) * exp(-dist / 200.0);
  vec2 pw = p + (d / max(dist, 0.001)) * warp;
  // Grid rides at 0.15x scroll speed: reads as a far depth layer.
  pw.y += uScroll * 0.15;

  float spacing = 48.0;
  vec2 cell = abs(fract(pw / spacing) - 0.5) * spacing;
  float line = 1.0 - smoothstep(0.0, 1.1, min(cell.x, cell.y));

  // Radial mask matching the old CSS gradient (fades grid at edges).
  vec2 c = vec2(res.x * 0.5, res.y * 0.65);
  float mask = 1.0 - smoothstep(0.2, 0.85, length((p - c) / (res.x * 0.6)));

  // Ambient fog glow behind the headline.
  float fog = exp(-pow(length((p - c) / (res.y * 0.55)), 2.0));

  // Data pulses travelling along a sparse set of grid lines.
  float row = floor(pw.y / spacing);
  float col = floor(pw.x / spacing);
  float rowOn = step(0.86, hash(row * 7.31));
  float colOn = step(0.86, hash(col * 5.77));
  float hx = fract(uTime * (0.04 + 0.05 * hash(row * 3.7)) + hash(row * 9.13)) * res.x;
  float vy = fract(uTime * (0.035 + 0.05 * hash(col * 2.93)) + hash(col * 6.37)) * res.y;
  float onRow = 1.0 - smoothstep(0.0, 1.1, cell.y);
  float onCol = 1.0 - smoothstep(0.0, 1.1, cell.x);
  float pulses = rowOn * onRow * exp(-abs(pw.x - hx) / 55.0)
               + colOn * onCol * exp(-abs(pw.y - vy) / 55.0);

  float mouseGlow = exp(-dist / 230.0);

  vec3 accent = vec3(0.224, 1.0, 0.541);
  float intensity = line * mask * (0.10 + 0.06 * uVel + 0.28 * mouseGlow)
                  + pulses * mask * 0.55
                  + fog * 0.10
                  + mouseGlow * 0.05;
  intensity = clamp(intensity, 0.0, 1.0) * uIntro;

  // Premultiplied alpha output.
  outColor = vec4(accent * intensity, intensity);
}`;

function compileProgram(gl: WebGL2RenderingContext): WebGLProgram | null {
  const make = (type: number, src: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };
  const vs = make(gl.VERTEX_SHADER, VERT);
  const fs = make(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

export function HeroShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      powerPreference: 'high-performance',
    });
    if (!gl || gl.isContextLost()) return;

    const program = compileProgram(gl);
    if (!program) return;
    gl.useProgram(program);

    const uRes = gl.getUniformLocation(program, 'uRes');
    const uMouse = gl.getUniformLocation(program, 'uMouse');
    const uTime = gl.getUniformLocation(program, 'uTime');
    const uIntro = gl.getUniformLocation(program, 'uIntro');
    const uDpr = gl.getUniformLocation(program, 'uDpr');
    const uVel = gl.getUniformLocation(program, 'uVel');
    const uScroll = gl.getUniformLocation(program, 'uScroll');
    let smoothVel = 0;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Pointer in CSS px relative to the canvas; drifts on its own until
    // the first real pointer move (touch devices keep the drift).
    const mouse = { x: width / 2, y: height * 0.35 };
    const target = { x: mouse.x, y: mouse.y };
    let hasPointer = false;
    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (e.clientY >= rect.top - 200 && e.clientY <= rect.bottom + 200) {
        target.x = e.clientX - rect.left;
        target.y = e.clientY - rect.top;
        hasPointer = true;
      }
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    let raf = 0;
    let inView = true;
    let lost = false;
    const start = performance.now();

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const render = (t: number) => {
      const intro = Math.min(1, t / 1.4);
      smoothVel += (Math.min(Math.abs(scrollState.velocity) / 30, 1) - smoothVel) * 0.08;
      gl.uniform2f(uRes, width, height);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uTime, t);
      gl.uniform1f(uIntro, intro * (2 - intro));
      gl.uniform1f(uDpr, dpr);
      gl.uniform1f(uVel, smoothVel);
      gl.uniform1f(uScroll, window.scrollY);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    // One synchronous frame so the buffer is never garbage, even if
    // rAF is throttled (background/occluded tab).
    render(0);

    const frame = (now: number) => {
      raf = 0;
      if (!inView || lost) return;
      const t = (now - start) / 1000;
      if (!hasPointer) {
        target.x = width * (0.5 + 0.22 * Math.sin(t * 0.25));
        target.y = height * (0.38 + 0.14 * Math.cos(t * 0.19));
      }
      mouse.x += (target.x - mouse.x) * 0.07;
      mouse.y += (target.y - mouse.y) * 0.07;
      render(t);
      raf = requestAnimationFrame(frame);
    };
    const play = () => {
      if (!raf && inView && !lost) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) play();
    });
    io.observe(canvas);

    const onLost = (e: Event) => {
      e.preventDefault();
      lost = true;
    };
    canvas.addEventListener('webglcontextlost', onLost);
    play();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('webglcontextlost', onLost);
      gl.deleteProgram(program);
      // Deliberately NOT calling WEBGL_lose_context.loseContext() here:
      // StrictMode remounts reuse the same canvas, and getContext then
      // returns the dead context forever (renders as a white rectangle).
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}
