import { footerTheme, sections, type SectionTheme } from '@/content/site';

export const SCENE_STOPS = sections.length;

export type ScreenPoint = { x: number; y: number };

type Layout = {
  tops: number[];
  footerTop: number;
  anchors: (ScreenPoint | null)[];
};

export const sceneProgress: {
  layout: Layout | null;
  pointerX: number;
  pointerY: number;
} = {
  layout: null,
  pointerX: 0,
  pointerY: 0,
};

export function themeValue(theme: SectionTheme) {
  return theme === 'dark' ? 1 : 0;
}

export function measureSections(): Layout {
  const tops: number[] = [];
  const anchors: (ScreenPoint | null)[] = [];
  for (const meta of sections) {
    const section = document.getElementById(meta.id);
    const box = section?.getBoundingClientRect();
    tops.push(box ? box.top + window.scrollY : 0);
    const anchor = section
      ?.querySelector('[data-scene-anchor]')
      ?.getBoundingClientRect();
    anchors.push(
      box && anchor
        ? {
            x: anchor.left + anchor.width / 2,
            y: anchor.top + anchor.height / 2 - box.top,
          }
        : null,
    );
  }
  const footer = document.querySelector('footer');
  const footerTop = footer
    ? footer.getBoundingClientRect().top + window.scrollY
    : Number.POSITIVE_INFINITY;
  return { tops, footerTop, anchors };
}

export const MAX_OFFSET = 0.55;
export const THREAD_WINDOW = { start: 0.42, end: 0.58 };

function clamp01(n: number, max = 1) {
  return Math.min(max, Math.max(0, n));
}

export type SceneFrame = {
  value: number;
  offsets: number[];
  splitY: number;
  themeAbove: number;
  themeBelow: number;
};

const IDLE_FRAME: SceneFrame = {
  value: 0,
  offsets: [],
  splitY: 2,
  themeAbove: 1,
  themeBelow: 1,
};

export function readSceneFrame(): SceneFrame {
  const { layout } = sceneProgress;
  return layout
    ? computeFrame(layout, window.scrollY, window.innerHeight)
    : IDLE_FRAME;
}

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

  const offsets = tops.map((top) =>
    Math.max(-1, Math.min(MAX_OFFSET, (scrollY - top) / vh)),
  );

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
    return { value, offsets, splitY: 2, themeAbove: theme, themeBelow: theme };
  }

  return {
    value,
    offsets,
    splitY: 1 - screenY * 2,
    themeAbove: nearest.above,
    themeBelow: nearest.below,
  };
}

export function sectionShift(frame: SceneFrame, progress: number) {
  const index = Math.floor(progress);
  const from = frame.offsets[index] ?? 0;
  const to = frame.offsets[index + 1] ?? from;
  const t = clamp01(
    (progress - index - THREAD_WINDOW.start) /
      (THREAD_WINDOW.end - THREAD_WINDOW.start),
  );
  return from + (to - from) * t * t * (3 - 2 * t);
}
