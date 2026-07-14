import { useEffect, useRef, useState } from 'react';
import type { CaseStudy } from '../../data/caseStudies';
import { scrollState } from '../../lib/scroll';
import {
  CARD_FRAG,
  CARD_VERT,
  TRACK_FRAG,
  TRACK_VERT,
  compile,
  makeQuad,
  projectTrackX,
  viewProjection,
} from './pipelineGL';

// World units. Scaling the track up while the camera stays put both fills the
// canvas and deepens the perspective, since the off-centre cards fall further
// behind the focused one on the arc.
const SCALE = 2.3;
const RADIUS = 4.5 * SCALE;
const SPACING = 1.9 * SCALE;
const CARD_W = 1.6 * SCALE;
const CARD_H = 0.9 * SCALE;
const CAM_Z = 4.2;
const FOV = (46 * Math.PI) / 180;

type Props = {
  studies: CaseStudy[];
  /** Index the slider should move to (driven by the DOM controls). */
  index: number;
  onIndexChange: (index: number) => void;
};

/**
 * Curved 3D card track. The cards are the only thing drawn in WebGL — every
 * word stays in the DOM (see PipelineCaseStudies) so the section keeps real
 * text, real links, and real keyboard focus.
 */
export function PipelineSlider({ studies, index, onIndexChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dragging, setDragging] = useState(false);

  // Latest values the render loop reads without re-subscribing.
  const targetRef = useRef(index);
  const onIndexChangeRef = useRef(onIndexChange);
  onIndexChangeRef.current = onIndexChange;
  targetRef.current = index;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: true,
      premultipliedAlpha: true,
      powerPreference: 'high-performance',
    });
    if (!gl || gl.isContextLost()) return;

    const cardProgram = compile(gl, CARD_VERT, CARD_FRAG);
    const trackProgram = compile(gl, TRACK_VERT, TRACK_FRAG);
    if (!cardProgram || !trackProgram) return;

    const n = studies.length;

    // --- geometry -----------------------------------------------------------
    const card = makeQuad(32, 2);
    const track = makeQuad(96, 1);

    const buffer = (data: Float32Array) => {
      const b = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      return b;
    };
    const elements = (data: Uint16Array) => {
      const b = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, b);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
      return b;
    };

    const cardVao = gl.createVertexArray();
    gl.bindVertexArray(cardVao);
    const cardPos = buffer(card.pos);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const cardUv = buffer(card.uv);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);
    const cardIdx = elements(card.idx);

    const trackVao = gl.createVertexArray();
    gl.bindVertexArray(trackVao);
    const trackPos = buffer(track.pos);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const trackIdx = elements(track.idx);
    gl.bindVertexArray(null);

    const cardU = {
      vp: gl.getUniformLocation(cardProgram, 'uVP'),
      trackX: gl.getUniformLocation(cardProgram, 'uTrackX'),
      radius: gl.getUniformLocation(cardProgram, 'uRadius'),
      card: gl.getUniformLocation(cardProgram, 'uCard'),
      bend: gl.getUniformLocation(cardProgram, 'uBend'),
      focus: gl.getUniformLocation(cardProgram, 'uFocus'),
      tex: gl.getUniformLocation(cardProgram, 'uTex'),
      cardAspect: gl.getUniformLocation(cardProgram, 'uCardAspect'),
      texAspect: gl.getUniformLocation(cardProgram, 'uTexAspect'),
      loaded: gl.getUniformLocation(cardProgram, 'uLoaded'),
      intro: gl.getUniformLocation(cardProgram, 'uIntro'),
    };
    const trackU = {
      vp: gl.getUniformLocation(trackProgram, 'uVP'),
      startX: gl.getUniformLocation(trackProgram, 'uStartX'),
      endX: gl.getUniformLocation(trackProgram, 'uEndX'),
      radius: gl.getUniformLocation(trackProgram, 'uRadius'),
      bend: gl.getUniformLocation(trackProgram, 'uBend'),
      y: gl.getUniformLocation(trackProgram, 'uY'),
      thick: gl.getUniformLocation(trackProgram, 'uThick'),
      time: gl.getUniformLocation(trackProgram, 'uTime'),
      intro: gl.getUniformLocation(trackProgram, 'uIntro'),
    };

    // --- textures -----------------------------------------------------------
    const textures = studies.map(() => {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      // 1x1 placeholder so the card draws before the screenshot decodes.
      gl.texImage2D(
        gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
        new Uint8Array([8, 10, 13, 255])
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      return tex;
    });
    const loaded = studies.map(() => 0);
    const aspects = studies.map(() => CARD_W / CARD_H);
    let disposed = false;

    studies.forEach((study, i) => {
      const src = study.images[0];
      if (!src) return;
      const img = new Image();
      img.decoding = 'async';
      img.src = src;
      img
        .decode()
        .then(() => {
          if (disposed || gl.isContextLost()) return;
          gl.bindTexture(gl.TEXTURE_2D, textures[i]);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
          gl.generateMipmap(gl.TEXTURE_2D);
          aspects[i] = img.naturalWidth / Math.max(img.naturalHeight, 1);
          loaded[i] = 1;
          play();
        })
        .catch(() => {
          /* Missing screenshot: the card keeps its placeholder fill. */
        });
    });

    // --- sizing -------------------------------------------------------------
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let vp = viewProjection(FOV, 1, 0.1, 100, CAM_Z);

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      vp = viewProjection(FOV, Math.max(width / Math.max(height, 1), 0.1), 0.1, 100, CAM_Z);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // --- interaction --------------------------------------------------------
    let offset = index; // in card units
    let velocity = 0;
    let bend = 0;
    let isDown = false;
    let pointerId = -1;
    let lastX = 0;
    let travelled = 0;
    let downX = 0;

    const pxPerCard = () => Math.min(Math.max(width * 0.42, 220), 460);

    /** Card index, wrapped into 0..n-1. The track has no ends. */
    const wrapIndex = (v: number) => ((v % n) + n) % n;

    /**
     * Signed distance from the offset to card i, taking the short way round the
     * loop. This is what makes the track endless: card 0 sits one step to the
     * right of the last card, not n steps to the left.
     */
    const relative = (i: number) => {
      let d = (i - offset) % n;
      if (d > n / 2) d -= n;
      if (d < -n / 2) d += n;
      return d;
    };

    const cardScreenX = (i: number) =>
      projectTrackX(relative(i) * SPACING, RADIUS, bend, vp, width);

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      isDown = true;
      pointerId = e.pointerId;
      lastX = e.clientX;
      downX = e.clientX;
      travelled = 0;
      velocity = 0;
      canvas.setPointerCapture(e.pointerId);
      setDragging(true);
      play();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDown || e.pointerId !== pointerId) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      travelled += Math.abs(dx);

      // No rubber-band and no ends: the offset runs free and wraps.
      const delta = -dx / pxPerCard();
      offset += delta;
      velocity = delta;
      play();
    };

    const endDrag = (e: PointerEvent) => {
      if (!isDown || e.pointerId !== pointerId) return;
      isDown = false;
      pointerId = -1;
      setDragging(false);

      if (travelled < 6) {
        // A press that never travelled is a click: focus the card under it.
        const rect = canvas.getBoundingClientRect();
        const px = downX - rect.left;
        let best = -1;
        let bestDist = Infinity;
        for (let i = 0; i < n; i++) {
          const d = Math.abs(cardScreenX(i) - px);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        }
        if (best >= 0 && bestDist < width * 0.25) onIndexChangeRef.current(best);
      } else {
        // A flick lands further down the track. Expressing momentum as a
        // further target (rather than integrating velocity alongside the
        // spring) keeps the two from fighting and always settles on a card.
        onIndexChangeRef.current(wrapIndex(Math.round(offset + velocity * 6)));
      }
      play();
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', endDrag);
    canvas.addEventListener('pointercancel', endDrag);

    // Horizontal trackpad/wheel scrolls the track; vertical is left to the page.
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      offset += e.deltaX / pxPerCard();
      play();
    };
    canvas.addEventListener('wheel', onWheel, { passive: false });

    // --- render loop --------------------------------------------------------
    let raf = 0;
    let inView = true;
    let lost = false;
    let reported = index;
    const start = performance.now();

    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const order = studies.map((_, i) => i);

    const frame = (now: number) => {
      raf = 0;
      if (!inView || lost) return;

      const t = (now - start) / 1000;
      const intro = Math.min(1, t / 0.9);

      if (!isDown) {
        // Spring to the requested card by the short way round: card 0 is one
        // step past the last card, so going from the end to the start must not
        // rewind the whole track.
        let delta = (targetRef.current - offset) % n;
        if (delta > n / 2) delta -= n;
        if (delta < -n / 2) delta += n;
        offset += delta * 0.12;
        if (Math.abs(delta) < 0.001) offset = Math.round(offset);
        velocity *= 0.9; // Decays the bend, not the position.
      } else {
        // Dragging past a card boundary updates the DOM copy live.
        const near = wrapIndex(Math.round(offset));
        if (near !== reported) {
          reported = near;
          onIndexChangeRef.current(near);
        }
      }

      // Bend comes from both page-scroll speed and drag speed.
      const pageVel = Math.min(Math.abs(scrollState.velocity) / 40, 1);
      const dragVel = Math.min(Math.abs(velocity) * 6, 1);
      bend += (Math.max(pageVel, dragVel) - bend) * 0.1;

      gl.clear(gl.COLOR_BUFFER_BIT);

      // Track first: it sits below the cards and never occludes them.
      gl.useProgram(trackProgram);
      gl.bindVertexArray(trackVao);
      gl.uniformMatrix4fv(trackU.vp, false, vp);
      // The rail spans the visible arc rather than the first and last card:
      // on a loop there is no first or last, and a rail with ends would show
      // the seam the cards no longer have.
      gl.uniform1f(trackU.startX, -(n / 2) * SPACING - CARD_W);
      gl.uniform1f(trackU.endX, (n / 2) * SPACING + CARD_W);
      gl.uniform1f(trackU.radius, RADIUS);
      gl.uniform1f(trackU.bend, bend);
      gl.uniform1f(trackU.y, -CARD_H * 0.5 - 0.13 * CARD_H);
      gl.uniform1f(trackU.thick, 0.03 * CARD_H);
      gl.uniform1f(trackU.time, t);
      gl.uniform1f(trackU.intro, intro);
      gl.drawElements(gl.TRIANGLES, track.count, gl.UNSIGNED_SHORT, 0);

      // Cards back-to-front (painter's order) so alpha blending is correct
      // without a depth buffer.
      gl.useProgram(cardProgram);
      gl.bindVertexArray(cardVao);
      gl.uniformMatrix4fv(cardU.vp, false, vp);
      gl.uniform1f(cardU.radius, RADIUS);
      gl.uniform2f(cardU.card, CARD_W, CARD_H);
      gl.uniform1f(cardU.bend, bend);
      gl.uniform1f(cardU.cardAspect, CARD_W / CARD_H);
      gl.uniform1f(cardU.intro, intro);
      gl.uniform1i(cardU.tex, 0);
      gl.activeTexture(gl.TEXTURE0);

      order.sort((a, b) => Math.abs(relative(b)) - Math.abs(relative(a)));
      for (const i of order) {
        const rel = relative(i);
        const d = Math.abs(rel);
        if (d > 3.2) continue; // Off-screen on the arc.
        gl.uniform1f(cardU.trackX, rel * SPACING);
        gl.uniform1f(cardU.focus, Math.max(0, 1 - d));
        gl.uniform1f(cardU.texAspect, aspects[i]);
        gl.uniform1f(cardU.loaded, loaded[i]);
        gl.bindTexture(gl.TEXTURE_2D, textures[i]);
        gl.drawElements(gl.TRIANGLES, card.count, gl.UNSIGNED_SHORT, 0);
      }

      // The packets travel continuously, so the loop only ever parks when the
      // section scrolls out of view (see the IntersectionObserver below).
      raf = requestAnimationFrame(frame);
    };

    const play = () => {
      if (!raf && inView && !lost) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) play();
      else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(canvas);

    const onLost = (e: Event) => {
      e.preventDefault();
      lost = true;
    };
    canvas.addEventListener('webglcontextlost', onLost);
    play();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', endDrag);
      canvas.removeEventListener('pointercancel', endDrag);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('webglcontextlost', onLost);
      textures.forEach((tex) => gl.deleteTexture(tex));
      [cardPos, cardUv, cardIdx, trackPos, trackIdx].forEach((b) => gl.deleteBuffer(b));
      gl.deleteVertexArray(cardVao);
      gl.deleteVertexArray(trackVao);
      gl.deleteProgram(cardProgram);
      gl.deleteProgram(trackProgram);
      // Deliberately NOT calling WEBGL_lose_context.loseContext(): StrictMode
      // remounts reuse this canvas and would get the dead context back.
    };
    // studies is module-level constant data; the loop reads index via a ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studies]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      data-cursor="view"
      className="h-full w-full touch-pan-y"
      style={{ cursor: dragging ? 'grabbing' : 'grab' }}
    />
  );
}
