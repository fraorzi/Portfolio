import { useLayoutEffect, type RefObject } from 'react';
import { gsap } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type Options = {
  selector?: string;
  y?: number;
  duration?: number;
  stagger?: number;
  start?: string;
  ease?: string;
  delay?: number;
};

export function useScrollReveal<T extends HTMLElement>(
  ref: RefObject<T | null>,
  {
    selector = '[data-reveal]',
    y = 24,
    duration = 0.9,
    stagger = 0.08,
    start = 'top 85%',
    ease = 'power3.out',
    delay = 0,
  }: Options = {},
) {
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;

    const targets = root.querySelectorAll<HTMLElement>(selector);
    if (targets.length === 0) return;

    if (reduced) {
      gsap.set(targets, { opacity: 1, y: 0, clearProps: 'transform' });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { y, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration,
          stagger,
          ease,
          delay,
          scrollTrigger: {
            trigger: root,
            start,
            once: true,
          },
        },
      );
    }, root);

    return () => ctx.revert();
  }, [ref, reduced, selector, y, duration, stagger, start, ease, delay]);
}
