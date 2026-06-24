import { Suspense, useRef } from 'react';

import { Billboard, useTexture } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { CHARACTERS } from '@/lib/game/characters';

/* ══════════════════════════════════════════════
   ACNH 셀쉐이딩 — 2단계 gradientMap
══════════════════════════════════════════════ */

function makeToon2() {
  const tex = new THREE.DataTexture(
    new Uint8Array([100, 220]),
    2, 1,
    THREE.RedFormat,
  );
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.needsUpdate = true;
  return tex;
}

const TOON2 = makeToon2();

function T(color: string) {
  return <meshToonMaterial color={color} gradientMap={TOON2} />;
}

/* ══════════════════════════════════════════════
   씬 컴포넌트들
══════════════════════════════════════════════ */

/* ── 잔디 바닥 ── */
function Ground() {
  return (
    <>
      {/* 기본 잔디 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        {T('#78D898')}
      </mesh>
      {/* 어두운 잔디 띠 (ACNH 패턴 느낌) */}
      {[-14, -6, 2, 10, 18].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.01, 0]}>
          <planeGeometry args={[4, 80]} />
          {T('#70CE90')}
        </mesh>
      ))}
    </>
  );
}

/* ── 흙 길 ── */
function DirtPath() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[6, 60]} />
        {T('#C8A87A')}
      </mesh>
      {/* 조약돌 패턴 */}
      {[-2, -1.2, 0.4, 1.8].map((x) =>
        [-4, 0, 4].map((z) => (
          <mesh key={`${x}-${z}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.03, z]}>
            <circleGeometry args={[0.18, 8]} />
            {T('#B89868')}
          </mesh>
        )),
      )}
    </>
  );
}

/* ── 나무 ── */
interface TreeProps {
  position: [number, number, number];
  scale?: number;
  leafColor?: string;
}

function Tree({ position, scale = 1, leafColor = '#48C878' }: TreeProps) {
  const darkLeaf = leafColor;
  const midLeaf = leafColor === '#48C878' ? '#5AE088' : '#68D890';
  return (
    <group position={position} scale={scale}>
      {/* 기둥 */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.22, 1.4, 8]} />
        {T('#7B4F2E')}
      </mesh>
      {/* 나무 텍스처 줄무늬 */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.162, 0.162, 0.5, 8]} />
        {T('#6A4025')}
      </mesh>
      {/* 잎 3겹 */}
      <mesh position={[0, 2.1, 0]} castShadow>
        <sphereGeometry args={[1.0, 14, 12]} />
        {T(darkLeaf)}
      </mesh>
      <mesh position={[-0.4, 2.4, 0.3]} castShadow>
        <sphereGeometry args={[0.78, 12, 10]} />
        {T(midLeaf)}
      </mesh>
      <mesh position={[0.35, 2.5, -0.25]} castShadow>
        <sphereGeometry args={[0.65, 12, 10]} />
        {T(midLeaf)}
      </mesh>
    </group>
  );
}

/* ── 덤불 ── */
function Bush({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <sphereGeometry args={[0.48, 10, 8]} />
        {T('#5AC88A')}
      </mesh>
      <mesh position={[0.32, 0.25, 0.15]} castShadow>
        <sphereGeometry args={[0.36, 10, 8]} />
        {T('#48B878')}
      </mesh>
      <mesh position={[-0.28, 0.22, -0.12]} castShadow>
        <sphereGeometry args={[0.32, 10, 8]} />
        {T('#60D890')}
      </mesh>
    </group>
  );
}

/* ── 꽃 ── */
function Flower({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      {/* 줄기 */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.24, 6]} />
        {T('#50B050')}
      </mesh>
      {/* 꽃잎 */}
      <mesh position={[0, 0.28, 0]}>
        <sphereGeometry args={[0.14, 8, 8]} />
        {T(color)}
      </mesh>
      {/* 꽃심 */}
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.065, 8, 8]} />
        {T('#FFE840')}
      </mesh>
    </group>
  );
}

/* ── 바위 ── */
function Rock({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <sphereGeometry args={[0.35, 8, 7]} />
        {T('#AAAAAA')}
      </mesh>
      <mesh position={[0.25, 0.14, 0.1]} castShadow>
        <sphereGeometry args={[0.22, 8, 7]} />
        {T('#BBBBBB')}
      </mesh>
    </group>
  );
}

/* ── 울타리 ── */
function FencePost({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[0.1, 0.8, 0.1]} />
        {T('#D4A870')}
      </mesh>
      {/* 뾰족한 윗부분 */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <coneGeometry args={[0.08, 0.2, 4]} />
        {T('#C49060')}
      </mesh>
    </group>
  );
}

function FenceRail({ x1, x2, z, y }: { x1: number; x2: number; z: number; y: number }) {
  const mid = (x1 + x2) / 2;
  const len = Math.abs(x2 - x1);
  return (
    <mesh position={[mid, y, z]} castShadow>
      <boxGeometry args={[len, 0.06, 0.06]} />
      {T('#C49060')}
    </mesh>
  );
}

function Fence({ fromX, toX, z }: { fromX: number; toX: number; z: number }) {
  const posts = [];
  for (let x = fromX; x <= toX; x += 1.4) {
    posts.push(<FencePost key={x} position={[x, 0, z]} />);
  }
  return (
    <group>
      {posts}
      <FenceRail x1={fromX} x2={toX} z={z} y={0.55} />
      <FenceRail x1={fromX} x2={toX} z={z} y={0.3} />
    </group>
  );
}

/* ── 구름 ── */
function Cloud({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const ref = useRef<THREE.Group>(null);
  const speed = 0.006 + scale * 0.002;
  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.x += speed;
    if (ref.current.position.x > 30) ref.current.position.x = -30;
  });
  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh>
        <sphereGeometry args={[1.0, 10, 8]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0.9, 0.2, 0]}>
        <sphereGeometry args={[0.75, 10, 8]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[-0.85, 0.1, 0]}>
        <sphereGeometry args={[0.65, 10, 8]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.7, 12]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
    </group>
  );
}

/* ── 포켓몬 빌보드 ── */
interface PokemonBillboardProps {
  pokemonId: number;
  position: [number, number, number];
  size?: number;
  floatOffset?: number;
}

function PokemonBillboard({ pokemonId, position, size = 2.2, floatOffset = 0 }: PokemonBillboardProps) {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useTexture(
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`,
  );
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = position[1] + Math.sin(clock.elapsedTime * 1.5 + floatOffset) * 0.18;
  });
  return (
    <group ref={groupRef} position={position}>
      <Billboard follow>
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
      {/* 발밑 그림자 타원 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <ellipseGeometry args={[size * 0.3, size * 0.1, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.18} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ══════════════════════════════════════════════
   LobbyView 메인 컴포넌트
══════════════════════════════════════════════ */

interface LobbyViewProps {
  onStart: () => void;
}

export function LobbyView({ onStart }: LobbyViewProps) {
  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <Canvas
        shadows={{ type: THREE.PCFSoftShadowMap }}
        camera={{ position: [0, 8, 14], fov: 42 }}
        gl={{ antialias: true, toneMapping: THREE.NoToneMapping }}
      >
        {/* 하늘색 배경 */}
        <color attach="background" args={['#7BCCE8']} />
        <fog attach="fog" args={['#9DD8F0', 30, 55]} />

        {/* ── 조명 ── */}
        {/* 밝은 환경광 (ACNH는 전체적으로 밝고 따뜻함) */}
        <ambientLight intensity={2.2} color="#FFF8E0" />
        {/* 태양광 — 그림자용 */}
        <directionalLight
          position={[8, 16, 8]}
          color="#FFF5D0"
          intensity={1.6}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
          shadow-camera-far={60}
        />
        {/* 하늘 반사광 */}
        <directionalLight position={[-4, 8, -6]} color="#C8E8FF" intensity={0.5} />

        {/* ── 구름 ── */}
        <Cloud position={[-20, 12, -15]} scale={1.2} />
        <Cloud position={[5, 14, -18]} scale={0.9} />
        <Cloud position={[22, 11, -20]} scale={1.4} />
        <Cloud position={[-8, 13, -25]} scale={1.0} />

        {/* ── 지형 ── */}
        <Ground />
        <DirtPath />

        {/* ── 나무 군락 ── */}
        <Tree position={[-7, 0, -3]} scale={1.1} />
        <Tree position={[-9, 0, -6]} scale={0.95} leafColor="#40B870" />
        <Tree position={[-6, 0, -7.5]} scale={1.2} />
        <Tree position={[-11, 0, -2]} scale={0.88} leafColor="#55D880" />
        <Tree position={[7, 0, -3]} scale={1.05} />
        <Tree position={[9, 0, -6]} scale={1.15} leafColor="#40B870" />
        <Tree position={[6, 0, -8]} scale={0.9} />
        <Tree position={[11, 0, -2]} scale={1.0} leafColor="#55D880" />
        {/* 뒷쪽 나무들 */}
        <Tree position={[-4, 0, -12]} scale={1.3} />
        <Tree position={[0, 0, -13]} scale={1.1} leafColor="#38A868" />
        <Tree position={[4, 0, -12]} scale={1.25} />

        {/* ── 덤불 ── */}
        <Bush position={[-5.5, 0, 1]} />
        <Bush position={[5.5, 0, 1]} />
        <Bush position={[-8, 0, 2]} />
        <Bush position={[8, 0, 2]} />
        <Bush position={[-12, 0, 5]} />
        <Bush position={[12, 0, 5]} />

        {/* ── 꽃들 ── */}
        <Flower position={[-4, 0, 0.5]} color="#FF6080" />
        <Flower position={[-3.5, 0, 1.5]} color="#FF90B0" />
        <Flower position={[-4.5, 0, 2]} color="#FFD740" />
        <Flower position={[4, 0, 0.5]} color="#80B0FF" />
        <Flower position={[3.5, 0, 1.8]} color="#B080FF" />
        <Flower position={[4.8, 0, 1.2]} color="#FF6080" />
        <Flower position={[-10, 0, 3]} color="#FFD740" />
        <Flower position={[10, 0, 3]} color="#FF90B0" />

        {/* ── 바위 ── */}
        <Rock position={[-13, 0, -4]} />
        <Rock position={[13, 0, -5]} />

        {/* ── 울타리 ── */}
        <Fence fromX={-16} toX={-7} z={-1} />
        <Fence fromX={7} toX={16} z={-1} />

        {/* ── 포켓몬 캐릭터 3명 ── */}
        <Suspense fallback={null}>
          {CHARACTERS.map((c, i) => {
            const xPos: [number, number, number][] = [
              [-3.6, 1.2, 2],
              [0, 1.4, 1],
              [3.6, 1.2, 2],
            ];
            return (
              <PokemonBillboard
                key={c.id}
                pokemonId={c.pokemonId}
                position={xPos[i]}
                size={2.6}
                floatOffset={i * 1.2}
              />
            );
          })}
        </Suspense>
      </Canvas>

      {/* ── HTML UI 오버레이 ── */}
      <div className="absolute inset-0 flex flex-col items-center justify-between pointer-events-none" style={{ zIndex: 10 }}>
        {/* 상단 타이틀 */}
        <div className="pt-10 flex flex-col items-center">
          <div
            className="ac-dialogue-box px-6 py-3 text-center pointer-events-auto"
            style={{ minWidth: 260 }}
          >
            <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--ac-border)', letterSpacing: '0.18em', marginBottom: 4 }}>
              AI 포켓몬 로테이션
            </p>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--ac-text)', lineHeight: 1.1 }}>
              소개팅 마을에 온 걸<br />환영해요! 🌿
            </h1>
          </div>
        </div>

        {/* 중앙 캐릭터 이름 배지 */}
        <div className="flex gap-3 items-end" style={{ marginBottom: 120 }}>
          {CHARACTERS.map((c, i) => {
            const colors: [string, string][] = [
              ['#C060A8', '#F0B8E0'],
              ['#E0A010', '#FFF0B0'],
              ['#4080D0', '#B0D0F8'],
            ];
            return (
              <div
                key={c.id}
                className="ac-nametag"
                style={{
                  background: colors[i][1],
                  color: colors[i][0],
                  fontSize: i === 1 ? 14 : 12,
                  transform: i === 1 ? 'translateY(-8px)' : 'none',
                  padding: i === 1 ? '6px 16px 6px 12px' : '4px 12px 4px 9px',
                  boxShadow: i === 1 ? `0 4px 0 ${colors[i][0]}` : `0 3px 0 ${colors[i][0]}`,
                  border: `2px solid ${colors[i][0]}`,
                }}
              >
                <span style={{ fontSize: i === 1 ? 16 : 14 }}>
                  {({ eevee: '🌸', pikachu: '⚡', lucario: '💎' } as Record<string, string>)[c.id] ?? '✨'}
                </span>
                {c.displayName}
              </div>
            );
          })}
        </div>

        {/* 하단 시작 버튼 */}
        <div className="pb-12 pointer-events-auto">
          <button className="ac-primary-btn" onClick={onStart} style={{ fontSize: 20, padding: '18px 56px' }}>
            🎵 소개팅 시작하기
          </button>
        </div>
      </div>
    </div>
  );
}
