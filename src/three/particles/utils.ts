export function generateSpherePositions(
  count: number,
  radius: number,
  spread: number,
): Float32Array {
  const arr = new Float32Array(count * 3);
  let seed = 0x9e3779b1;
  const rand = () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = 0; i < count; i++) {
    const r = radius + rand() * spread;
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(2 * rand() - 1);
    arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    arr[i * 3 + 2] = r * Math.cos(phi);
  }
  return arr;
}

export function applyRadialBurst(
  velocities: Float32Array,
  initial: Float32Array,
  count: number,
  force: number,
  jitter: number,
) {
  let seed = Date.now() & 0xffffffff || 1;
  const rand = () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = 0; i < count; i++) {
    const x = initial[i * 3];
    const y = initial[i * 3 + 1];
    const z = initial[i * 3 + 2];
    const len = Math.sqrt(x * x + y * y + z * z) || 1;
    const f = force + (rand() - 0.5) * jitter;
    velocities[i * 3] += (x / len) * f;
    velocities[i * 3 + 1] += (y / len) * f;
    velocities[i * 3 + 2] += (z / len) * f;
  }
}

export function stepSpring(
  positions: Float32Array,
  initial: Float32Array,
  velocities: Float32Array,
  count: number,
  dt: number,
  k: number,
  damping: number,
) {
  for (let i = 0; i < count; i++) {
    const ix = i * 3;
    const iy = i * 3 + 1;
    const iz = i * 3 + 2;
    const dx = positions[ix] - initial[ix];
    const dy = positions[iy] - initial[iy];
    const dz = positions[iz] - initial[iz];
    velocities[ix] += (-k * dx - damping * velocities[ix]) * dt;
    velocities[iy] += (-k * dy - damping * velocities[iy]) * dt;
    velocities[iz] += (-k * dz - damping * velocities[iz]) * dt;
    positions[ix] += velocities[ix] * dt;
    positions[iy] += velocities[iy] * dt;
    positions[iz] += velocities[iz] * dt;
  }
}

export function applyCursorRepel(
  velocities: Float32Array,
  positions: Float32Array,
  count: number,
  cx: number,
  cy: number,
  cz: number,
  strength: number,
  radius: number,
  dt: number,
) {
  const r2 = radius * radius;
  for (let i = 0; i < count; i++) {
    const dx = positions[i * 3] - cx;
    const dy = positions[i * 3 + 1] - cy;
    const dz = positions[i * 3 + 2] - cz;
    const d2 = dx * dx + dy * dy + dz * dz;
    if (d2 > r2 || d2 < 0.0001) continue;
    const d = Math.sqrt(d2);
    const falloff = 1 - d / radius;
    const f = strength * falloff * falloff;
    velocities[i * 3] += (dx / d) * f * dt;
    velocities[i * 3 + 1] += (dy / d) * f * dt;
    velocities[i * 3 + 2] += (dz / d) * f * dt;
  }
}

export function buildNeighborPairs(
  positions: Float32Array,
  count: number,
  maxDist: number,
  maxPerParticle: number,
): Uint32Array {
  const pairs: number[] = [];
  const counts = new Uint8Array(count);
  const maxDist2 = maxDist * maxDist;
  for (let i = 0; i < count; i++) {
    if (counts[i] >= maxPerParticle) continue;
    for (let j = i + 1; j < count; j++) {
      if (counts[j] >= maxPerParticle) continue;
      const dx = positions[i * 3] - positions[j * 3];
      const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
      const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
      const d2 = dx * dx + dy * dy + dz * dz;
      if (d2 < maxDist2) {
        pairs.push(i, j);
        counts[i]++;
        counts[j]++;
        if (counts[i] >= maxPerParticle) break;
      }
    }
  }
  return Uint32Array.from(pairs);
}

export function makeSoftCircleTexture(size = 64) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  if (!ctx) return null;
  const half = size / 2;
  const g = ctx.createRadialGradient(half, half, 0, half, half, half);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.45, 'rgba(255,255,255,0.55)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return c;
}
