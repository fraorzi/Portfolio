export type QualityTier = 'high' | 'mid' | 'poster';

export const POINT_COUNT: Record<Exclude<QualityTier, 'poster'>, number> = {
  high: 54000,
  mid: 21000,
};

type NavigatorHints = Navigator & { deviceMemory?: number };

export function detectQualityTier(): QualityTier {
  if (typeof window === 'undefined') return 'poster';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return 'poster';
  }

  const canvas = document.createElement('canvas');
  const gl =
    canvas.getContext('webgl2') ??
    (canvas.getContext('webgl') as WebGLRenderingContext | null);
  if (!gl) return 'poster';

  const nav = navigator as NavigatorHints;
  const memory = nav.deviceMemory ?? 8;
  const cores = nav.hardwareConcurrency ?? 8;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const small = window.innerWidth < 768;

  if (memory <= 2 || cores <= 2) return 'poster';
  if (memory < 4 || cores <= 4 || (coarse && small)) return 'mid';
  return 'high';
}

export function downgradeTier(tier: QualityTier): QualityTier {
  if (tier === 'high') return 'mid';
  return 'poster';
}
