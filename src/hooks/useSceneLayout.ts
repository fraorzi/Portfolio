import { useEffect } from 'react';
import { measureLayout, sceneProgress } from '@/lib/sceneProgress';

export function useSceneLayout(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    let frame = 0;
    const remeasure = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        sceneProgress.layout = measureLayout();
      });
    };

    const observer = new ResizeObserver(remeasure);
    observer.observe(document.body);
    window.addEventListener('resize', remeasure);
    sceneProgress.layout = measureLayout();

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', remeasure);
      if (frame) window.cancelAnimationFrame(frame);
      sceneProgress.layout = null;
    };
  }, [enabled]);
}
