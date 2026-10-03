import { useEffect } from 'react';
import { measureSections, sceneProgress } from '@/lib/sceneProgress';

export function useSceneLayout(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const measure = () => {
      sceneProgress.layout = measureSections();
    };

    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener('resize', measure);
    measure();

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
      sceneProgress.layout = null;
    };
  }, [enabled]);
}
