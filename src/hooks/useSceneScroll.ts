import { useEffect } from 'react';
import {
  computeProgress,
  measureSections,
  mixBackground,
  sceneProgress,
} from '@/lib/sceneProgress';

export function useSceneScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    let layout = measureSections();
    let frame = 0;

    const update = () => {
      frame = 0;
      const { value, bgMix } = computeProgress(
        layout,
        window.scrollY,
        window.innerHeight,
      );
      sceneProgress.value = value;
      sceneProgress.bgMix = bgMix;
      document.body.style.backgroundColor = mixBackground(bgMix);
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
      document.body.style.backgroundColor = '';
    };
  }, [enabled]);
}
