/**
 * Raw WebGL2 helpers for the case-study pipeline slider.
 *
 * Deliberately no three.js / OGL: the hero already ships a raw WebGL2 shader,
 * and a curved textured carousel needs so little of a 3D engine that pulling
 * one in would cost more gzip than the whole feature.
 */

/** Accent green (#39FF8A) in linear 0..1, matching the hero shader. */
export const ACCENT: [number, number, number] = [0.224, 1.0, 0.541];

export const CARD_VERT = `#version 300 es
layout(location = 0) in vec2 aPos;
layout(location = 1) in vec2 aUv;

uniform mat4 uVP;
uniform float uTrackX;
uniform float uRadius;
uniform vec2 uCard;
uniform float uBend;
uniform float uFocus;

out vec2 vUv;

void main() {
  // The card you land on grows: at rest it is the subject of the section, and
  // the ones behind it are context. Scaling the quad here (rather than the world
  // position) keeps it centred on its own slot as it swells.
  float s = 1.0 + uFocus * 0.34;

  // Cards ride a cylinder: along-track distance maps to an arc angle, so the
  // row curves away from the camera instead of running flat off-screen.
  float x = uTrackX + aPos.x * uCard.x * s;
  // A tighter radius = a harder curl. Scroll/drag velocity shrinks it, which
  // reads as the pipeline bending under speed.
  float r = uRadius / (1.0 + uBend * 1.6);
  float ang = x / r;

  vec3 p;
  p.x = sin(ang) * r;
  p.z = cos(ang) * r - r;
  p.y = aPos.y * uCard.y * s;

  // Focused card leans out of the arc toward the viewer.
  p.z += uFocus * uCard.y * 0.2;
  // Velocity ripple down the track. Both offsets are expressed relative to the
  // card so they keep their proportions if the world scale changes.
  p.y += sin(ang * 3.0) * uBend * uCard.y * 0.07;

  vUv = aUv;
  gl_Position = uVP * vec4(p, 1.0);
}`;

export const CARD_FRAG = `#version 300 es
precision highp float;

in vec2 vUv;

uniform sampler2D uTex;
uniform float uCardAspect;
uniform float uTexAspect;
uniform float uFocus;
uniform float uLoaded;
uniform float uIntro;

out vec4 outColor;

float sdRoundBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  // Cover-fit: crop the overflowing axis instead of squashing the screenshot.
  vec2 uv = vUv;
  float k = uCardAspect / max(uTexAspect, 0.001);
  if (k < 1.0) uv.x = (uv.x - 0.5) * k + 0.5;
  else uv.y = (uv.y - 0.5) / k + 0.5;

  vec3 tex = texture(uTex, uv).rgb;

  // Unfocused cards sit back: desaturated and dimmed, so the eye lands on one.
  float lum = dot(tex, vec3(0.299, 0.587, 0.114));
  vec3 col = mix(vec3(lum) * 0.55, tex, mix(0.25, 1.0, uFocus));
  col *= mix(0.45, 1.0, uFocus);

  // Placeholder fill until the texture decodes.
  col = mix(vec3(0.03, 0.04, 0.05), col, uLoaded);

  vec2 p = (vUv - 0.5) * vec2(uCardAspect, 1.0);
  vec2 b = vec2(uCardAspect, 1.0) * 0.5;
  float d = sdRoundBox(p, b, 0.07);

  float alpha = 1.0 - smoothstep(-0.004, 0.004, d);
  float edge = smoothstep(0.018, 0.0, abs(d));

  vec3 accent = vec3(${ACCENT[0]}, ${ACCENT[1]}, ${ACCENT[2]});
  col = mix(col, accent, edge * mix(0.12, 0.75, uFocus));

  alpha *= uIntro;
  outColor = vec4(col * alpha, alpha);
}`;

