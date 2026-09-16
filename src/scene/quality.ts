export type QualityTier = 'high' | 'mid' | 'low' | 'poster';

export const POINT_COUNT: Record<Exclude<QualityTier, 'poster'>, number> = {
  high: 24000,
  mid: 9000,
  low: 8000,
};

export function detectQualityTier(): QualityTier {
  if (typeof window === 'undefined') return 'poster';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return 'poster';
  }

  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2', {
    antialias: false,
    alpha: true,
    powerPreference: 'high-performance',
    stencil: false,
    depth: false,
  });
  if (!gl) return 'poster';
  gl.getExtension('WEBGL_lose_context')?.loseContext();

  const memory =
    'deviceMemory' in navigator && typeof navigator.deviceMemory === 'number'
      ? navigator.deviceMemory
      : 8;
  const cores = navigator.hardwareConcurrency ?? 8;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const small = window.innerWidth < 768;

  if (memory <= 2 || cores <= 2) return 'low';
  if (memory < 4 || cores <= 4 || (coarse && small)) return 'mid';
  return 'high';
}

export function downgradeTier(tier: QualityTier): QualityTier {
  switch (tier) {
    case 'high':
      return 'mid';
    case 'mid':
    case 'low':
      return 'low';
    case 'poster':
      return 'poster';
    default: {
      const exhaustive: never = tier;
      return exhaustive;
    }
  }
}
