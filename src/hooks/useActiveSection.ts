import { useEffect, useState } from 'react';
import { sections, type SectionId } from '@/content/site';

export function useActiveSection(enabled: boolean): SectionId {
  const [active, setActive] = useState<SectionId>('hero');

  useEffect(() => {
    if (!enabled) return;

    const visible = new Map<SectionId, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible.set(
            entry.target.id as SectionId,
            entry.isIntersecting ? entry.intersectionRect.height : 0,
          );
        }
        let best: SectionId | null = null;
        let bestHeight = 0;
        for (const meta of sections) {
          const height = visible.get(meta.id) ?? 0;
          if (height > bestHeight) {
            bestHeight = height;
            best = meta.id;
          }
        }
        if (best) setActive(best);
      },
      {
        rootMargin: '-45% 0px -45% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    for (const meta of sections) {
      const el = document.getElementById(meta.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [enabled]);

  return active;
}
