import { Suspense, useRef, type ReactNode } from 'react';

import { Billboard, useTexture } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ══════════════════════════════════════════════
   ACNH 셀쉐이딩용 공통 Toon 재질
══════════════════════════════════════════════ */

/* gradientMap: 3단계 명암 (동물의 숲 느낌) */
function makeToon3() {
  const tex = new THREE.DataTexture(
    new Uint8Array([80, 160, 255]),
    3, 1,
    THREE.RedFormat,
  );
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.needsUpdate = true;
  return tex;
}

const TOON3 = makeToon3();

function toon(color: string, roughness = 1) {
  void roughness;
  return <meshToonMaterial color={color} gradientMap={TOON3} />;
}

/* ─── 바닥 (나무 마루) ─── */
function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      {toon('#C8874A')}
    </mesh>
  );
}

/* ─── 마루 줄무늬 ─── */
function FloorPlank({ x }: { x: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x, -1.595, 0]}>
      <planeGeometry args={[0.08, 30]} />
      {toon('#A06030')}
    </mesh>
  );
}

/* ─── 뒷벽 ─── */
function BackWall() {
  return (
    <>
      <mesh position={[0, 1.5, -5.2]}>
        <planeGeometry args={[20, 8]} />
        {toon('#D4B896')}
      </mesh>
      {/* 벽지 가로줄 */}
      {[-0.5, 0.5, 1.5, 2.5].map((y) => (
        <mesh key={y} position={[0, y, -5.18]}>
          <planeGeometry args={[20, 0.06]} />
          {toon('#C4A882')}
        </mesh>
      ))}
    </>
  );
}

/* ─── 좌우 벽 ─── */
function SideWall({ x }: { x: number }) {
  return (
    <mesh position={[x, 1.5, -1]} rotation={[0, x > 0 ? -Math.PI / 2 : Math.PI / 2, 0]}>
      <planeGeometry args={[12, 8]} />
      {toon('#CCAA88')}
    </mesh>
  );
}

/* ─── 천장 ─── */
function Ceiling() {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4.5, -1]}>
      <planeGeometry args={[20, 12]} />
      {toon('#B8926A')}
    </mesh>
  );
}

