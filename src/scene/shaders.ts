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
  uniform float uSplitY;
  uniform float uThemeAbove;
  uniform float uThemeBelow;

  varying float vSeed;
  varying float vDepth;
  varying float vTheme;

  vec3 viaThread(vec3 from, vec3 to, float k) {
    float f = clamp(uProgress - k, 0.0, 1.0);
    float s = aSeed * 0.14;
    float toThread = smoothstep(0.04 + s, 0.42, f);
    float toShape = smoothstep(0.58, 0.96 - s, f);
    return mix(mix(from, aThread, toThread), to, toShape);
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
    p = viaThread(p, aT1, 0.0);
    p = viaThread(p, aT2, 1.0);
    p = viaThread(p, aT3, 2.0);
    p = viaThread(p, aT4, 3.0);
    p = viaThread(p, aT5, 4.0);
    p += drift(p);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float size = uSize * (0.7 + aSeed * 0.9);
    gl_PointSize = size * uPixelRatio * (4.2 / max(0.5, -mv.z));

    float ndcY = gl_Position.y / max(0.0001, gl_Position.w);
    float below = smoothstep(uSplitY + 0.015, uSplitY - 0.015, ndcY);
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
