
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { COLORS } from '../constants';

interface OrnamentProps {
  position: [number, number, number];
  color: string;
  type: 'bauble' | 'star' | 'diamond';
}

export const Ornament: React.FC<OrnamentProps> = ({ position, color, type }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh position={position} ref={meshRef}>
        {type === 'bauble' && <sphereGeometry args={[0.15, 32, 32]} />}
        {type === 'star' && <octahedronGeometry args={[0.2, 0]} />}
        {type === 'diamond' && <icosahedronGeometry args={[0.15, 0]} />}
        
        <MeshDistortMaterial
          color={color}
          speed={2}
          distort={0.2}
          metalness={0.9}
          roughness={0.1}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>
    </Float>
  );
};
