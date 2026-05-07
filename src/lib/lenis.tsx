import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const NAV_OFFSET = -84;

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    const lenis = reduced
      ? null
      : new Lenis({
          duration: 2.5,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
        });

    const scrollToHash = (hash: string, immediate = false) => {
      const id = decodeURIComponent(hash.slice(1));
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
      window.history.pushState(null, '', url.hash);
    };

    const onPopState = () => {
      if (window.location.hash.length > 1) {
        scrollToHash(window.location.hash);
      }
    };

    lenis?.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => lenis?.raf(time * 1000);
    if (lenis) {
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    const hashFrame = window.requestAnimationFrame(() => {
      if (window.location.hash.length > 1) {
        const didScroll = scrollToHash(window.location.hash, true);
        if (didScroll) {
          window.requestAnimationFrame(() => {
            ScrollTrigger.refresh();
            ScrollTrigger.update();
          });
        }
      }
    });

    document.addEventListener('click', onAnchorClick);
    window.addEventListener('popstate', onPopState);

    return () => {
      window.cancelAnimationFrame(hashFrame);
      document.removeEventListener('click', onAnchorClick);
      window.removeEventListener('popstate', onPopState);
      if (lenis) {
        gsap.ticker.remove(tick);
        lenis.destroy();
      }
    };
  }, [reduced]);

  return <>{children}</>;
}
