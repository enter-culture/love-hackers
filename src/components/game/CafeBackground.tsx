import { Suspense, useRef, type ReactNode } from 'react';

import { Billboard, Environment, Sparkles, useTexture } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ─── 바닥 (나무 마루) ─── */
function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="#7B4F2E" roughness={0.65} metalness={0.05} />
    </mesh>
  );
}

/* ─── 뒷벽 ─── */
function BackWall() {
  return (
    <mesh position={[0, 1.5, -5]} receiveShadow>
      <planeGeometry args={[20, 8]} />
      <meshStandardMaterial color="#9E8870" roughness={0.85} />
    </mesh>
  );
}

/* ─── 좌우 벽 ─── */
function SideWall({ x }: { x: number }) {
  return (
    <mesh position={[x, 1.5, -1]} rotation={[0, x > 0 ? -Math.PI / 2 : Math.PI / 2, 0]}>
      <planeGeometry args={[12, 8]} />
      <meshStandardMaterial color="#907A68" roughness={0.85} />
    </mesh>
  );
}

/* ─── 천장 ─── */
function Ceiling() {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4.5, -1]}>
      <planeGeometry args={[20, 12]} />
      <meshStandardMaterial color="#6B523C" roughness={0.9} />
    </mesh>
  );
}

/* ─── 카운터 바 ─── */
function Counter() {
  return (
    <group position={[0, -0.55, -4]}>
      <mesh castShadow>
        <boxGeometry args={[6, 0.1, 1.2]} />
        <meshStandardMaterial color="#5C3A1A" roughness={0.45} metalness={0.1} />
      </mesh>
      <mesh position={[0, -0.6, 0]}>
        <boxGeometry args={[6, 1.1, 1.2]} />
        <meshStandardMaterial color="#4A2E10" roughness={0.7} />
      </mesh>
      {[-1.5, 0, 1.5].map((x, i) => (
        <group key={i} position={[x, 0.12, 0]}>
          <mesh>
            <cylinderGeometry args={[0.08, 0.06, 0.2, 12]} />
            <meshStandardMaterial color={['#FFFFFF', '#F5E6C8', '#D4C4A8'][i]} />
          </mesh>
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.075, 0.075, 0.04, 12]} />
            <meshStandardMaterial color="#4A2E10" roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ─── 원형 테이블 ─── */
function RoundTable({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.07, 24]} />
        <meshStandardMaterial color="#5C3A1A" roughness={0.5} metalness={0.05} />
      </mesh>
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 1.0, 12]} />
        <meshStandardMaterial color="#3E2510" roughness={0.6} />
      </mesh>
      <mesh position={[0, -1.05, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.05, 24]} />
        <meshStandardMaterial color="#3E2510" roughness={0.7} />
      </mesh>
      <mesh position={[0.15, 0.1, 0.1]}>
        <cylinderGeometry args={[0.06, 0.05, 0.14, 12]} />
        <meshStandardMaterial color="#F5F0E8" />
      </mesh>
    </group>
  );
}

/* ─── 의자 ─── */
function Chair({ position, angle = 0 }: { position: [number, number, number]; angle?: number }) {
  return (
    <group position={position} rotation={[0, angle, 0]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.5, 0.06, 0.48]} />
        <meshStandardMaterial color="#3E2510" roughness={0.65} />
      </mesh>
      <mesh position={[0, 0.38, -0.22]}>
        <boxGeometry args={[0.5, 0.68, 0.06]} />
        <meshStandardMaterial color="#3E2510" roughness={0.65} />
      </mesh>
      {[-0.18, 0.18].flatMap((x) =>
        [-0.17, 0.17].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, -0.38, z]}>
            <cylinderGeometry args={[0.025, 0.025, 0.75, 8]} />
            <meshStandardMaterial color="#2E1A08" />
          </mesh>
        )),
      )}
    </group>
  );
}

/* ─── 천장 조명 ─── */
function CeilingLamp({ position }: { position: [number, number, number] }) {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (!lightRef.current) return;
    lightRef.current.intensity = 3.5 + Math.sin(clock.elapsedTime * 0.8) * 0.15;
  });

  return (
    <group position={position}>
      <mesh>
        <coneGeometry args={[0.22, 0.24, 16]} />
        <meshStandardMaterial color="#C48D3F" metalness={0.6} roughness={0.3} />
      </mesh>
      <pointLight ref={lightRef} color="#FFD07A" intensity={3.5} distance={8} decay={2} castShadow />
    </group>
  );
}