export const TRACK_VERT = `#version 300 es
layout(location = 0) in vec2 aPos;

uniform mat4 uVP;
uniform float uStartX;
uniform float uEndX;
uniform float uRadius;
uniform float uBend;
uniform float uY;
uniform float uThick;

out float vS;
out float vT;

void main() {
  float x = mix(uStartX, uEndX, aPos.x);
  float r = uRadius / (1.0 + uBend * 1.6);
  float ang = x / r;

  vec3 p;
  p.x = sin(ang) * r;
  p.z = cos(ang) * r - r;
  p.y = uY + aPos.y * uThick;

  vS = aPos.x;
  vT = aPos.y;
  gl_Position = uVP * vec4(p, 1.0);
}`;

export const TRACK_FRAG = `#version 300 es
precision highp float;

in float vS;
in float vT;

uniform float uTime;
uniform float uIntro;

out vec4 outColor;

void main() {
  float line = 1.0 - smoothstep(0.0, 0.5, abs(vT));

  // Packets: leads moving down the pipeline. Same visual language as the
  // pulses in the hero grid and the spine packets.
  float glow = 0.0;
  for (int i = 0; i < 5; i++) {
    float pos = fract(uTime * 0.12 + float(i) / 5.0);
    glow += exp(-abs(vS - pos) * 90.0);
  }

  vec3 accent = vec3(${ACCENT[0]}, ${ACCENT[1]}, ${ACCENT[2]});
  float a = clamp(line * (0.10 + 0.9 * glow), 0.0, 1.0) * uIntro;
  outColor = vec4(accent * a, a);
}`;

export function compile(
  gl: WebGL2RenderingContext,
  vertSrc: string,
  fragSrc: string
): WebGLProgram | null {
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

  const vs = make(gl.VERTEX_SHADER, vertSrc);
  const fs = make(gl.FRAGMENT_SHADER, fragSrc);
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

/** A subdivided unit quad spanning -0.5..0.5, UVs 0..1 (y flipped for textures). */
export function makeQuad(segX: number, segY: number) {
  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];

  for (let y = 0; y <= segY; y++) {
    for (let x = 0; x <= segX; x++) {
      const u = x / segX;
      const v = y / segY;
      pos.push(u - 0.5, v - 0.5);
      uv.push(u, 1 - v);
    }
  }
  for (let y = 0; y < segY; y++) {
    for (let x = 0; x < segX; x++) {
      const a = y * (segX + 1) + x;
      const b = a + 1;
      const c = a + segX + 1;
      const d = c + 1;
      idx.push(a, c, b, b, c, d);
    }
  }

  return {
    pos: new Float32Array(pos),
    uv: new Float32Array(uv),
    idx: new Uint16Array(idx),
    count: idx.length,
  };
}

/**
 * Perspective projection premultiplied by a translate(0, 0, -camZ) view, so the
 * render loop uploads one matrix instead of doing a mat4 multiply per frame.
 */
export function viewProjection(
  fovY: number,
  aspect: number,
  near: number,
  far: number,
  camZ: number
): Float32Array {
  const f = 1 / Math.tan(fovY / 2);
  const C = (far + near) / (near - far);
  const D = (2 * far * near) / (near - far);

  // Column-major.
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, C, -1,
    0, 0, -C * camZ + D, camZ,
  ]);
}

/** Screen-space x (in CSS px) of a card centre, for hit-testing clicks. */
export function projectTrackX(
  trackX: number,
  radius: number,
  bend: number,
  vp: Float32Array,
  widthPx: number
): number {
  const r = radius / (1 + bend * 1.6);
  const ang = trackX / r;
  const x = Math.sin(ang) * r;
  const z = Math.cos(ang) * r - r;

  const clipX = vp[0] * x;
  // Row 3 of the column-major matrix: w = vp[11] * z + vp[15].
  const clipW = vp[11] * z + vp[15];
  if (clipW <= 1e-6) return Number.POSITIVE_INFINITY;

  return (clipX / clipW * 0.5 + 0.5) * widthPx;
}
