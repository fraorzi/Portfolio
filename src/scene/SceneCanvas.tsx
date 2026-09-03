import { useEffect, useRef } from 'react';
import { createPointField } from '@/scene/pointField';

type SceneCanvasProps = {
  count: number;
  onSlowFrames?: () => void;
};

export function SceneCanvas({ count, onSlowFrames }: SceneCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const field = createPointField({ container, count, onSlowFrames });
    return () => field.dispose();
  }, [count, onSlowFrames]);

  return <div ref={containerRef} className="absolute inset-0" />;
}

export default SceneCanvas;
