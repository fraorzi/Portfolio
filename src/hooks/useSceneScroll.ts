import { useEffect } from 'react';
import {
  computeFrame,
  measureSections,
  sceneProgress,
} from '@/lib/sceneProgress';

export function useSceneScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    let layout = measureSections();
    let frame = 0;

    const update = () => {
      frame = 0;
      const next = computeFrame(layout, window.scrollY, window.innerHeight);
      sceneProgress.value = next.value;
      sceneProgress.offset = next.offset;
      sceneProgress.splitY = next.splitY;
      sceneProgress.themeAbove = next.themeAbove;
      sceneProgress.themeBelow = next.themeBelow;
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    const remeasure = () => {
      layout = measureSections();
      schedule();
    };

    const observer = new ResizeObserver(remeasure);
    observer.observe(document.body);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', remeasure);
    update();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', remeasure);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [enabled]);
}
