import type Lenis from 'lenis';

const state: { lenis: Lenis | null; reduced: boolean } = {
  lenis: null,
  reduced: false,
};

export function registerLenis(lenis: Lenis | null, reduced: boolean) {
  state.lenis = lenis;
  state.reduced = reduced;
}

export function lockScroll(locked: boolean) {
  if (state.lenis) {
    if (locked) state.lenis.stop();
    else state.lenis.start();
  }
  document.documentElement.style.overflow = locked ? 'hidden' : '';
}

export function scrollToId(id: string, immediate = false): boolean {
  const target = document.getElementById(id);
  if (!target) return false;

  if (state.reduced || !state.lenis) {
    const top = target.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: Math.max(0, top), left: 0, behavior: 'auto' });
    return true;
  }

  state.lenis.scrollTo(target, { immediate, lock: !immediate });
  return true;
}
