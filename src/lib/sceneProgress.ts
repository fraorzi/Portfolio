import { sections } from '@/content/site';

export const SCENE_STOPS = sections.length;

export const sceneProgress = {
  value: 0,
  bgMix: 1,
  pointerX: 0,
  pointerY: 0,
};

const PAPER: [number, number, number] = [0xf4 / 255, 0xf1 / 255, 0xea / 255];
const INK: [number, number, number] = [0x12 / 255, 0x11 / 255, 0x0f / 255];

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export function themeValue(theme: 'light' | 'dark') {
  return theme === 'dark' ? 1 : 0;
}

export function mixBackground(mix: number) {
  const r = PAPER[0] + (INK[0] - PAPER[0]) * mix;
  const g = PAPER[1] + (INK[1] - PAPER[1]) * mix;
  const b = PAPER[2] + (INK[2] - PAPER[2]) * mix;
  return `rgb(${Math.round(r * 255)} ${Math.round(g * 255)} ${Math.round(b * 255)})`;
}

type Layout = { centers: number[]; tops: number[] };

export function measureSections(): Layout {
  const centers: number[] = [];
  const tops: number[] = [];
  for (const meta of sections) {
    const section = document.getElementById(meta.id);
    if (!section) {
      centers.push(0);
      tops.push(0);
      continue;
    }
    const el = section.closest<HTMLElement>('[data-scene-frame]') ?? section;
    const rect = el.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    tops.push(top);
    centers.push(top + rect.height / 2);
  }
  return { centers, tops };
}

export function computeProgress(layout: Layout, scrollY: number, vh: number) {
  const y = scrollY + vh / 2;
  const { centers, tops } = layout;
  const last = centers.length - 1;

  let value: number;
  if (y <= centers[0]) value = 0;
  else if (y >= centers[last]) value = last;
  else {
    let i = 0;
    while (i < last && y > centers[i + 1]) i += 1;
    const span = centers[i + 1] - centers[i] || 1;
    value = i + (y - centers[i]) / span;
  }

  const radius = vh * 0.28;
  let bgMix = themeValue(sections[0].theme);
  for (let k = 1; k < sections.length; k += 1) {
    const delta =
      themeValue(sections[k].theme) - themeValue(sections[k - 1].theme);
    if (delta === 0) continue;
    bgMix += delta * smoothstep(tops[k] - radius, tops[k] + radius, y);
  }

  return { value, bgMix };
}
