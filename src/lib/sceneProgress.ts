import { footerTheme, sections, type SectionTheme } from '@/content/site';

export const SCENE_STOPS = sections.length;
export const SCENE_REGIONS = SCENE_STOPS + 1;

export function themeValue(theme: SectionTheme) {
  return theme === 'dark' ? 1 : 0;
}

export const sceneThemes: readonly number[] = [
  ...sections.map((meta) => themeValue(meta.theme)),
  themeValue(footerTheme),
];

export type SceneLayout = {
  tops: readonly number[];
  heights: readonly number[];
  vh: number;
};

type SceneState = {
  layout: SceneLayout | null;
  pointerX: number;
  pointerY: number;
};

export const sceneProgress: SceneState = {
  layout: null,
  pointerX: 0,
  pointerY: 0,
};

function measureBox(element: Element | null) {
  if (!element) return { top: 0, height: 0 };
  const rect = element.getBoundingClientRect();
  return { top: rect.top + window.scrollY, height: rect.height };
}

export function measureLayout(): SceneLayout {
  const boxes = sections.map((meta) =>
    measureBox(document.getElementById(meta.id)),
  );
  boxes.push(measureBox(document.querySelector('footer')));
  return {
    tops: boxes.map((box) => box.top),
    heights: boxes.map((box) => box.height),
    vh: window.innerHeight,
  };
}