/* ─── 창문 ─── */
function Window({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[1.6, 1.8, 0.08]} />
        <meshStandardMaterial color="#5C3A1A" />
      </mesh>
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[1.3, 1.5]} />
        <meshStandardMaterial
          color="#B8D8F0"
          transparent
          opacity={0.5}
          emissive="#92B8E2"
          emissiveIntensity={0.4}
        />
      </mesh>
      <rectAreaLight
        position={[0, 0, 0.1]}
        rotation={[0, Math.PI, 0]}
        width={1.3}
        height={1.5}
        color="#92B8E2"
        intensity={2}
      />
    </group>
  );
}

/* ─── 벽 액자 ─── */
function WallFrame({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.7, 0.55, 0.06]} />
        <meshStandardMaterial color="#4A2E10" />
      </mesh>
      <mesh position={[0, 0, 0.04]}>
        <planeGeometry args={[0.55, 0.42]} />
        <meshStandardMaterial color="#C8A87A" roughness={0.9} />
      </mesh>
    </group>
  );
}

/* ─── 포켓몬 빌보드 (카페 씬 내부) ─── */
function CharacterBillboard({ pokemonId }: { pokemonId: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useTexture(
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`,
  );

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = 0.5 + Math.sin(clock.elapsedTime * 1.6) * 0.12;
  });

  return (
    <group ref={groupRef} position={[0, 0.5, 2.8]}>
      <Billboard follow lockX={false} lockY={false} lockZ={false}>
        <mesh>
          <planeGeometry args={[3.5, 3.5]} />
          <meshBasicMaterial
            map={texture}
            transparent
            alphaTest={0.05}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      </Billboard>
      {/* 발밑 그림자 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <ellipseGeometry args={[0.9, 0.3, 16]} />
        <meshBasicMaterial color="#000" transparent opacity={0.18} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ══════════════════════════════════════════════
   CafeBackground 메인 컴포넌트
══════════════════════════════════════════════ */

interface CafeBackgroundProps {
  children?: ReactNode;
  pokemonId?: number;
}

export function CafeBackground({ children, pokemonId }: CafeBackgroundProps) {
  return (
    <div className="absolute inset-0">
      <Canvas
        shadows
        camera={{ position: [0, 0.6, 5.8], fov: 50 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
      >
        <color attach="background" args={['#2C1A0C']} />
        <fog attach="fog" args={['#2C1A0C', 10, 22]} />

        <ambientLight intensity={0.45} color="#FFE0B0" />

        <CeilingLamp position={[-2.5, 3.8, -0.5]} />
        <CeilingLamp position={[2.5, 3.8, -0.5]} />
        <CeilingLamp position={[0, 3.8, 2.5]} />

        <Environment preset="sunset" />

        <Sparkles
          count={60}
          scale={[8, 6, 4]}
          size={0.6}
          speed={0.2}
          opacity={0.3}
          color="#FFD07A"
          position={[0, 1, 0]}
        />

        <Floor />
        <BackWall />
        <SideWall x={-5} />
        <SideWall x={5} />
        <Ceiling />

        <Window position={[-4.9, 1.5, -1]} />
        <Window position={[4.9, 1.5, -1]} />

        <WallFrame position={[-2.5, 2.0, -4.95]} />
        <WallFrame position={[2.5, 2.0, -4.95]} />

        <Counter />

        <RoundTable position={[-2.8, -1.1, 1.2]} />
        <Chair position={[-2.8, -1.55, 1.85]} angle={0} />
        <Chair position={[-2.8, -1.55, 0.55]} angle={Math.PI} />

        <RoundTable position={[2.8, -1.1, 1.2]} />
        <Chair position={[2.8, -1.55, 1.85]} angle={0} />
        <Chair position={[2.8, -1.55, 0.55]} angle={Math.PI} />

        <RoundTable position={[0, -1.1, 3.0]} />
        <Chair position={[0, -1.55, 3.65]} angle={0} />

        {/* 현재 대화 중인 포켓몬 (3D 씬 내부) */}
        {pokemonId !== undefined && (
          <Suspense fallback={null}>
            <CharacterBillboard pokemonId={pokemonId} />
          </Suspense>
        )}
      </Canvas>

      {children}
    </div>
  );
}
