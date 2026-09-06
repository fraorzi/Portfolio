import { SCENE_STOPS } from '@/lib/sceneProgress';

export type TrailGeometry = {
  positions: Float32Array;
  spines: Float32Array;
  info: Float32Array;
  anchorBounds: readonly AnchorBounds[];
};

export type TrailLayout = {
  wide: boolean;
  scale: number;
  halfWidth: number;
  contentHalfWidth: number;
  cameraZ: number;
};

type AnchorBounds = { min: number; max: number };

type Vec3 = readonly [number, number, number];
type Random = () => number;

type ShapeInfo = {
  entry: Vec3;
  exit: Vec3;
  axis: readonly [Vec3, Vec3];
};
type ShapeBuilder = (
  out: Float32Array,
  start: number,
  count: number,
  random: Random,
  layout: TrailLayout,
) => ShapeInfo;

const THREAD_SHARE = 0.2;
const TAU = Math.PI * 2;

function createRandom(seed: number): Random {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function tube(random: Random, radius: number) {
  const angle = random() * TAU;
  const r = radius * Math.sqrt(random());
  return [Math.cos(angle) * r, Math.sin(angle) * r] as const;
}

function put(out: Float32Array, i: number, x: number, y: number, z: number) {
  out[i * 3] = x;
  out[i * 3 + 1] = y;
  out[i * 3 + 2] = z;
}

function rotateZ(x: number, y: number, angle: number) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [x * c - y * s, x * s + y * c] as const;
}

function smooth(t: number) {
  return t * t * (3 - 2 * t);
}

function projectOnSegment(p: Vec3, a: Vec3, b: Vec3): Vec3 {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const dz = b[2] - a[2];
  const length = dx * dx + dy * dy + dz * dz;
  const t =
    length === 0
      ? 0
      : Math.min(
          1,
          Math.max(
            0,
            ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy + (p[2] - a[2]) * dz) /
              length,
          ),
        );
  return [a[0] + dx * t, a[1] + dy * t, a[2] + dz * t];
}

const knot: ShapeBuilder = (out, start, count, random, { scale }) => {
  const sx = 0.5 * scale;
  const sy = 0.46 * scale;
  const sz = 0.32 * scale;
  const lift = 0.2 * scale;
  const lie = 1.0;
  const point = (t: number): Vec3 => {
    const y = (Math.cos(t) - 2 * Math.cos(2 * t)) * sy;
    const z = -Math.sin(3 * t) * sz;
    return [
      (Math.sin(t) + 2 * Math.sin(2 * t)) * sx,
      y * Math.cos(lie) - z * Math.sin(lie) + lift,
      y * Math.sin(lie) + z * Math.cos(lie),
    ];
  };
  for (let i = 0; i < count; i += 1) {
    const [x, y, z] = point(random() * TAU);
    const [dx, dy] = tube(random, 0.07 * scale);
    put(out, start + i, x + dx, y + dy, z);
  }
  const rightmost = Math.acos((Math.sqrt(129) - 1) / 16);
  const exit = point(rightmost);
  const reach = 2.6 * sx + 0.1;
  return {
    entry: point(Math.PI),
    exit,
    axis: [
      [-reach, exit[1], exit[2]],
      [reach, exit[1], exit[2]],
    ],
  };
};

const orbit: ShapeBuilder = (out, start, count, random, { scale }) => {
  const radius = 1.0 * scale;
  const tilt = 0.42;
  const lean = 0.3;
  const depth = -0.4;
  for (let i = 0; i < count; i += 1) {
    const t = random() * TAU;
    const [dx, dy] = tube(random, 0.07 * scale);
    const ring = Math.sin(t) * radius;
    const [x, y] = rotateZ(Math.cos(t) * radius, ring * Math.sin(tilt), lean);
    put(out, start + i, x + dx, y + dy, ring * Math.cos(tilt) + depth);
  }
  const [ex, ey] = rotateZ(radius, 0, lean);
  const end: Vec3 = [ex, ey, depth];
  return {
    entry: end,
    exit: end,
    axis: [[-ex, -ey, depth], end],
  };
};

