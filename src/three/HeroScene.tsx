import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';

export function HeroScene() {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.15;
    meshRef.current.rotation.y += delta * 0.2;
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 2]} intensity={1.2} />
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <icosahedronGeometry args={[1.4, 1]} />
        <meshStandardMaterial
          color="#008B7A"
          roughness={0.25}
          metalness={0.55}
          flatShading
        />
      </mesh>
    </>
  );
}
