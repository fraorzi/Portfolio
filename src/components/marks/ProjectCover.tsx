import { useMemo } from 'react';
import { cn } from '@/lib/cn';

type ProjectCoverProps = {
  seed: string;
  className?: string;
};

const WIDTH = 400;
const HEIGHT = 300;

function hashSeed(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function createRandom(seed: number) {
  let state = seed || 1;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Motif = 'contours' | 'weave' | 'halftone' | 'arcs';
const MOTIFS: readonly Motif[] = ['contours', 'weave', 'halftone', 'arcs'];

function contourPath(
  baseY: number,
  amplitude: number,
  phase: number,
  frequency: number,
) {
  const steps = 24;
  let d = '';
  for (let i = 0; i <= steps; i += 1) {
    const x = (WIDTH / steps) * i;
    const y =
      baseY +
      Math.sin((i / steps) * Math.PI * frequency + phase) * amplitude +
      Math.sin((i / steps) * Math.PI * frequency * 2.3 + phase * 1.7) *
        amplitude *
        0.35;
    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

function buildContours(random: () => number) {
  const lines = 14;
  const amplitude = 10 + random() * 14;
  const frequency = 1.5 + random() * 1.5;
  const phase = random() * Math.PI * 2;
  const accent = Math.floor(random() * lines);
  return Array.from({ length: lines }, (_, i) => ({
    d: contourPath(30 + i * 18, amplitude, phase + i * 0.35, frequency),
    accent: i === accent,
  }));
}

function buildWeave(random: () => number) {
  const cols = 10;
  const rows = 8;
  const cellW = WIDTH / cols;
  const cellH = HEIGHT / rows;
  const skip = Math.floor(random() * cols * rows);
  const accent = Math.floor(random() * cols * rows);
  const strokes: { d: string; accent: boolean; ochre: boolean }[] = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const idx = r * cols + c;
      if (idx === skip) continue;
      const x = c * cellW;
      const y = r * cellH;
      const horizontal = (r + c) % 2 === 0;
      const inset = 6;
      const d = horizontal
        ? `M${x + inset} ${y + cellH / 2}H${x + cellW - inset}`
        : `M${x + cellW / 2} ${y + inset}V${y + cellH - inset}`;
      strokes.push({ d, accent: idx === accent, ochre: idx === skip + 1 });
    }
  }
  return strokes;
}

function buildHalftone(random: () => number) {
  const cols = 16;
  const rows = 12;
  const cellW = WIDTH / cols;
  const cellH = HEIGHT / rows;
  const fx = random() * WIDTH;
  const fy = random() * HEIGHT;
  const spread = 140 + random() * 120;
  const accentIdx = Math.floor(random() * cols * rows);
  const dots: { cx: number; cy: number; r: number; accent: boolean }[] = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const cx = c * cellW + cellW / 2;
      const cy = r * cellH + cellH / 2;
      const dist = Math.hypot(cx - fx, cy - fy);
      const radius = Math.max(0.6, 6.5 * (1 - Math.min(1, dist / spread)));
      dots.push({ cx, cy, r: radius, accent: r * cols + c === accentIdx });
    }
  }
  return dots;
}

function buildArcs(random: () => number) {
  const cx = 80 + random() * 240;
  const cy = 60 + random() * 180;
  const count = 12;
  const gap = 16 + random() * 8;
  const accent = Math.floor(random() * count);
  return Array.from({ length: count }, (_, i) => ({
    cx,
    cy,
    r: 12 + i * gap,
    accent: i === accent,
    dash: i % 3 === 2,
  }));
}

type Art =
  | { motif: 'contours'; items: ReturnType<typeof buildContours> }
  | { motif: 'weave'; items: ReturnType<typeof buildWeave> }
  | { motif: 'halftone'; items: ReturnType<typeof buildHalftone> }
  | { motif: 'arcs'; items: ReturnType<typeof buildArcs> };

function buildArt(seed: string): Art {
  const hash = hashSeed(seed);
  const random = createRandom(hash);
  const motif = MOTIFS[hash % MOTIFS.length];
  switch (motif) {
    case 'contours':
      return { motif, items: buildContours(random) };
    case 'weave':
      return { motif, items: buildWeave(random) };
    case 'halftone':
      return { motif, items: buildHalftone(random) };
    case 'arcs':
      return { motif, items: buildArcs(random) };
  }
}

export function ProjectCover({ seed, className }: ProjectCoverProps) {
  const art = useMemo(() => buildArt(seed), [seed]);

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      className={cn('block h-full w-full', className)}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={1.25}
        strokeLinecap="round"
        className="text-foreground/55"
      >
        {art.motif === 'contours' &&
          art.items.map((line, i) => (
            <path
              key={i}
              d={line.d}
              className={line.accent ? 'text-primary-600' : undefined}
              strokeWidth={line.accent ? 1.75 : undefined}
            />
          ))}
        {art.motif === 'weave' &&
          art.items.map((stroke, i) => (
            <path
              key={i}
              d={stroke.d}
              className={cn(
                stroke.accent && 'text-primary-600',
                stroke.ochre && 'text-ochre',
              )}
              strokeWidth={stroke.accent || stroke.ochre ? 2 : undefined}
            />
          ))}
        {art.motif === 'halftone' &&
          art.items.map((dot, i) => (
            <circle
              key={i}
              cx={dot.cx}
              cy={dot.cy}
              r={dot.r}
              fill="currentColor"
              stroke="none"
              className={dot.accent ? 'text-primary-600' : undefined}
            />
          ))}
        {art.motif === 'arcs' &&
          art.items.map((arc, i) => (
            <circle
              key={i}
              cx={arc.cx}
              cy={arc.cy}
              r={arc.r}
              strokeDasharray={arc.dash ? '3 9' : undefined}
              className={arc.accent ? 'text-primary-600' : undefined}
              strokeWidth={arc.accent ? 1.75 : undefined}
            />
          ))}
      </g>
      <circle cx={WIDTH - 28} cy={HEIGHT - 28} r={3} className="fill-ochre" />
    </svg>
  );
}
