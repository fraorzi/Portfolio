import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';
import { registerLenis, scrollToId } from '@/lib/scroll';
import { useReducedMotion } from '@/hooks/useReducedMotion';

function removeHashFromUrl() {
  if (!window.location.hash) return;
  window.history.replaceState(
    null,
    '',
    `${window.location.pathname}${window.location.search}`,
  );
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    removeHashFromUrl();

    const lenis = reduced
      ? null
      : new Lenis({
          duration: 1.6,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
        });
    registerLenis(lenis, reduced);

    const onAnchorClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.altKey ||
        event.ctrlKey ||
        event.shiftKey
      ) {
        return;
      }

      const target =
        event.target instanceof Element
          ? event.target
          : event.target instanceof Node
            ? event.target.parentElement
            : null;

      const anchor = target?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;

      const url = new URL(anchor.href);
      if (
        url.origin !== window.location.origin ||
        url.pathname !== window.location.pathname ||
        url.hash.length <= 1
      ) {
        return;
      }

      let id: string;
      try {
        id = decodeURIComponent(url.hash.slice(1));
      } catch {
        return;
      }

      if (!scrollToId(id)) return;
      event.preventDefault();
      removeHashFromUrl();
    };

    let frame = 0;
    const tick = (time: number) => {
      lenis?.raf(time);
      frame = window.requestAnimationFrame(tick);
    };
    if (lenis) frame = window.requestAnimationFrame(tick);

    document.addEventListener('click', onAnchorClick);

    return () => {
      document.removeEventListener('click', onAnchorClick);
      if (lenis) {
        window.cancelAnimationFrame(frame);
        lenis.destroy();
      }
      registerLenis(null, reduced);
    };
  }, [reduced]);

  return <>{children}</>;
}
