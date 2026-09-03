import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { sceneProgress } from '@/lib/sceneProgress';
import {
  detectQualityTier,
  downgradeTier,
  POINT_COUNT,
  type QualityTier,
} from '@/scene/quality';
import { ScenePoster } from '@/scene/ScenePoster';

const SceneCanvas = lazy(() => import('@/scene/SceneCanvas'));

type SceneProps = {
  active: boolean;
};

export function Scene({ active }: SceneProps) {
  const [downgrades, setDowngrades] = useState(0);
  const detected = useMemo(
    () => (active ? detectQualityTier() : null),
    [active],
  );
  const tier = detected
    ? Array.from({ length: downgrades }).reduce<QualityTier>(
        (current) => downgradeTier(current),
        detected,
      )
    : null;

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const onMove = (event: PointerEvent) => {
      sceneProgress.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      sceneProgress.pointerY = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  const handleSlowFrames = useCallback(() => {
    setDowngrades((n) => Math.min(2, n + 1));
  }, []);

  if (!tier) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {tier === 'poster' ? (
        <ScenePoster />
      ) : (
        <Suspense fallback={null}>
          <SceneCanvas
            count={POINT_COUNT[tier]}
            onSlowFrames={handleSlowFrames}
          />
        </Suspense>
      )}
    </div>
  );
}