/* ─── 카운터 바 ─── */
function Counter() {
  return (
    <group position={[0, -0.55, -4.2]}>
      {/* 상판 */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[7, 0.12, 1.3]} />
        {toon('#6E3E18')}
      </mesh>
      {/* 앞판 */}
      <mesh position={[0, -0.52, -0.55]}>
        <boxGeometry args={[7, 0.92, 0.08]} />
        {toon('#7C4820')}
      </mesh>
      {/* 몸통 */}
      <mesh position={[0, -0.55, 0]} receiveShadow>
        <boxGeometry args={[7, 0.92, 1.3]} />
        {toon('#5A3010')}
      </mesh>
      {/* 선반 */}
      <mesh position={[0, -0.05, -0.5]} receiveShadow>
        <boxGeometry args={[7, 0.06, 0.25]} />
        {toon('#8C5828')}
      </mesh>

      {/* 커피 머신 */}
      <group position={[2.2, 0.2, -0.1]}>
        <mesh castShadow>
          <boxGeometry args={[0.6, 0.8, 0.5]} />
          {toon('#3A3030')}
        </mesh>
        <mesh position={[0, 0.45, 0.1]}>
          <cylinderGeometry args={[0.08, 0.08, 0.25, 10]} />
          {toon('#888')}
        </mesh>
      </group>

      {/* 컵들 */}
      {[-1.4, -0.7, 0, 0.7].map((x, i) => (
        <group key={i} position={[x, 0.14, 0.1]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.09, 0.07, 0.22, 12]} />
            {toon(['#FFF8F0', '#F0E8D8', '#E8D8C0', '#FFEEDD'][i])}
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
      {/* 상판 */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.55, 0.08, 20]} />
        {toon('#8C5828')}
      </mesh>
      {/* 테두리 */}
      <mesh position={[0, 0.04, 0]}>
        <torusGeometry args={[0.55, 0.025, 8, 24]} />
        {toon('#6A3E18')}
      </mesh>
      {/* 기둥 */}
      <mesh position={[0, -0.55, 0]}>
        <cylinderGeometry args={[0.06, 0.09, 1.1, 10]} />
        {toon('#4A2810')}
      </mesh>
      {/* 받침대 */}
      <mesh position={[0, -1.14, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.06, 20]} />
        {toon('#4A2810')}
      </mesh>
      {/* 테이블 위 컵 */}
      <mesh position={[0.18, 0.1, 0.1]} castShadow>
        <cylinderGeometry args={[0.065, 0.052, 0.16, 12]} />
        {toon('#FFFAF0')}
      </mesh>
    </group>
  );
}

/* ─── 의자 ─── */
function Chair({ position, angle = 0 }: { position: [number, number, number]; angle?: number }) {
  return (
    <group position={position} rotation={[0, angle, 0]}>
      {/* 방석 */}
      <mesh castShadow>
        <boxGeometry args={[0.52, 0.07, 0.5]} />
        {toon('#D4956A')}
      </mesh>
      {/* 방석 쿠션 둥글게 */}
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[0.48, 0.04, 0.46]} />
        {toon('#E8AA7A')}
      </mesh>
      {/* 등받이 */}
      <mesh position={[0, 0.4, -0.22]} castShadow>
        <boxGeometry args={[0.52, 0.72, 0.07]} />
        {toon('#C48060')}
      </mesh>
      {/* 다리 4개 */}
      {[-0.19, 0.19].flatMap((x) =>
        [-0.18, 0.18].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, -0.42, z]} castShadow>
            <cylinderGeometry args={[0.028, 0.028, 0.78, 8]} />
            {toon('#4A2810')}
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
    lightRef.current.intensity = 4.5 + Math.sin(clock.elapsedTime * 0.9) * 0.2;
  });

  return (
    <group position={position}>
      {/* 줄 */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.5, 6]} />
        {toon('#555')}
      </mesh>
      {/* 갓 */}
      <mesh>
        <coneGeometry args={[0.28, 0.3, 16, 1, true]} />
        {toon('#D4A840')}
      </mesh>
      {/* 갓 안쪽 */}
      <mesh rotation={[Math.PI, 0, 0]} position={[0, -0.01, 0]}>
        <coneGeometry args={[0.27, 0.28, 16, 1, true]} />
        {toon('#FFEE88')}
      </mesh>
      <pointLight
        ref={lightRef}
        color="#FFD880"
        intensity={4.5}
        distance={9}
        decay={1.8}
        castShadow
        shadow-mapSize={[512, 512]}
      />
    </group>
  );
}

/* ─── 창문 ─── */
function Window({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* 외부 창틀 */}
      <mesh>
        <boxGeometry args={[1.8, 2.0, 0.1]} />
        {toon('#7C5028')}
      </mesh>
      {/* 유리 */}
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[1.44, 1.64]} />
        <meshBasicMaterial color="#B8E8F8" transparent opacity={0.6} />
      </mesh>
      {/* 창틀 가로 */}
      <mesh position={[0, 0, 0.07]}>
        <boxGeometry args={[1.44, 0.04, 0.02]} />
        {toon('#8C6038')}
      </mesh>
      {/* 창틀 세로 */}
      <mesh position={[0, 0, 0.07]}>
        <boxGeometry args={[0.04, 1.64, 0.02]} />
        {toon('#8C6038')}
      </mesh>
      {/* 창문 빛 */}
      <rectAreaLight
        position={[0, 0, 0.1]}
        rotation={[0, Math.PI, 0]}
        width={1.4}
        height={1.6}
        color="#C8E8FF"
        intensity={3}
      />
    </group>
  );
}

