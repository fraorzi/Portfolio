import { THREAD_WINDOW } from '@/lib/sceneProgress';

const threadStart = THREAD_WINDOW.start.toFixed(3);
const threadEnd = THREAD_WINDOW.end.toFixed(3);

export const pointVertexShader = /* glsl */ `
  attribute vec3 aT1;
  attribute vec3 aT2;
  attribute vec3 aT3;
  attribute vec3 aT4;
  attribute vec3 aT5;
  attribute vec3 aThread;
  attribute float aSeed;

  uniform float uProgress;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uShift;
  uniform vec3 uPivots[6];
  uniform vec3 uThreadPivot;
  uniform float uYaw;
  uniform float uPitch;
  uniform float uSplitY;
  uniform float uThemeAbove;
  uniform float uThemeBelow;

  varying float vSeed;
  varying float vDepth;
  varying float vTheme;

  vec2 morph(float k) {
    float f = clamp(uProgress - k, 0.0, 1.0);
    float s = aSeed * 0.14;
    return vec2(
      smoothstep(0.04 + s, ${threadStart}, f),
      smoothstep(${threadEnd}, 0.96 - s, f)
    );
  }

  vec3 viaThread(vec3 from, vec3 thread, vec3 to, vec2 w) {
    return mix(mix(from, thread, w.x), to, w.y);
  }

  vec3 tilt(vec3 v) {
    float cy = cos(uYaw);
    float sy = sin(uYaw);
    float cx = cos(uPitch);
    float sx = sin(uPitch);
    v = vec3(v.x * cy + v.z * sy, v.y, -v.x * sy + v.z * cy);
    return vec3(v.x, v.y * cx - v.z * sx, v.y * sx + v.z * cx);
  }

  vec3 drift(vec3 p) {
    float t = uTime * 0.18 + aSeed * 12.0;
    return vec3(
      sin(t + p.y * 1.7) * 0.03,
      cos(t * 1.3 + p.x * 1.4) * 0.03,
      sin(t * 0.7 + p.z * 2.1) * 0.025
    );
  }

  void main() {
    vec3 p = position;
    vec3 pivot = uPivots[0];
    vec2 w = morph(0.0);
    p = viaThread(p, aThread, aT1, w);
    pivot = viaThread(pivot, uThreadPivot, uPivots[1], w);
    w = morph(1.0);
    p = viaThread(p, aThread, aT2, w);
    pivot = viaThread(pivot, uThreadPivot, uPivots[2], w);
    w = morph(2.0);
    p = viaThread(p, aThread, aT3, w);
    pivot = viaThread(pivot, uThreadPivot, uPivots[3], w);
    w = morph(3.0);
    p = viaThread(p, aThread, aT4, w);
    pivot = viaThread(pivot, uThreadPivot, uPivots[4], w);
    w = morph(4.0);
    p = viaThread(p, aThread, aT5, w);
    pivot = viaThread(pivot, uThreadPivot, uPivots[5], w);
    p += drift(p);
    p = pivot + tilt(p - pivot);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_Position.y += uShift * gl_Position.w;

    float size = uSize * (0.7 + aSeed * 0.9);
    gl_PointSize = size * uPixelRatio * (4.2 / max(0.5, -mv.z));

    float ndcY = gl_Position.y / max(0.0001, gl_Position.w);
    float below = 1.0 - smoothstep(uSplitY - 0.015, uSplitY + 0.015, ndcY);
    vTheme = mix(uThemeAbove, uThemeBelow, below);

    vSeed = aSeed;
    vDepth = clamp((-mv.z - 3.0) / 6.0, 0.0, 1.0);
  }
`;

export const pointFragmentShader = /* glsl */ `
  precision mediump float;

  uniform vec3 uInk;
  uniform vec3 uPaper;
  uniform vec3 uAccent;
  uniform vec3 uOchre;
  uniform float uOpacity;
  uniform float uStrength;

  varying float vSeed;
  varying float vDepth;
  varying float vTheme;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.28, d);
    if (alpha < 0.01) discard;

    vec3 color = mix(uInk, uPaper, vTheme);
    float strength = uStrength * mix(0.58, 0.36, vTheme);
    if (vSeed < 0.085) {
      color = uAccent;
      strength = 0.95;
    } else if (vSeed < 0.096) {
      color = uOchre;
      strength = 1.0;
    }

    float fade = mix(1.0, 0.45, vDepth);
    gl_FragColor = vec4(color, alpha * strength * fade * uOpacity);
  }
`;