const braid: ShapeBuilder = (
  out,
  start,
  count,
  random,
  { scale, halfWidth },
) => {
  const half = Math.min(2.3 * scale, 0.62 * halfWidth);
  const amplitude = 0.38 * scale;
  const depth = -0.8;
  for (let i = 0; i < count; i += 1) {
    const t = random();
    const angle = t * TAU * 2 + (i % 2) * Math.PI;
    const [dx, dy] = tube(random, 0.06 * scale);
    put(
      out,
      start + i,
      (t * 2 - 1) * half + dx,
      Math.sin(angle) * amplitude + dy,
      Math.cos(angle) * amplitude * 0.6 + depth,
    );
  }
  return {
    entry: [half, 0, depth],
    exit: [-half, 0, depth],
    axis: [
      [-half, 0, depth],
      [half, 0, depth],
    ],
  };
};

const rings: ShapeBuilder = (out, start, count, random, { scale }) => {
  const radius = 0.62 * scale;
  const gap = 0.85 * scale;
  const squash = 0.32;
  for (let i = 0; i < count; i += 1) {
    const ring = (i % 3) - 1;
    const t = random() * TAU;
    const r = radius + (random() - 0.5) * 0.08;
    const z = Math.sin(t) * r;
    put(
      out,
      start + i,
      Math.cos(t) * r,
      -ring * gap + z * squash + (random() - 0.5) * 0.03,
      z * 0.9,
    );
  }
  const top = gap + radius * squash;
  return {
    entry: [0, top, radius * 0.9],
    exit: [0, -top, -radius * 0.9],
    axis: [
      [0, top, 0],
      [0, -top, 0],
    ],
  };
};

const helix: ShapeBuilder = (
  out,
  start,
  count,
  random,
  { scale, halfWidth },
) => {
  const half = Math.min(2.1 * scale, 0.6 * halfWidth);
  const radius = 0.3 * scale;
  const turns = 5;
  const depth = -0.3;
  for (let i = 0; i < count; i += 1) {
    const t = i / count;
    const angle = t * TAU * turns;
    const r = radius + (random() - 0.5) * 0.1;
    put(
      out,
      start + i,
      (t * 2 - 1) * half,
      Math.cos(angle) * r,
      Math.sin(angle) * r + depth,
    );
  }
  return {
    entry: [half, 0, depth],
    exit: [-half, 0, depth],
    axis: [
      [-half, 0, depth],
      [half, 0, depth],
    ],
  };
};

const loop: ShapeBuilder = (out, start, count, random, { scale }) => {
  const a = 1.2 * scale;
  const depth = -0.4;
  for (let i = 0; i < count; i += 1) {
    const t = random() * TAU;
    const [dx, dy] = tube(random, 0.07 * scale);
    const d = 1 + Math.sin(t) * Math.sin(t);
    put(
      out,
      start + i,
      (a * Math.cos(t)) / d + dx,
      (a * Math.sin(t) * Math.cos(t)) / d + dy,
      Math.sin(2 * t) * 0.3 + depth,
    );
  }
  return {
    entry: [-a, 0, depth],
    exit: [a, 0, depth],
    axis: [
      [-a, 0, depth],
      [a, 0, depth],
    ],
  };
};

const shapes: readonly ShapeBuilder[] = [
  knot,
  orbit,
  braid,
  rings,
  helix,
  loop,
];

const WIDE_ANCHORS: readonly { fromRight: number; y: number }[] = [
  { fromRight: 2.0, y: 0.45 },
  { fromRight: 1.3, y: 1.4 },
  { fromRight: 2.5, y: 1.4 },
  { fromRight: 0.5, y: 0 },
  { fromRight: 2.4, y: -1.75 },
  { fromRight: 2.1, y: 1.65 },
  { fromRight: 0.4, y: 0 },
];

const NARROW_HERO_DROP = -0.45;
const MOTION_MARGIN = 0.25;

export function regionAnchor(
  region: number,
  layout: TrailLayout,
  anchorBounds: readonly AnchorBounds[],
) {
  const footer = region === SCENE_STOPS;
  if (!layout.wide) {
    return {
      x: footer ? layout.halfWidth - MOTION_MARGIN : 0,
      y: region === 0 ? NARROW_HERO_DROP : 0,
    };
  }
  const anchor = WIDE_ANCHORS[region];
  const bounds = anchorBounds[region];
  return {
    x: Math.max(
      bounds.min,
      Math.min(
        bounds.max,
        layout.contentHalfWidth - anchor.fromRight * layout.scale,
      ),
    ),
    y: anchor.y,
  };
}

type ThreadSpec = {
  start: number;
  count: number;
  region: number;
  from: Vec3;
  to: Vec3;
  via: number | null;
  anchorFrom: number;
  anchorTo: number;
};

