export const pointVertexShader = /* glsl */ `
  attribute vec3 aT1;
  attribute vec3 aT2;
  attribute vec3 aT3;
  attribute vec3 aT4;
  attribute vec3 aT5;
  attribute vec3 aT6;
  attribute float aSeed;

  uniform float uProgress;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;

  varying float vSeed;
  varying float vDepth;

  float segment(float k) {
    float stagger = aSeed * 0.35;
    float t = clamp((uProgress - k - stagger) / (1.0 - 0.35), 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t);
  }

  vec3 drift(vec3 p) {
    float t = uTime * 0.18 + aSeed * 12.0;
    return vec3(
      sin(t + p.y * 1.7) * 0.035,
      cos(t * 1.3 + p.x * 1.4) * 0.035,
      sin(t * 0.7 + p.z * 2.1) * 0.03
    );
  }

  void main() {
    vec3 p = position;
    p = mix(p, aT1, segment(0.0));
    p = mix(p, aT2, segment(1.0));
    p = mix(p, aT3, segment(2.0));
    p = mix(p, aT4, segment(3.0));
    p = mix(p, aT5, segment(4.0));
    p = mix(p, aT6, segment(5.0));
    p += drift(p);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float size = uSize * (0.7 + aSeed * 0.9);
    gl_PointSize = size * uPixelRatio * (4.2 / max(0.5, -mv.z));

    vSeed = aSeed;
    vDepth = clamp((-mv.z - 3.0) / 6.0, 0.0, 1.0);
  }
`;

export const pointFragmentShader = /* glsl */ `
  precision mediump float;

  uniform vec3 uBase;
  uniform vec3 uAccent;
  uniform vec3 uOchre;
  uniform float uOpacity;
  uniform float uBaseStrength;

  varying float vSeed;
  varying float vDepth;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.28, d);
    if (alpha < 0.01) discard;

    vec3 color = uBase;
    float strength = uBaseStrength;
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
