import { useRef, type ReactNode } from 'react';

import { Environment } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.8, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial color="#1a0c06" roughness={0.95} metalness={0.05} />
    </mesh>
  );
}

function Ceiling() {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4, 0]}>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial color="#0e0806" />
    </mesh>
  );
}

function WallBack() {
  return (
    <mesh position={[0, 1.2, -6]}>
      <planeGeometry args={[20, 8]} />
      <meshStandardMaterial color="#120a04" roughness={0.9} />
    </mesh>
  );
}

interface TableProps {
  position: [number, number, number];
}

function Table({ position }: TableProps) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.07, 0.9]} />
        <meshStandardMaterial color="#3d1f0d" roughness={0.55} metalness={0.15} />
      </mesh>
      {([-0.55, 0.55] as const).flatMap((x) =>
        ([-0.35, 0.35] as const).map((z) => (
          <mesh key={`${x}-${z}`} position={[x, -0.44, z]}>
            <cylinderGeometry args={[0.035, 0.035, 0.88, 8]} />
            <meshStandardMaterial color="#2a1208" />
          </mesh>
        )),
      )}
      {/* 캔들 */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.18, 8]} />
        <meshStandardMaterial color="#f0ebe0" emissive="#ffcc88" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

function Chair({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.55, 0.06, 0.5]} />
        <meshStandardMaterial color="#2e1a0a" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.38, -0.22]}>
        <boxGeometry args={[0.55, 0.7, 0.05]} />
        <meshStandardMaterial color="#2e1a0a" roughness={0.7} />
      </mesh>
    </group>
  );
}

function CandleFlicker({ position }: { position: [number, number, number] }) {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (!lightRef.current) return;
    const t = clock.elapsedTime;
    lightRef.current.intensity = 1.8 + Math.sin(t * 4.3) * 0.25 + Math.sin(t * 7.1) * 0.1;
  });

  return (
    <pointLight
      ref={lightRef}
      position={position}
      color="#ff7722"
      intensity={1.8}
      distance={7}
      decay={2}
      castShadow
    />
  );
}

interface CafeBackgroundProps {
  children?: ReactNode;
}

export function CafeBackground({ children }: CafeBackgroundProps) {
  return (
    <div className="absolute inset-0">
      <Canvas shadows camera={{ position: [0, 0.4, 5.5], fov: 52 }} gl={{ antialias: true }}>
        <color attach="background" args={['#080402']} />
        <fog attach="fog" args={['#080402', 9, 22]} />

        <ambientLight intensity={0.04} />

        <CandleFlicker position={[-2.8, -0.6, 1.8]} />
        <CandleFlicker position={[2.8, -0.6, 1.8]} />
        <CandleFlicker position={[0.2, -0.6, 2.8]} />

        {/* 창문 역광 */}
        <directionalLight position={[0, 6, -6]} color="#334488" intensity={0.4} />

        <Environment preset="night" />

        <Floor />
        <Ceiling />
        <WallBack />

        <Table position={[-2.8, -1.3, 1.8]} />
        <Table position={[2.8, -1.3, 1.8]} />
        <Table position={[0, -1.3, 3.2]} />

        <Chair position={[-2.8, -1.55, 2.6]} />
        <Chair position={[2.8, -1.55, 2.6]} />
        <Chair position={[0, -1.55, 4.0]} />
      </Canvas>

      {children}
    </div>
  );
}