/* ─── 벽 액자 ─── */
function WallFrame({ position, color = '#F4E0B8' }: { position: [number, number, number]; color?: string }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.8, 0.65, 0.07]} />
        {toon('#5A3810')}
      </mesh>
      <mesh position={[0, 0, 0.04]}>
        <planeGeometry args={[0.64, 0.5]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

/* ─── 식물 화분 ─── */
function PlantPot({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.18, 0.14, 0.3, 10]} />
        {toon('#D47040')}
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.22, 10, 8]} />
        {toon('#3AB87A')}
      </mesh>
      <mesh position={[-0.12, 0.3, 0.1]}>
        <sphereGeometry args={[0.16, 10, 8]} />
        {toon('#50C888')}
      </mesh>
      <mesh position={[0.1, 0.32, -0.08]}>
        <sphereGeometry args={[0.14, 10, 8]} />
        {toon('#40B070')}
      </mesh>
    </group>
  );
}

/* ─── 포켓몬 빌보드 ─── */
function CharacterBillboard({ pokemonId }: { pokemonId: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useTexture(
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`,
  );

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = 0.2 + Math.sin(clock.elapsedTime * 1.8) * 0.1;
  });

  return (
    <group ref={groupRef} position={[0, 0.2, 2.5]}>
      <Billboard follow lockX={false} lockY={false} lockZ={false}>
        <mesh>
          <planeGeometry args={[3.2, 3.2]} />
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
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
        <ellipseGeometry args={[0.8, 0.28, 16]} />
        <meshBasicMaterial color="#000" transparent opacity={0.2} depthWrite={false} />
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
        shadows={{ type: THREE.PCFSoftShadowMap }}
        camera={{ position: [0, 1.2, 6.5], fov: 46 }}
        gl={{ antialias: true, toneMapping: THREE.NoToneMapping }}
      >
        {/* 배경: ACNH 카페 따뜻한 베이지 */}
        <color attach="background" args={['#3A1E0A']} />
        <fog attach="fog" args={['#2A1005', 12, 24]} />

        {/* ── 조명 ── */}
        {/* 전체 밝은 환경광 (ACNH는 어둡지 않아요) */}
        <ambientLight intensity={1.2} color="#FFE8C0" />
        {/* 부드러운 전방 보조광 */}
        <directionalLight position={[0, 4, 5]} color="#FFF5E0" intensity={0.8} />

        {/* 천장 조명 3개 */}
        <CeilingLamp position={[-2.5, 4.0, -0.5]} />
        <CeilingLamp position={[2.5, 4.0, -0.5]} />
        <CeilingLamp position={[0, 4.0, 2.5]} />

        {/* ── 구조 ── */}
        <Floor />
        {[-2, -1, 0, 1, 2].map((x) => (
          <FloorPlank key={x} x={x} />
        ))}
        <BackWall />
        <SideWall x={-5.5} />
        <SideWall x={5.5} />
        <Ceiling />

        {/* 창문 */}
        <Window position={[-4.5, 1.4, -0.8]} />
        <Window position={[4.5, 1.4, -0.8]} />

        {/* 액자들 */}
        <WallFrame position={[-2.2, 2.2, -5.15]} color="#FFD8A0" />
        <WallFrame position={[2.2, 2.2, -5.15]} color="#C8E8A8" />
        <WallFrame position={[0, 2.8, -5.15]} color="#F8D0E0" />

        {/* 카운터 */}
        <Counter />

        {/* 화분 */}
        <PlantPot position={[-4.8, -1.3, 2.0]} />
        <PlantPot position={[4.8, -1.3, 1.5]} />

        {/* 테이블 & 의자 */}
        <RoundTable position={[-2.5, -1.12, 1.0]} />
        <Chair position={[-2.5, -1.56, 1.7]} angle={0} />
        <Chair position={[-2.5, -1.56, 0.3]} angle={Math.PI} />

        <RoundTable position={[2.5, -1.12, 1.0]} />
        <Chair position={[2.5, -1.56, 1.7]} angle={0} />
        <Chair position={[2.5, -1.56, 0.3]} angle={Math.PI} />

        <RoundTable position={[0, -1.12, 3.2]} />
        <Chair position={[0, -1.56, 3.9]} angle={0} />

        {/* 포켓몬 캐릭터 */}
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
