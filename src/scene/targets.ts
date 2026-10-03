import { MAX_OFFSET, SCENE_STOPS, THREAD_WINDOW } from '@/lib/sceneProgress';

export const CAMERA_Z = 6;
export const CAMERA_FOV = 40;
export const TILT = { pointerYaw: 0.18, pointerPitch: 0.12, swayYaw: 0.08 };

const TAN = Math.tan((CAMERA_FOV * Math.PI) / 360);
const CONTENT_MAX = 1280;
const CONTENT_GUTTER = 80;
const REFERENCE_RATIO = (CONTENT_MAX - CONTENT_GUTTER) / 900;
const EDGE_MARGIN = 0.12;

export type Viewport = { width: number; height: number };

export type TargetSet = {
  positions: Float32Array[];
  thread: Float32Array;
  seeds: Float32Array;
};

function createRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Layout = {
  wide: boolean;
  columnX: number;
  shiftX: number;
  shiftY: number;
  scale: number;
  aspect: number;
};
type Builder = (
  count: number,
  random: () => number,
  layout: Layout,
) => Float32Array;

function edge(z: number, ndc: number, span: number, tilt: number) {
  const reach = Math.abs(ndc) * span;
  const world =
    (reach * (CAMERA_Z - z) + Math.abs(z) * Math.sin(tilt)) /
    (Math.cos(tilt) - reach * Math.sin(tilt));
  return Math.sign(ndc) * world;
}

function edgeY(layout: Layout, z: number, ndc: number) {
  const tilt = layout.wide ? TILT.pointerPitch : 0;
  return edge(z, ndc, TAN, tilt);
}

function edgeX(layout: Layout, z: number, ndc: number) {
  const tilt = (layout.wide ? TILT.pointerYaw : 0) + TILT.swayYaw;
  return edge(z, ndc, TAN * layout.aspect, tilt);
}

function tube(random: () => number, radius: number) {
  const angle = random() * Math.PI * 2;
  const r = radius * Math.sqrt(random());
  return [Math.cos(angle) * r, Math.sin(angle) * r] as const;
}

const knot: Builder = (count, random, layout) => {
  const out = new Float32Array(count * 3);
  const size = 0.5 * layout.scale;
  for (let i = 0; i < count; i += 1) {
    const t = random() * Math.PI * 2;
    const [dx, dy] = tube(random, 0.07 * layout.scale);
    const x = (Math.sin(t) + 2 * Math.sin(2 * t)) * size;
    const y = (Math.cos(t) - 2 * Math.cos(2 * t)) * size;
    const z = -Math.sin(3 * t) * size;
    out[i * 3] = x + dx + 1.5 * layout.columnX;
    out[i * 3 + 1] =
      y + dy + 0.6 * layout.scale * layout.shiftX + layout.shiftY;
    out[i * 3 + 2] = z;
  }
  return out;
};

const orbit: Builder = (count, random, layout) => {
  const out = new Float32Array(count * 3);
  const radius = 1.1 * layout.scale;
  const tilt = 0.55;
  for (let i = 0; i < count; i += 1) {
    const t = random() * Math.PI * 2;
    const [dx, dy] = tube(random, 0.07 * layout.scale);
    const x = Math.cos(t) * radius;
    const z = Math.sin(t) * radius;
    out[i * 3] = x + dx + 1.9 * layout.columnX;
    out[i * 3 + 1] = z * Math.sin(tilt) + dy + 0.15 + layout.shiftY;
    out[i * 3 + 2] = z * Math.cos(tilt) - 0.4;
  }
  return out;
};

const braid: Builder = (count, random, layout) => {
  const out = new Float32Array(count * 3);
  const amplitude = 0.55 * layout.scale;
  const wavelength = 4.25 * layout.scale;
  const half = edgeX(layout, -1.4 - amplitude * 0.6, 1 + EDGE_MARGIN);
  for (let i = 0; i < count; i += 1) {
    const strand = i % 2;
    const x = (random() * 2 - 1) * half;
    const phase = strand === 0 ? 0 : Math.PI;
    const angle = (x / wavelength) * Math.PI * 2 + phase;
    const [dx, dy] = tube(random, 0.06 * layout.scale);
    out[i * 3] = x + dx;
    out[i * 3 + 1] =
      Math.sin(angle) * amplitude + dy + 0.35 * layout.scale + layout.shiftY;
    out[i * 3 + 2] = Math.cos(angle) * amplitude * 0.6 - 1.4;
  }
  return out;
};

