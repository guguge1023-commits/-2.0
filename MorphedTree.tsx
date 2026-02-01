
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';
import { COLORS, MORPH_CONFIG, INITIAL_ORNAMENTS } from '../constants';
import { TreeMorphState } from '../types';
import { Ornament } from './Ornaments';

interface MorphedTreeProps {
  state: TreeMorphState;
}

const MorphedTree: React.FC<MorphedTreeProps> = ({ state }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const ornamentRefs = useRef<THREE.Group[]>([]);
  
  // Particle Data: treePosition vs scatterPosition
  const particles = useMemo(() => {
    const data = [];
    for (let i = 0; i < MORPH_CONFIG.particleCount; i++) {
      // Tree position (Cone distribution)
      const h = Math.random() * MORPH_CONFIG.treeHeight;
      const r = (1 - h / MORPH_CONFIG.treeHeight) * MORPH_CONFIG.treeBaseRadius;
      const angle = Math.random() * Math.PI * 2;
      
      const treePos = new THREE.Vector3(
        Math.cos(angle) * r,
        h,
        Math.sin(angle) * r
      );

      // Scatter position (Sphere distribution)
      const scatterPos = new THREE.Vector3().setFromSphericalCoords(
        Math.random() * MORPH_CONFIG.scatterRadius,
        Math.random() * Math.PI,
        Math.random() * Math.PI * 2
      );

      data.push({
        treePos,
        scatterPos,
        currentPos: scatterPos.clone(),
        phase: Math.random() * Math.PI * 2
      });
    }
    return data;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((clock) => {
    if (!meshRef.current) return;

    const t = clock.clock.getElapsedTime();
    const isTree = state === 'TREE_SHAPE';

    particles.forEach((p, i) => {
      const target = isTree ? p.treePos : p.scatterPos;
      
      // Smooth lerp
      p.currentPos.lerp(target, MORPH_CONFIG.transitionSpeed);
      
      // Add a slight "float" movement
      const floatX = Math.sin(t + p.phase) * 0.05;
      const floatY = Math.cos(t * 0.8 + p.phase) * 0.05;

      dummy.position.set(
        p.currentPos.x + floatX,
        p.currentPos.y + floatY,
        p.currentPos.z
      );
      
      const scale = isTree ? 0.02 + Math.sin(t * 2 + p.phase) * 0.01 : 0.04;
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* Trunk (Only visible or solid in tree shape) */}
      <mesh position={[0, -0.2, 0]} scale={state === 'TREE_SHAPE' ? 1 : 0}>
        <cylinderGeometry args={[0.2, 0.2, 0.4, 32]} />
        <meshStandardMaterial color="#2d1d11" roughness={0.8} transparent opacity={state === 'TREE_SHAPE' ? 1 : 0} />
      </mesh>

      {/* Main Instanced Particles (The Leaves) */}
      <instancedMesh ref={meshRef} args={[null as any, null as any, MORPH_CONFIG.particleCount]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color={COLORS.emerald} 
          emissive={COLORS.emerald} 
          emissiveIntensity={0.2} 
          roughness={0.5} 
          metalness={0.5} 
        />
      </instancedMesh>

      {/* Topper Star Morphing */}
      <group position={[0, 3.4, 0]} scale={state === 'TREE_SHAPE' ? 1 : 0}>
          <mesh>
            <octahedronGeometry args={[0.25, 0]} />
            <meshStandardMaterial 
              color={COLORS.brightGold} 
              emissive={COLORS.brightGold} 
              emissiveIntensity={2} 
              metalness={1} 
            />
            <pointLight color={COLORS.brightGold} intensity={2} distance={5} />
          </mesh>
      </group>

      {/* Morphed Ornaments */}
      {INITIAL_ORNAMENTS.map((orn, idx) => (
        <MorphedOrnament key={orn.id} data={orn} activeState={state} />
      ))}

      <Sparkles count={state === 'TREE_SHAPE' ? 50 : 200} scale={8} size={2} speed={0.4} color={COLORS.gold} />
    </group>
  );
};

const MorphedOrnament: React.FC<{ data: any, activeState: TreeMorphState }> = ({ data, activeState }) => {
  const groupRef = useRef<THREE.Group>(null);
  const currentPos = useRef(new THREE.Vector3(...data.scatterPosition));

  useFrame(() => {
    if (!groupRef.current) return;
    const target = activeState === 'TREE_SHAPE' ? new THREE.Vector3(...data.position) : new THREE.Vector3(...data.scatterPosition);
    currentPos.current.lerp(target, MORPH_CONFIG.transitionSpeed);
    groupRef.current.position.copy(currentPos.current);
  });

  return (
    <group ref={groupRef}>
      <Ornament position={[0, 0, 0]} color={data.color} type={data.type} />
    </group>
  );
};

export default MorphedTree;
