import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { BufferAttribute, BufferGeometry, CanvasTexture } from 'three';
import type { Group } from 'three';
import {
  applyRadialBurst,
  buildNeighborPairs,
  generateSpherePositions,
  makeSoftCircleTexture,
  stepSpring,
} from '@/three/particles/utils';

const COUNT = 1800;
const NEIGHBOR_DIST = 0.32;
const MAX_PER_PARTICLE = 3;

export function SceneParticleConstellation() {
  const groupRef = useRef<Group>(null);

  const initial = useMemo(() => generateSpherePositions(COUNT, 1.55, 0.5), []);

  const particleGeo = useMemo(() => {
    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(initial.slice(), 3));
    return geo;
  }, [initial]);

  const pairs = useMemo(
    () => buildNeighborPairs(initial, COUNT, NEIGHBOR_DIST, MAX_PER_PARTICLE),
    [initial],
  );

  const lineGeo = useMemo(() => {
    const geo = new BufferGeometry();
    const arr = new Float32Array(pairs.length * 3);
    geo.setAttribute('position', new BufferAttribute(arr, 3));
    return geo;
  }, [pairs]);

  const velocities = useMemo(() => new Float32Array(COUNT * 3), []);

  const texture = useMemo(() => {
    const canvas = makeSoftCircleTexture(64);
    if (!canvas) return null;
    return new CanvasTexture(canvas);
  }, []);

  const handleBurst = () => {
    applyRadialBurst(velocities, initial, COUNT, 1.8, 0.8);
  };

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const positions = particleGeo.attributes.position.array as Float32Array;
    stepSpring(positions, initial, velocities, COUNT, dt, 4, 3);
    particleGeo.attributes.position.needsUpdate = true;

    const linePos = lineGeo.attributes.position.array as Float32Array;
    const pairCount = pairs.length / 2;
    for (let p = 0; p < pairCount; p++) {
      const i = pairs[p * 2];
      const j = pairs[p * 2 + 1];
      linePos[p * 6] = positions[i * 3];
      linePos[p * 6 + 1] = positions[i * 3 + 1];
      linePos[p * 6 + 2] = positions[i * 3 + 2];
      linePos[p * 6 + 3] = positions[j * 3];
      linePos[p * 6 + 4] = positions[j * 3 + 1];
      linePos[p * 6 + 5] = positions[j * 3 + 2];
    }
    lineGeo.attributes.position.needsUpdate = true;

    if (groupRef.current) {
      groupRef.current.rotation.y += dt * 0.05;
      const { x, y } = state.pointer;
      groupRef.current.rotation.y += x * dt * 0.18;
      groupRef.current.rotation.x += y * dt * 0.12;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh onClick={handleBurst}>
        <sphereGeometry args={[2.4, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial
          color="#008B7A"
          transparent
          opacity={0.18}
          depthWrite={false}
        />
      </lineSegments>
      <points geometry={particleGeo}>
        <pointsMaterial
          size={0.06}
          color="#cdeae6"
          transparent
          opacity={0.95}
          sizeAttenuation
          map={texture}
          alphaTest={0.001}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