const rings: Builder = (count, random, layout) => {
  const out = new Float32Array(count * 3);
  const radius = 0.7 * layout.scale;
  const gap = layout.wide ? 0.8 : 0.9;
  const centers = [gap, 0, -gap].map((y) => y * layout.scale);
  for (let i = 0; i < count; i += 1) {
    const ring = i % 3;
    const t = random() * Math.PI * 2;
    const spread = (random() - 0.5) * 0.08;
    const r = radius + spread;
    const x = Math.cos(t) * r;
    const z = Math.sin(t) * r;
    out[i * 3] = x - 1.9 * layout.columnX;
    out[i * 3 + 1] =
      centers[ring] +
      z * 0.32 +
      (random() - 0.5) * 0.03 -
      0.8 * layout.shiftX +
      layout.shiftY;
    out[i * 3 + 2] = z * 0.9;
  }
  return out;
};

const helix: Builder = (count, random, layout) => {
  const out = new Float32Array(count * 3);
  const radius = (layout.wide ? 0.6 : 0.75) * layout.scale;
  const pitch = (7.0 / 4.5) * layout.scale;
  const half = edgeX(layout, -0.6 - radius, 1 + EDGE_MARGIN);
  for (let i = 0; i < count; i += 1) {
    const x = (i / count) * 2 * half - half;
    const angle = (x / pitch) * Math.PI * 2;
    const jitter = (random() - 0.5) * 0.12;
    out[i * 3] = x;
    out[i * 3 + 1] =
      Math.cos(angle) * (radius + jitter) -
      1.75 * layout.scale * layout.shiftX +
      layout.shiftY;
    out[i * 3 + 2] = Math.sin(angle) * (radius + jitter) - 0.6;
  }
  return out;
};

const coil: Builder = (count, random, layout) => {
  const out = new Float32Array(count * 3);
  const turns = 4;
  const outer = 2.1 * layout.scale;
  for (let i = 0; i < count; i += 1) {
    const t = Math.sqrt(random());
    const angle = t * Math.PI * 2 * turns;
    const r = outer * (1 - t * 0.85);
    const [dx, dy] = tube(random, 0.06 * layout.scale);
    out[i * 3] = Math.cos(angle) * r + dx - 1.9 * layout.columnX;
    out[i * 3 + 1] =
      Math.sin(angle) * r * 0.55 +
      dy -
      1.15 * layout.scale * layout.shiftX +
      layout.shiftY;
    out[i * 3 + 2] = -1.6 + t * 1.8;
  }
  return out;
};

const thread: Builder = (count, random, layout) => {
  const out = new Float32Array(count * 3);
  const top = edgeY(
    layout,
    -0.8,
    1 + 2 * (1 - THREAD_WINDOW.end) + EDGE_MARGIN,
  );
  const bottom = edgeY(layout, -0.8, -1 - 2 * MAX_OFFSET - EDGE_MARGIN);
  for (let i = 0; i < count; i += 1) {
    const y = bottom + random() * (top - bottom);
    const [dx, dz] = tube(random, 0.05);
    out[i * 3] =
      Math.sin(y * 1.15) * 0.45 * layout.scale + dx + 1.6 * layout.columnX;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = Math.cos(y * 0.8) * 0.3 + dz - 0.5;
  }
  return out;
};

const builders: Builder[] = [knot, orbit, braid, rings, helix, coil];

export function sceneLayout({ width, height }: Viewport): Layout {
  const aspect = width / Math.max(1, height);
  if (width < 768) {
    return {
      wide: false,
      columnX: 0,
      shiftX: 0,
      shiftY: 1.2,
      scale: 0.6,
      aspect,
    };
  }
  const ratio =
    (Math.min(width, CONTENT_MAX) - CONTENT_GUTTER) /
    Math.max(1, height) /
    REFERENCE_RATIO;
  return {
    wide: true,
    columnX: Math.min(1.2, Math.max(0.6, ratio)),
    shiftX: 1,
    shiftY: 0,
    scale: 1,
    aspect,
  };
}

export function buildTargets(count: number, viewport: Viewport): TargetSet {
  if (builders.length !== SCENE_STOPS) {
    throw new Error('scene: target builders must match section count');
  }
  const layout = sceneLayout(viewport);
  const positions = builders.map((build, i) =>
    build(count, createRandom(1000 + i * 7919), layout),
  );
  const seedRandom = createRandom(42);
  const seeds = new Float32Array(count);
  for (let i = 0; i < count; i += 1) seeds[i] = seedRandom();
  return {
    positions,
    thread: thread(count, createRandom(777), layout),
    seeds,
  };
}
