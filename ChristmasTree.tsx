
import React, { useMemo } from 'react';
import { MeshWobbleMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { COLORS } from '../constants';
import { Ornament } from './Ornaments';

const TreeLayer: React.FC<{ radius: number, height: number, y: number }> = ({ radius, height, y }) => {
  return (
    <mesh position={[0, y, 0]} castShadow receiveShadow>
      <coneGeometry args={[radius, height, 64]} />
      <MeshWobbleMaterial 
        color={COLORS.emerald} 
        factor={0.05} 
        speed={1} 
        roughness={0.4} 
        metalness={0.2} 
      />
    </mesh>
  );
};

const ChristmasTree: React.FC = () => {
  const layers = [
    { radius: 1.5, height: 1.5, y: 0.75 },
    { radius: 1.2, height: 1.2, y: 1.6 },
    { radius: 0.9, height: 1.0, y: 2.3 },
    { radius: 0.6, height: 0.8, y: 2.9 },
  ];

  const lights = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 40; i++) {
      const angle = (i / 40) * Math.PI * 8; // spiral
      const y = (i / 40) * 3.2;
      const r = (1.5 - (y / 3.5) * 1.5) * 0.9;
      arr.push({
        position: [Math.cos(angle) * r, y, Math.sin(angle) * r] as [number, number, number],
        color: i % 2 === 0 ? COLORS.gold : COLORS.whiteGold
      });
    }
    return arr;
  }, []);

  return (
    <group>
      {/* Trunk */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.4, 32]} />
        <meshStandardMaterial color="#2d1d11" roughness={0.8} />
      </mesh>

      {/* Foliage Layers */}
      {layers.map((l, i) => (
        <TreeLayer key={i} {...l} />
      ))}

      {/* Topper Star */}
      <mesh position={[0, 3.4, 0]}>
        <octahedronGeometry args={[0.25, 0]} />
        <meshStandardMaterial 
          color={COLORS.brightGold} 
          emissive={COLORS.brightGold} 
          emissiveIntensity={2} 
          metalness={1} 
        />
        <pointLight color={COLORS.brightGold} intensity={2} distance={5} />
      </mesh>

      {/* Decorative Ornaments */}
      <Ornament position={[0.8, 0.5, 0.4]} color={COLORS.gold} type="bauble" />
      <Ornament position={[-0.7, 1.2, -0.5]} color={COLORS.whiteGold} type="diamond" />
      <Ornament position={[0.4, 1.8, -0.3]} color={COLORS.brightGold} type="bauble" />
      <Ornament position={[-0.3, 2.4, 0.2]} color={COLORS.gold} type="star" />
      <Ornament position={[0.5, 0.8, -0.6]} color={COLORS.whiteGold} type="bauble" />

      {/* Fairy Lights */}
      {lights.map((light, idx) => (
        <group key={idx} position={light.position}>
          <mesh>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial color={light.color} emissive={light.color} emissiveIntensity={5} />
          </mesh>
          <pointLight color={light.color} intensity={0.2} distance={1} />
        </group>
      ))}

      {/* Environmental Sparkles */}
      <Sparkles count={100} scale={5} size={2} speed={0.4} color={COLORS.gold} />
    </group>
  );
};

export default ChristmasTree;
