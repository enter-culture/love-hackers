'use client'

import { Canvas } from '@react-three/fiber'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import * as THREE from 'three'

import { CHARACTERS } from '@/lib/characters'

const COUNT_OPTIONS = [2, 3, 4, 5]

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 1.2, 6]} />
        <meshToonMaterial color='#8B6914' />
      </mesh>
      <mesh position={[0, 1.8, 0]}>
        <coneGeometry args={[0.9, 1.6, 6]} />
        <meshToonMaterial color='#4a9645' />
      </mesh>
      <mesh position={[0, 2.8, 0]}>
        <coneGeometry args={[0.65, 1.2, 6]} />
        <meshToonMaterial color='#5ab354' />
      </mesh>
    </group>
  )
}

function NpcPreview({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.55, 0.8, 0.4]} />
        <meshToonMaterial color={color} />
      </mesh>
      <mesh position={[0, 1.15, 0]}>
        <boxGeometry args={[0.48, 0.48, 0.48]} />
        <meshToonMaterial color='#FFDAC1' />
      </mesh>
    </group>
  )
}

function LobbyScene({ count }: { count: number }) {
  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
      <color attach='background' args={['#c8eaf5']} />
      <fog attach='fog' args={['#c8eaf5', 20, 40]} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[24, 24]} />
        <meshToonMaterial color='#88c878' />
      </mesh>

      {/* Grid lines */}
      <gridHelper args={[24, 24, '#6ab260', '#6ab260']} position={[0, 0.01, 0]} />

      {/* Trees around edges */}
      {(
        [
          [-8, 0, -8], [8, 0, -8], [-8, 0, 8], [8, 0, 8],
          [-8, 0, 0], [8, 0, 0], [0, 0, -8], [0, 0, 8],
        ] as [number, number, number][]
      ).map((pos, i) => (
        <Tree key={i} position={pos} />
      ))}

      {/* NPC preview characters */}
      {CHARACTERS.slice(0, count).map((char, i) => {
        const angle = (i / count) * Math.PI * 2 - Math.PI / 2
        const radius = 3.5
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        return <NpcPreview key={char.id} position={[x, 0, z]} color={char.color} />
      })}

      {/* Center fountain / decoration */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[1.2, 1.5, 0.6, 16]} />
        <meshToonMaterial color='#c9d8e0' />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 0.8, 12]} />
        <meshToonMaterial color='#b0c8d4' />
      </mesh>
    </>
  )
}

export function LobbyClient() {
  const [count, setCount] = useState(3)
  const router = useRouter()

  const handleStart = () => {
    router.push(`/game?count=${count}`)
  }

  return (
    <div className='relative h-full w-full'>
      <Canvas
        shadows
        camera={{ position: [0, 12, 14], fov: 45 }}
        style={{ background: '#c8eaf5' }}
      >
        <LobbyScene count={count} />
      </Canvas>

      {/* UI overlay */}
      <div className='pointer-events-none absolute inset-0 flex flex-col items-center justify-between p-6'>
        <div className='pointer-events-none rounded-2xl bg-white/80 px-6 py-3 backdrop-blur-sm'>
          <h1 className='text-center text-lg font-bold text-gray-800'>🌸 오늘의 소개팅 파티</h1>
          <p className='text-center text-sm text-gray-500'>몇 명과 연습할까요?</p>
        </div>

        <div className='flex flex-col items-center gap-4'>
          {/* Count buttons */}
          <div className='pointer-events-auto flex gap-3'>
            {COUNT_OPTIONS.map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`h-12 w-12 rounded-full text-lg font-bold shadow-md transition-all ${
                  count === n
                    ? 'scale-110 bg-pink-500 text-white shadow-pink-300'
                    : 'bg-white text-gray-700 hover:bg-pink-50'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <p className='text-sm text-gray-600'>
            {count}명의 캐릭터: {CHARACTERS.slice(0, count).map(c => c.displayName).join(', ')}
          </p>
          <button
            onClick={handleStart}
            className='pointer-events-auto rounded-full bg-pink-500 px-10 py-4 text-lg font-bold text-white shadow-lg transition hover:scale-105 hover:bg-pink-600 active:scale-100'
          >
            시작하기 ✨
          </button>
        </div>
      </div>
    </div>
  )
}
