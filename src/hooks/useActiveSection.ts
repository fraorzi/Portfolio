import { useCallback, useSyncExternalStore, type RefObject } from 'react';
import { sections, type SectionId } from '@/content/site';

function subscribe(onChange: () => void) {
  window.addEventListener('scroll', onChange, { passive: true });
  window.addEventListener('resize', onChange);
  return () => {
    window.removeEventListener('scroll', onChange);
    window.removeEventListener('resize', onChange);
  };
}

function getServerSnapshot(): SectionId {
  return 'hero';
}

export function useActiveSection(
  enabled: boolean,
  anchorRef: RefObject<HTMLElement | null>,
): SectionId {
  const getSnapshot = useCallback((): SectionId => {
    if (!enabled) return 'hero';
    const anchor = anchorRef.current?.getBoundingClientRect();
    const y = anchor ? anchor.top + anchor.height / 2 : 0;
    let active: SectionId = 'hero';
    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (element && element.getBoundingClientRect().top <= y) {
        active = section.id;
      }
    }
    return active;
  }, [enabled, anchorRef]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
