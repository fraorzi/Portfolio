export const pointVertexShader = /* glsl */ `
  attribute vec3 aSpine;
  attribute vec4 aInfo;

  uniform vec2 uAnchors[7];
  uniform float uEdges[6];
  uniform float uThemes[7];
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uSmear;
  uniform float uCameraY;
  uniform float uViewHeight;

  varying float vSeed;
  varying float vDepth;
  varying float vTheme;
  varying float vFade;

  vec2 anchorOf(float index) {
    float i = floor(index + 0.5);
    if (i < 0.5) return uAnchors[0];
    if (i < 1.5) return uAnchors[1];
    if (i < 2.5) return uAnchors[2];
    if (i < 3.5) return uAnchors[3];
    if (i < 4.5) return uAnchors[4];
    if (i < 5.5) return uAnchors[5];
    return uAnchors[6];
  }

  vec3 drift(vec3 p, float seed) {
    float t = uTime * 0.18 + seed * 12.0;
    return vec3(
      sin(t + p.y * 1.7) * 0.03,
      cos(t * 1.3 + p.x * 1.4) * 0.03,
      sin(t * 0.7 + p.z * 2.1) * 0.025
    );
  }

  void main() {
    float seed = aInfo.x;
    float region = aInfo.y;
    float span = aInfo.z;

    vec2 anchor = mix(anchorOf(region), anchorOf(region + 1.0), span);
    vec3 shape = vec3(anchor.x + position.x, anchor.y + position.y, position.z);
    vec3 spine = vec3(anchor.x + aSpine.x, anchor.y + aSpine.y, aSpine.z);

    float along = (uCameraY - shape.y) / max(0.001, uViewHeight);
    float band = 1.0 - smoothstep(0.12, 0.72, abs(along));
    float unfold = smoothstep(seed * 0.35, 0.55 + seed * 0.35, band);
    vec3 p = mix(spine, shape, unfold);

    float theme = uThemes[0];
    if (p.y < uEdges[0]) theme = uThemes[1];
    if (p.y < uEdges[1]) theme = uThemes[2];
    if (p.y < uEdges[2]) theme = uThemes[3];
    if (p.y < uEdges[3]) theme = uThemes[4];
    if (p.y < uEdges[4]) theme = uThemes[5];
    if (p.y < uEdges[5]) theme = uThemes[6];

    p += drift(p, seed) * (0.35 + 0.65 * unfold);
    p.y += uSmear * (0.3 + seed * 0.7);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float thread = max(step(0.001, span), 1.0 - unfold);
    float size = uSize * (0.7 + seed * 0.9) * mix(1.0, 0.78, thread);
    gl_PointSize = size * uPixelRatio * (4.2 / max(0.5, -mv.z));

    vSeed = seed;
    vTheme = theme;
    vFade = aInfo.w;
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
  varying float vFade;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.28, d);
    if (alpha < 0.01) discard;

    vec3 color = mix(uInk, uPaper, vTheme);
    float strength = uStrength * mix(0.58, 0.4, vTheme);
    if (vSeed < 0.085) {
      color = uAccent;
      strength = 0.95;
    } else if (vSeed < 0.096) {
      color = uOchre;
      strength = 1.0;
    }

    float fade = mix(1.0, 0.45, vDepth) * vFade;
    gl_FragColor = vec4(color, alpha * strength * fade * uOpacity);
  }
`;
