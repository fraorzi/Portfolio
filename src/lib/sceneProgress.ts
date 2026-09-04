import { footerTheme, sections, type SectionTheme } from '@/content/site';

export const SCENE_STOPS = sections.length;

export const sceneProgress = {
  value: 0,
  offset: 0,
  splitY: 2,
  themeAbove: 1,
  themeBelow: 1,
  pointerX: 0,
  pointerY: 0,
};

export function themeValue(theme: SectionTheme) {
  return theme === 'dark' ? 1 : 0;
}

type Layout = { tops: number[]; footerTop: number };

export function measureSections(): Layout {
  const tops: number[] = [];
  for (const meta of sections) {
    const section = document.getElementById(meta.id);
    tops.push(
      section ? section.getBoundingClientRect().top + window.scrollY : 0,
    );
  }
  const footer = document.querySelector('footer');
  const footerTop = footer
    ? footer.getBoundingClientRect().top + window.scrollY
    : Number.POSITIVE_INFINITY;
  return { tops, footerTop };
}

const MAX_OFFSET = 0.55;

function clamp01(n: number, max = 1) {
  return Math.min(max, Math.max(0, n));
}

export type SceneFrame = {
  value: number;
  offset: number;
  splitY: number;
  themeAbove: number;
  themeBelow: number;
};

export function computeFrame(
  layout: Layout,
  scrollY: number,
  vh: number,
): SceneFrame {
  const y = scrollY + vh / 2;
  const { tops, footerTop } = layout;
  const last = tops.length - 1;

  let value = 0;
  for (let k = 1; k <= last; k += 1) {
    value += clamp01((scrollY + vh - tops[k]) / vh);
  }

  const current = Math.min(last, Math.floor(value));
  const frac = value - current;
  const scrolledPast = (k: number) =>
    k > last ? 0 : clamp01((scrollY - tops[k]) / vh, MAX_OFFSET);
  const offset =
    scrolledPast(current) * (1 - frac) + scrolledPast(current + 1) * frac;

  const edges = tops.map((top, k) => ({
    top,
    above:
      k === 0
        ? themeValue(sections[0].theme)
        : themeValue(sections[k - 1].theme),
    below: themeValue(sections[k].theme),
  }));
  edges.push({
    top: footerTop,
    above: themeValue(sections[last].theme),
    below: themeValue(footerTheme),
  });

  let nearest = edges[0];
  let nearestDistance = Number.POSITIVE_INFINITY;
  for (const edge of edges) {
    const distance = Math.abs(edge.top - y);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = edge;
    }
  }

  const screenY = (nearest.top - scrollY) / vh;
  if (screenY < -0.1 || screenY > 1.1) {
    const theme = nearest.top <= y ? nearest.below : nearest.above;
    return { value, offset, splitY: 2, themeAbove: theme, themeBelow: theme };
  }

  return {
    value,
    offset,
    splitY: 1 - screenY * 2,
    themeAbove: nearest.above,
    themeBelow: nearest.below,
  };
}
