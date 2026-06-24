import { Suspense, useRef } from 'react';

import { Billboard, useTexture } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { CHARACTERS } from '@/lib/game/characters';

/* ══════════════════════════════════════════════
   3D 씬 컴포넌트들
══════════════════════════════════════════════ */

/* ── 바닥 잔디 ── */
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[60, 60]} />
      <meshLambertMaterial color="#7DE8A8" />
    </mesh>
  );
}

/* ── 흙 길 ── */
function DirtPath() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
      <planeGeometry args={[5, 60]} />
      <meshLambertMaterial color="#C8A87A" />
    </mesh>
  );
}

/* ── 나무 ── */
interface TreeProps { position: [number, number, number]; scale?: number; }
function Tree({ position, scale = 1 }: TreeProps) {
  return (
    <group position={position} scale={scale}>
      {/* 기둥 */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.2, 1.2, 8]} />
        <meshLambertMaterial color="#7B4F2E" />
      </mesh>
      {/* 잎 - 3겹 구 */}
      <mesh position={[0, 2.0, 0]} castShadow>
        <sphereGeometry args={[0.9, 12, 10]} />
        <meshLambertMaterial color="#3AAF6A" />
      </mesh>
      <mesh position={[-0.35, 2.3, 0.25]} castShadow>
        <sphereGeometry args={[0.72, 12, 10]} />
        <meshLambertMaterial color="#4CC87A" />
      </mesh>
      <mesh position={[0.3, 2.5, -0.15]} castShadow>
        <sphereGeometry args={[0.65, 12, 10]} />
        <meshLambertMaterial color="#5DD88A" />
      </mesh>
    </group>
  );
}

/* ── 덤불 ── */
function Bush({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <sphereGeometry args={[0.42, 10, 8]} />
        <meshLambertMaterial color="#4CC87A" />
      </mesh>
      <mesh position={[0.35, 0.1, 0]} castShadow>
        <sphereGeometry args={[0.32, 10, 8]} />
        <meshLambertMaterial color="#5DD88A" />
      </mesh>
      <mesh position={[-0.3, 0.08, 0.2]} castShadow>
        <sphereGeometry args={[0.28, 10, 8]} />
        <meshLambertMaterial color="#4CC87A" />
      </mesh>
    </group>
  );
}

/* ── 꽃 ── */
function Flower({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.12, 0]}>
        <sphereGeometry args={[0.1, 8, 6]} />
        <meshLambertMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.15, 6]} />
        <meshLambertMaterial color="#5CAF40" />
      </mesh>
    </group>
  );
}

/* ── 돌멩이 ── */
function Rock({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} castShadow>
      <sphereGeometry args={[0.22, 8, 6]} />
      <meshLambertMaterial color="#B8B0A0" />
    </mesh>
  );
}

/* ── 포켓몬 빌보드 (항상 카메라 방향) ── */
interface PokemonBillboardProps {
  pokemonId: number;
  position: [number, number, number];
  size: number;
  floatOffset?: number;
}

