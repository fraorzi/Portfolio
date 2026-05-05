import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { SceneParticleConstellation } from './scenes/SceneParticleConstellation';

export function HeroCanvas() {
  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 6], fov: 40 }}
    >
      <Suspense fallback={null}>
        <SceneParticleConstellation />
      </Suspense>
    </Canvas>
  );
}
