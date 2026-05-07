import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const NAV_OFFSET = -84;

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
          duration: 2.5,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
        });

    const scrollToHash = (hash: string, immediate = false) => {
      let id: string;
      try {
        id = decodeURIComponent(hash.slice(1));
      } catch {
        return false;
      }

      const target = document.getElementById(id);
      if (!target) return false;

      const offset = id === 'hero' ? 0 : NAV_OFFSET;

      if (reduced || !lenis) {
        const top =
          target.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({
          top: Math.max(0, top),
          left: 0,
          behavior: 'auto',
        });
        return true;
      }

      lenis.scrollTo(target, {
        offset,
        immediate,
        lock: !immediate,
      });
      return true;
    };

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
        url.search !== window.location.search ||
        url.hash.length <= 1
      ) {
        return;
      }

      if (!scrollToHash(url.hash)) return;

      event.preventDefault();
      removeHashFromUrl();
    };

    lenis?.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => lenis?.raf(time * 1000);
    if (lenis) {
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    document.addEventListener('click', onAnchorClick);

    return () => {
      document.removeEventListener('click', onAnchorClick);
      if (lenis) {
        gsap.ticker.remove(tick);
        lenis.destroy();
      }
    };
  }, [reduced]);

  return <>{children}</>;
}
