import type Lenis from 'lenis';

const NAV_OFFSET = -96;

const state: { lenis: Lenis | null; reduced: boolean } = {
  lenis: null,
  reduced: false,
};

export function registerLenis(lenis: Lenis | null, reduced: boolean) {
  state.lenis = lenis;
  state.reduced = reduced;
}

export function scrollToId(id: string, immediate = false): boolean {
  const target = document.getElementById(id);
  if (!target) return false;

  const offset = id === 'hero' ? 0 : NAV_OFFSET;

  if (state.reduced || !state.lenis) {
    const top = target.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top: Math.max(0, top), left: 0, behavior: 'auto' });
    return true;
  }

  state.lenis.scrollTo(target, { offset, immediate, lock: !immediate });
  return true;
}
