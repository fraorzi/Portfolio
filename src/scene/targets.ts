import { SCENE_STOPS } from '@/lib/sceneProgress';

export type TargetSet = {
  positions: Float32Array[];
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

function sphere(count: number, random: () => number, layout: Layout) {
  const out = new Float32Array(count * 3);
  const radius = 1.7 * layout.scale;
  for (let i = 0; i < count; i += 1) {
    const u = random();
    const v = random();
    const theta = u * Math.PI * 2;
    const phi = Math.acos(2 * v - 1);
    const r = radius * (0.92 + random() * 0.16);
    out[i * 3] = r * Math.sin(phi) * Math.cos(theta) + 1.4 * layout.shiftX;
    out[i * 3 + 1] = r * Math.cos(phi) + layout.shiftY;
    out[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  return out;
}

function page(count: number, random: () => number, layout: Layout) {
  const out = new Float32Array(count * 3);
  const cols = Math.ceil(Math.sqrt(count * 1.4));
  const rows = Math.ceil(count / cols);
  const w = 3.4 * layout.scale;
  const h = 2.5 * layout.scale;
  const tilt = 0.42;
  for (let i = 0; i < count; i += 1) {
    const c = i % cols;
    const r = Math.floor(i / cols);
    const x = (c / (cols - 1) - 0.5) * w;
    const y = (r / Math.max(1, rows - 1) - 0.5) * h;
    const wave = Math.sin(x * 1.9) * 0.14 + Math.cos(y * 2.3) * 0.08;
    out[i * 3] = x + 2.5 * layout.shiftX + (random() - 0.5) * 0.02;
    out[i * 3 + 1] =
      y * Math.cos(tilt) +
      wave * Math.sin(tilt) -
      0.4 * layout.scale +
      layout.shiftY;
    out[i * 3 + 2] = -0.8 + wave + y * Math.sin(tilt) * 0.6;
  }
  return out;
}

function rings(count: number, random: () => number, layout: Layout) {
  const out = new Float32Array(count * 3);
  const radius = 0.9 * layout.scale;
  const centers = [1.15, 0, -1.15].map((y) => y * layout.scale);
  for (let i = 0; i < count; i += 1) {
    const ring = i % 3;
    const t = random() * Math.PI * 2;
    const spread = (random() - 0.5) * 0.08;
    const r = radius + spread;
    const x = Math.cos(t) * r;
    const z = Math.sin(t) * r;
    out[i * 3] = x + 2.7 * layout.shiftX;
    out[i * 3 + 1] =
      centers[ring] + z * 0.32 + (random() - 0.5) * 0.03 + layout.shiftY;
    out[i * 3 + 2] = z * 0.9;
  }
  return out;
}

function cloud(count: number, random: () => number, layout: Layout) {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    out[i * 3] = (random() - 0.5) * 7.5 * layout.scale;
    out[i * 3 + 1] = (random() - 0.5) * 5.2 * layout.scale + layout.shiftY;
    out[i * 3 + 2] = -2.2 + random() * 2.0;
  }
  return out;
}

function lattice(count: number, random: () => number, layout: Layout) {
  const out = new Float32Array(count * 3);
  const side = Math.ceil(Math.cbrt(count));
  const spacing = (3.2 * layout.scale) / side;
  const half = ((side - 1) * spacing) / 2;
  for (let i = 0; i < count; i += 1) {
    const x = i % side;
    const y = Math.floor(i / side) % side;
    const z = Math.floor(i / (side * side));
    out[i * 3] = x * spacing - half + 1.5 * layout.shiftX;
    out[i * 3 + 1] = y * spacing - half + layout.shiftY;
    out[i * 3 + 2] = z * spacing - half - 0.4 + (random() - 0.5) * 0.01;
  }
  return out;
}

function helix(count: number, random: () => number, layout: Layout) {
  const out = new Float32Array(count * 3);
  const length = 7.0 * layout.scale;
  const radius = 0.75 * layout.scale;
  const turns = 4.5;
  for (let i = 0; i < count; i += 1) {
    const t = i / count;
    const angle = t * Math.PI * 2 * turns;
    const jitter = (random() - 0.5) * 0.12;
    out[i * 3] = (t - 0.5) * length;
    out[i * 3 + 1] =
      Math.cos(angle) * (radius + jitter) - 0.7 * layout.scale + layout.shiftY;
    out[i * 3 + 2] = Math.sin(angle) * (radius + jitter) - 0.6;
  }
  return out;
}

function dust(count: number, random: () => number, layout: Layout) {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const fall = Math.pow(random(), 0.6);
    out[i * 3] = (random() - 0.5) * 8.5 * layout.scale;
    out[i * 3 + 1] = 2.6 - fall * 5.6 + layout.shiftY;
    out[i * 3 + 2] = -2.5 + random() * 2.6;
  }
  return out;
}

const builders = [sphere, page, rings, cloud, lattice, helix, dust];

export function buildTargets(count: number, wide: boolean): TargetSet {
  if (builders.length !== SCENE_STOPS) {
    throw new Error('scene: target builders must match section count');
  }
  const layout: Layout = wide
    ? { shiftX: 1, shiftY: 0, scale: 1 }
    : { shiftX: 0, shiftY: 1.1, scale: 0.68 };
  const positions = builders.map((build, i) =>
    build(count, createRandom(1000 + i * 7919), layout),
  );
  const seedRandom = createRandom(42);
  const seeds = new Float32Array(count);
  for (let i = 0; i < count; i += 1) seeds[i] = seedRandom();
  return { positions, seeds };
}