function PokemonBillboard({ pokemonId, position, size, floatOffset = 0 }: PokemonBillboardProps) {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useTexture(
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`,
  );

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = position[1] + Math.sin(clock.elapsedTime * 1.6 + floatOffset) * 0.14;
  });

  return (
    <group ref={groupRef} position={position}>
      <Billboard follow lockX={false} lockY={false} lockZ={false}>
        <mesh>
          <planeGeometry args={[size, size]} />
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
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -position[1] + 0.02, 0]}>
        <ellipseGeometry args={[size * 0.28, size * 0.1, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.15} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ── 전체 씬 ── */
function LobbyScene() {
  return (
    <>
      {/* 하늘 색 */}
      <color attach="background" args={['#92C8EE']} />
      <fog attach="fog" args={['#92C8EE', 22, 40]} />

      {/* 조명 */}
      <ambientLight intensity={0.65} color="#FFF0CC" />
      <directionalLight
        position={[8, 14, 8]}
        color="#FFD878"
        intensity={1.8}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
      {/* 하늘 역광 */}
      <directionalLight position={[-5, 8, -8]} color="#B8D8F8" intensity={0.5} />

      {/* 바닥 & 길 */}
      <Ground />
      <DirtPath />

      {/* 나무들 */}
      <Tree position={[-7, 0, -4]} scale={1.3} />
      <Tree position={[-5.5, 0, -8]} scale={1.1} />
      <Tree position={[-9, 0, -2]} scale={0.95} />
      <Tree position={[7, 0, -4]} scale={1.2} />
      <Tree position={[5.5, 0, -8]} scale={1.1} />
      <Tree position={[9, 0, -1.5]} scale={0.9} />
      <Tree position={[-6, 0, 4]} scale={0.85} />
      <Tree position={[6.5, 0, 3.5]} scale={0.9} />
      <Tree position={[0, 0, -12]} scale={1.4} />
      <Tree position={[-3, 0, -11]} scale={1.1} />
      <Tree position={[3, 0, -11]} scale={1.0} />

      {/* 덤불 */}
      <Bush position={[-4.5, 0.3, -1]} />
      <Bush position={[4.5, 0.3, -0.5]} />
      <Bush position={[-3.5, 0.3, 4]} />
      <Bush position={[4, 0.3, 4.5]} />
      <Bush position={[-2.8, 0.3, -6]} />
      <Bush position={[3, 0.3, -6]} />

      {/* 꽃들 */}
      <Flower position={[-2.2, 0, -0.5]} color="#FFD740" />
      <Flower position={[-1.8, 0, 1]} color="#FF8FA0" />
      <Flower position={[2.5, 0, 0]} color="#FFD740" />
      <Flower position={[2, 0, 2]} color="#FFA0C8" />
      <Flower position={[-3.5, 0, 2]} color="#FF8FA0" />
      <Flower position={[3.8, 0, -2]} color="#FFFF80" />
      <Flower position={[-4, 0, -3]} color="#FFD740" />
      <Flower position={[1.5, 0, -3]} color="#C8A0E8" />
      <Flower position={[-1.5, 0, 3]} color="#C8A0E8" />

      {/* 돌멩이 */}
      <Rock position={[-5, 0.1, 2]} />
      <Rock position={[5.5, 0.1, -2.5]} />

      {/* 포켓몬 3명 (빌보드) */}
      <Suspense fallback={null}>
        <PokemonBillboard
          pokemonId={CHARACTERS[0].pokemonId}
          position={[-3.2, 1.4, 1.5]}
          size={2.8}
          floatOffset={0}
        />
        <PokemonBillboard
          pokemonId={CHARACTERS[1].pokemonId}
          position={[0, 1.8, 1.0]}
          size={3.6}
          floatOffset={1.2}
        />
        <PokemonBillboard
          pokemonId={CHARACTERS[2].pokemonId}
          position={[3.2, 1.4, 1.5]}
          size={2.8}
          floatOffset={2.4}
        />
      </Suspense>
    </>
  );
}

/* ══════════════════════════════════════════════
   메인 컴포넌트
══════════════════════════════════════════════ */

interface LobbyViewProps {
  onStart: () => void;
}

export function LobbyView({ onStart }: LobbyViewProps) {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 3D 씬 */}
      <Canvas
        shadows
        camera={{ position: [0, 5.5, 11], fov: 44 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
      >
        <LobbyScene />
      </Canvas>

      {/* HTML UI 오버레이 */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-between pointer-events-none px-5 pt-14 pb-12"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        {/* 상단 타이틀 */}
        <div className="text-center game-entrance">
          {/* 배지 */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3"
            style={{
              background: 'rgba(255,254,250,0.92)',
              border: '2.5px solid var(--ac-border)',
              boxShadow: '0 3px 0 var(--ac-border-dark)',
              fontSize: 12,
              fontWeight: 800,
              color: 'var(--ac-text)',
              backdropFilter: 'blur(4px)',
            }}
          >
            <span>🎮</span>
            <span>LOVE HACKERS</span>
          </div>

          {/* 메인 타이틀 */}
          <h1
            className="font-900 leading-tight"
            style={{
              fontSize: 32,
              color: '#fff',
              textShadow: '0 2px 8px rgba(0,0,0,0.35), 0 0 20px rgba(255,215,64,0.3)',
            }}
          >
            로테이션 소개팅
          </h1>

          <p
            className="mt-2 font-700"
            style={{
              fontSize: 14,
              color: 'rgba(255,255,255,0.9)',
              textShadow: '0 1px 4px rgba(0,0,0,0.3)',
            }}
          >
            오늘의 소개팅 상대를 만나봐요! 💌
          </p>
        </div>

        {/* 캐릭터 이름 표시 (하단) */}
        <div className="w-full flex flex-col items-center gap-4">
          {/* 이름 배지 3개 */}
          <div className="flex gap-4 justify-center">
            {CHARACTERS.map((c) => (
              <div
                key={c.id}
                className="px-3 py-1.5 rounded-full"
                style={{
                  background: 'rgba(255,254,250,0.90)',
                  border: '2px solid var(--ac-border)',
                  boxShadow: '0 3px 0 var(--ac-border-dark)',
                  fontSize: 12,
                  fontWeight: 800,
                  color: 'var(--ac-text)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                {c.displayName}
              </div>
            ))}
          </div>

          {/* 시작 버튼 */}
          <button
            className="ac-primary-btn pointer-events-auto w-full max-w-xs"
            onClick={onStart}
          >
            <span>💫</span>
            <span>소개팅 시작하기!</span>
          </button>
        </div>
      </div>
    </div>
  );
}
