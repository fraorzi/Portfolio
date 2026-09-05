import { SCENE_STOPS } from '@/lib/sceneProgress';

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

type Layout = { shiftX: number; shiftY: number; scale: number };
type Builder = (
  count: number,
  random: () => number,
  layout: Layout,
) => Float32Array;

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
    out[i * 3] = x + dx + 1.5 * layout.shiftX;
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
    out[i * 3] = x + dx + 1.9 * layout.shiftX;
    out[i * 3 + 1] = z * Math.sin(tilt) + dy + 0.15 + layout.shiftY;
    out[i * 3 + 2] = z * Math.cos(tilt) - 0.4;
  }
  return out;
};

const braid: Builder = (count, random, layout) => {
  const out = new Float32Array(count * 3);
  const length = 8.5 * layout.scale;
  const amplitude = 0.55 * layout.scale;
  for (let i = 0; i < count; i += 1) {
    const strand = i % 2;
    const t = random();
    const phase = strand === 0 ? 0 : Math.PI;
    const angle = t * Math.PI * 4 + phase;
    const [dx, dy] = tube(random, 0.06 * layout.scale);
    out[i * 3] = (t - 0.5) * length + dx;
    out[i * 3 + 1] =
      Math.sin(angle) * amplitude + dy + 0.35 * layout.scale + layout.shiftY;
    out[i * 3 + 2] = Math.cos(angle) * amplitude * 0.6 - 1.4;
  }
  return out;
};

const rings: Builder = (count, random, layout) => {
  const out = new Float32Array(count * 3);
  const radius = 0.7 * layout.scale;
  const centers = [0.9, 0, -0.9].map((y) => y * layout.scale);
  for (let i = 0; i < count; i += 1) {
    const ring = i % 3;
    const t = random() * Math.PI * 2;
    const spread = (random() - 0.5) * 0.08;
    const r = radius + spread;
    const x = Math.cos(t) * r;
    const z = Math.sin(t) * r;
    out[i * 3] = x + 2.5 * layout.shiftX;
    out[i * 3 + 1] =
      centers[ring] +
      z * 0.32 +
      (random() - 0.5) * 0.03 -
      0.2 * layout.shiftX +
      layout.shiftY;
    out[i * 3 + 2] = z * 0.9;
  }
  return out;
};

const helix: Builder = (count, random, layout) => {
  const out = new Float32Array(count * 3);
  const length = (7.0 - 3.6 * layout.shiftX) * layout.scale;
  const radius = (0.75 - 0.25 * layout.shiftX) * layout.scale;
  const turns = 4.5 - 1.5 * layout.shiftX;
  for (let i = 0; i < count; i += 1) {
    const t = i / count;
    const angle = t * Math.PI * 2 * turns;
    const jitter = (random() - 0.5) * 0.12;
    out[i * 3] = (t - 0.5) * length - 2.0 * layout.shiftX;
    out[i * 3 + 1] =
      Math.cos(angle) * (radius + jitter) -
      0.9 * layout.scale * layout.shiftX +
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
    out[i * 3] = Math.cos(angle) * r + dx - 1.9 * layout.shiftX;
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
  const span = 9;
  for (let i = 0; i < count; i += 1) {
    const t = random();
    const y = (t - 0.5) * span;
    const [dx, dz] = tube(random, 0.05);
    out[i * 3] =
      Math.sin(y * 1.15) * 0.45 * layout.scale + dx + 1.6 * layout.shiftX;
    out[i * 3 + 1] = y + layout.shiftY;
    out[i * 3 + 2] = Math.cos(y * 0.8) * 0.3 + dz - 0.5;
  }
  return out;
};

const builders: Builder[] = [knot, orbit, braid, rings, helix, coil];

export function buildTargets(count: number, wide: boolean): TargetSet {
  if (builders.length !== SCENE_STOPS) {
    throw new Error('scene: target builders must match section count');
  }
  const layout: Layout = wide
    ? { shiftX: 1, shiftY: 0, scale: 1 }
    : { shiftX: 0, shiftY: 1.2, scale: 0.6 };
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