function writeThread(
  positions: Float32Array,
  spines: Float32Array,
  info: Float32Array,
  spec: ThreadSpec,
  random: Random,
  layout: TrailLayout,
) {
  const { start, count, region, from, to, via, anchorFrom, anchorTo } = spec;
  const last = region === SCENE_STOPS - 1;
  const sway = 0.16 * layout.scale;
  for (let i = 0; i < count; i += 1) {
    const t = random();
    const s = smooth(t);
    const bell = Math.sin(t * Math.PI);
    const radius = 0.035 + 0.05 * (1 - bell) * (1 - bell);
    const [dx, dz] = tube(random, radius);
    let x = from[0] + (to[0] - from[0]) * s;
    x +=
      via === null
        ? Math.sin(t * 4.2 + region) * sway * bell
        : (via - (anchorFrom + (anchorTo - anchorFrom) * t) - x) *
          Math.sqrt(bell);
    const y = from[1] + (to[1] - from[1]) * t;
    const z = from[2] + (to[2] - from[2]) * s;
    put(positions, start + i, x + dx, y, z + dz);
    put(spines, start + i, x, y, z);
    const fade = last
      ? 1 - smooth(Math.min(1, Math.max(0, (t - 0.93) / 0.07)))
      : 1;
    const j = (start + i) * 4;
    info[j] = random();
    info[j + 1] = region;
    info[j + 2] = t;
    info[j + 3] = fade;
  }
}

export function buildTrail(count: number, layout: TrailLayout): TrailGeometry {
  if (shapes.length !== SCENE_STOPS) {
    throw new Error('scene: shape builders must match section count');
  }
  const positions = new Float32Array(count * 3);
  const spines = new Float32Array(count * 3);
  const info = new Float32Array(count * 4);

  const threadCount = Math.floor((count * THREAD_SHARE) / SCENE_STOPS);
  const shapeTotal = count - threadCount * SCENE_STOPS;
  const shapeCount = Math.floor(shapeTotal / SCENE_STOPS);
  const via = layout.wide ? null : layout.halfWidth - MOTION_MARGIN;

  const infos: ShapeInfo[] = [];
  const anchorBounds: AnchorBounds[] = [];
  let cursor = 0;
  shapes.forEach((build, region) => {
    const random = createRandom(1000 + region * 7919);
    const n = region === SCENE_STOPS - 1 ? shapeTotal - cursor : shapeCount;
    const shape = build(positions, cursor, n, random, layout);
    infos.push(shape);
    const bounds = { min: -Infinity, max: Infinity };
    for (let i = 0; i < n; i += 1) {
      const p = cursor + i;
      const spine = projectOnSegment(
        [positions[p * 3], positions[p * 3 + 1], positions[p * 3 + 2]],
        shape.axis[0],
        shape.axis[1],
      );
      put(spines, p, spine[0], spine[1], spine[2]);
      for (const [x, z] of [
        [positions[p * 3], positions[p * 3 + 2]],
        [spine[0], spine[2]],
      ]) {
        const halfWidth = layout.halfWidth * (1 - z / layout.cameraZ);
        bounds.min = Math.max(bounds.min, -halfWidth - x + MOTION_MARGIN);
        bounds.max = Math.min(bounds.max, halfWidth - x - MOTION_MARGIN);
      }
      const j = p * 4;
      info[j] = random();
      info[j + 1] = region;
      info[j + 2] = 0;
      info[j + 3] = 1;
    }
    anchorBounds.push(bounds);
    cursor += n;
  });

  anchorBounds.push({
    min: -layout.halfWidth + MOTION_MARGIN,
    max: layout.halfWidth - MOTION_MARGIN,
  });

  for (let region = 0; region < SCENE_STOPS; region += 1) {
    const next = infos[region + 1];
    writeThread(
      positions,
      spines,
      info,
      {
        start: cursor,
        count: threadCount,
        region,
        from: infos[region].exit,
        to: next ? next.entry : [0, 0, 0],
        via,
        anchorFrom: regionAnchor(region, layout, anchorBounds).x,
        anchorTo: regionAnchor(region + 1, layout, anchorBounds).x,
      },
      createRandom(500 + region * 131),
      layout,
    );
    cursor += threadCount;
  }

  return {
    positions,
    spines,
    info,
    anchorBounds,
  };
}
