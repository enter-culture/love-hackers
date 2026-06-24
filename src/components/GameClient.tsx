'use client'

import { Html, useGLTF } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

import { useTypewriter } from '@/hooks/useTypewriter'
import { CHARACTERS, NPC_POSITIONS } from '@/lib/characters'
import type { Character } from '@/lib/types'
import { getQuestionsForNpc, NPC_REACTIONS, QUESTIONS_PER_NPC } from '@/lib/questions'

// ─── Sub-components ──────────────────────────────────────────────────────────

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

interface PlayerProps {
  targetRef: React.MutableRefObject<THREE.Vector3>
  posRef: React.MutableRefObject<THREE.Vector3>
  isDialogueActive: boolean
}

function Player({ targetRef, posRef, isDialogueActive }: PlayerProps) {
  const meshRef = useRef<THREE.Group>(null!)
  const { camera } = useThree()

  useFrame(() => {
    if (!isDialogueActive) {
      posRef.current.lerp(targetRef.current, 0.06)
    }

    if (meshRef.current) {
      meshRef.current.position.copy(posRef.current)

      const dir = new THREE.Vector3(
        targetRef.current.x - posRef.current.x,
        0,
        targetRef.current.z - posRef.current.z,
      )
      if (dir.lengthSq() > 0.005) {
        meshRef.current.rotation.y = Math.atan2(dir.x, dir.z)
      }
    }

    const camTarget = posRef.current.clone().add(new THREE.Vector3(0, 9, 8))
    camera.position.lerp(camTarget, 0.06)
    camera.lookAt(posRef.current)
  })

  return (
    <group ref={meshRef} position={[0, 0, 4]}>
      {/* body */}
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[0.55, 0.8, 0.4]} />
        <meshToonMaterial color='#FFB347' />
      </mesh>
      {/* head */}
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[0.48, 0.48, 0.48]} />
        <meshToonMaterial color='#FFDAC1' />
      </mesh>
      {/* hair */}
      <mesh position={[0, 1.42, 0]}>
        <boxGeometry args={[0.5, 0.14, 0.5]} />
        <meshToonMaterial color='#5c3d1e' />
      </mesh>
    </group>
  )
}

interface NpcProps {
  character: Character
  position: [number, number, number]
  isNearby: boolean
  isCompleted: boolean
  onTalk: (id: string) => void
}

function Npc({ character, position, isNearby, isCompleted, onTalk }: NpcProps) {
  const meshRef = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    if (meshRef.current && !isCompleted) {
      meshRef.current.position.y = Math.sin(clock.elapsedTime * 1.5 + position[0]) * 0.05
    }
  })

  return (
    <group position={position}>
      {/* table */}
      <mesh position={[0, 0.25, 0.6]}>
        <boxGeometry args={[0.9, 0.05, 0.7]} />
        <meshToonMaterial color='#d4a56a' />
      </mesh>
      <mesh position={[-0.35, 0.12, 0.6]}>
        <cylinderGeometry args={[0.04, 0.04, 0.25, 6]} />
        <meshToonMaterial color='#c4955a' />
      </mesh>
      <mesh position={[0.35, 0.12, 0.6]}>
        <cylinderGeometry args={[0.04, 0.04, 0.25, 6]} />
        <meshToonMaterial color='#c4955a' />
      </mesh>

      {/* NPC body */}
      <group ref={meshRef}>
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[0.55, 0.8, 0.4]} />
          <meshToonMaterial color={character.color} />
        </mesh>
        <mesh position={[0, 1.1, 0]}>
          <boxGeometry args={[0.48, 0.48, 0.48]} />
          <meshToonMaterial color='#FFDAC1' />
        </mesh>
        <mesh position={[0, 1.42, 0]}>
          <boxGeometry args={[0.5, 0.14, 0.5]} />
          <meshToonMaterial color={character.accentColor} />
        </mesh>

        {/* Name + interaction button */}
        <Html position={[0, 2.2, 0]} center distanceFactor={8}>
          <div className='flex flex-col items-center gap-1 text-center' style={{ whiteSpace: 'nowrap' }}>
            {isCompleted ? (
              <span className='rounded-full bg-green-500 px-2 py-0.5 text-xs font-bold text-white'>
                ✅ 완료
              </span>
            ) : isNearby ? (
              <button
                onClick={() => onTalk(character.id)}
                className='rounded-full bg-pink-500 px-3 py-1 text-xs font-bold text-white shadow-md hover:bg-pink-600 transition-colors animate-bounce'
              >
                💬 대화하기
              </button>
            ) : (
              <span className='rounded-full bg-white/80 px-2 py-0.5 text-xs font-semibold text-gray-700 shadow'>
                {character.displayName}
              </span>
            )}
          </div>
        </Html>
      </group>
    </group>
  )
}

interface ClickRippleProps {
  position: THREE.Vector3 | null
}

function ClickRipple({ position }: ClickRippleProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const startTime = useRef(0)
  const isActive = useRef(false)

  useEffect(() => {
    if (position) {
      startTime.current = Date.now()
      isActive.current = true
      if (meshRef.current) {
        meshRef.current.position.set(position.x, 0.02, position.z)
        meshRef.current.scale.set(0.1, 1, 0.1)
        meshRef.current.visible = true
      }
    }
  }, [position])

  useFrame(() => {
    if (!isActive.current || !meshRef.current) {
      return
    }
    const elapsed = (Date.now() - startTime.current) / 600
    if (elapsed >= 1) {
      meshRef.current.visible = false
      isActive.current = false
      return
    }
    const s = elapsed * 2.5
    meshRef.current.scale.set(s, 1, s)
    const mat = meshRef.current.material as THREE.MeshBasicMaterial
    mat.opacity = 1 - elapsed
  })

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
      <ringGeometry args={[0.3, 0.5, 16]} />
      <meshBasicMaterial color='#ffffff' transparent opacity={0.8} depthWrite={false} />
    </mesh>
  )
}

// ─── GameWorld (inside Canvas) ───────────────────────────────────────────────

interface GameWorldProps {
  characters: Character[]
  playerTargetRef: React.MutableRefObject<THREE.Vector3>
  playerPosRef: React.MutableRefObject<THREE.Vector3>
  activeNpcId: string | null
  completedNpcIds: Set<string>
  onNearbyChange: (id: string | null) => void
  onGroundClick: (point: THREE.Vector3) => void
  onTalk: (id: string) => void
}

function GameWorld({
  characters,
  playerTargetRef,
  playerPosRef,
  activeNpcId,
  completedNpcIds,
  onNearbyChange,
  onGroundClick,
  onTalk,
}: GameWorldProps) {
  const [nearbyNpcId, setNearbyNpcId] = useState<string | null>(null)
  const nearbyRef = useRef<string | null>(null)
  const [clickPos, setClickPos] = useState<THREE.Vector3 | null>(null)

  const handleGroundClick = useCallback(
    (e: { point: THREE.Vector3; stopPropagation: () => void }) => {
      if (activeNpcId) {
        return
      }
      e.stopPropagation()
      const clamped = new THREE.Vector3(
        THREE.MathUtils.clamp(e.point.x, -9, 9),
        0,
        THREE.MathUtils.clamp(e.point.z, -9, 9),
      )
      onGroundClick(clamped)
      setClickPos(clamped.clone())
    },
    [activeNpcId, onGroundClick],
  )

  useFrame(() => {
    if (activeNpcId) {
      return
    }
    let nearest: string | null = null
    let nearestDist = 2.8

    characters.forEach((char, i) => {
      if (completedNpcIds.has(char.id)) {
        return
      }
      const npcPos = new THREE.Vector3(...NPC_POSITIONS[i])
      const dist = playerPosRef.current.distanceTo(npcPos)
      if (dist < nearestDist) {
        nearest = char.id
        nearestDist = dist
      }
    })

    if (nearest !== nearbyRef.current) {
      nearbyRef.current = nearest
      setNearbyNpcId(nearest)
      onNearbyChange(nearest)
    }
  })

  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[6, 12, 6]} intensity={1.5} castShadow />
      <color attach='background' args={['#c8eaf5']} />
      <fog attach='fog' args={['#c8eaf5', 22, 38]} />

      {/* Ground (clickable) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow onClick={handleGroundClick}>
        <planeGeometry args={[22, 22]} />
        <meshToonMaterial color='#88c878' />
      </mesh>
      <gridHelper args={[22, 22, '#6ab260', '#6ab260']} position={[0, 0.01, 0]} />

      {/* Click ripple */}
      <ClickRipple position={clickPos} />

      {/* Trees */}
      {(
        [
          [-9, 0, -9], [9, 0, -9], [-9, 0, 9], [9, 0, 9],
          [-9, 0, 0], [9, 0, 0], [0, 0, -9],
        ] as [number, number, number][]
      ).map((pos, i) => (
        <Tree key={i} position={pos} />
      ))}

      {/* NPCs */}
      {characters.map((char, i) => (
        <Npc
          key={char.id}
          character={char}
          position={NPC_POSITIONS[i]}
          isNearby={nearbyNpcId === char.id && !activeNpcId}
          isCompleted={completedNpcIds.has(char.id)}
          onTalk={onTalk}
        />
      ))}

      {/* Player */}
      <Player
        targetRef={playerTargetRef}
        posRef={playerPosRef}
        isDialogueActive={!!activeNpcId}
      />
    </>
  )
}

// ─── DialogueBox ─────────────────────────────────────────────────────────────

interface DialogueBoxProps {
  character: Character
  npcIndex: number
  onComplete: (score: number) => void
}

function DialogueBox({ character, npcIndex, onComplete }: DialogueBoxProps) {
  const questions = getQuestionsForNpc(npcIndex)
  const [questionIdx, setQuestionIdx] = useState(0)
  const [phase, setPhase] = useState<'question' | 'reaction'>('question')
  const [reaction, setReaction] = useState('')
  const [totalScore, setTotalScore] = useState(0)

  const currentQuestion = questions[questionIdx]
  const { displayed, isDone } = useTypewriter(
    phase === 'question' ? currentQuestion.question : reaction,
  )

  const handleChoice = (choiceIdx: number) => {
    if (!isDone || phase === 'reaction') {
      return
    }
    const score = currentQuestion.scores[choiceIdx]
    const newTotal = totalScore + score
    setTotalScore(newTotal)
    const rx = NPC_REACTIONS[Math.floor(Math.random() * NPC_REACTIONS.length)]
    setReaction(rx)
    setPhase('reaction')

    setTimeout(() => {
      const nextIdx = questionIdx + 1
      if (nextIdx >= QUESTIONS_PER_NPC) {
        onComplete(newTotal)
      } else {
        setQuestionIdx(nextIdx)
        setPhase('question')
      }
    }, 1500)
  }

  return (
    <div className='pointer-events-auto absolute bottom-0 left-0 right-0 px-4 pb-6'>
      <div className='mx-auto max-w-lg rounded-2xl bg-white/95 p-5 shadow-2xl backdrop-blur-sm'>
        <div className='mb-3 flex items-center gap-2'>
          <div
            className='h-8 w-8 rounded-full'
            style={{ backgroundColor: character.color }}
          />
          <span className='font-bold text-gray-800'>{character.displayName}</span>
          <span className='ml-auto text-xs text-gray-400'>
            {questionIdx + 1} / {QUESTIONS_PER_NPC}
          </span>
        </div>

        <div className='mb-4 min-h-[2.5rem] rounded-xl bg-gray-50 px-4 py-3'>
          <p className='text-sm text-gray-700'>{displayed}</p>
        </div>

        {phase === 'question' && isDone && (
          <div className='flex flex-col gap-2'>
            {currentQuestion.choices.map((choice, i) => (
              <button
                key={i}
                onClick={() => handleChoice(i)}
                className='w-full rounded-xl border-2 border-pink-200 bg-pink-50 py-3 text-sm font-medium text-gray-700 transition hover:border-pink-400 hover:bg-pink-100 active:scale-95'
              >
                {choice}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── GameClient (root) ───────────────────────────────────────────────────────

export function GameClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const count = Math.min(Math.max(parseInt(searchParams.get('count') ?? '3', 10), 2), 5)
  const characters = CHARACTERS.slice(0, count)

  const playerTargetRef = useRef(new THREE.Vector3(0, 0, 4))
  const playerPosRef = useRef(new THREE.Vector3(0, 0, 4))

  const [activeNpcId, setActiveNpcId] = useState<string | null>(null)
  const [completedNpcIds, setCompletedNpcIds] = useState<Set<string>>(new Set())
  const [scores, setScores] = useState<Record<string, number>>({})

  const handleGroundClick = useCallback((point: THREE.Vector3) => {
    playerTargetRef.current.set(point.x, 0, point.z)
  }, [])

  const handleTalk = useCallback((id: string) => {
    setActiveNpcId(id)
  }, [])

  const handleDialogueComplete = useCallback(
    (score: number) => {
      if (!activeNpcId) {
        return
      }
      setScores(prev => ({ ...prev, [activeNpcId]: score }))
      setCompletedNpcIds(prev => new Set([...prev, activeNpcId]))
      setActiveNpcId(null)
    },
    [activeNpcId],
  )

  const handleGoResult = useCallback(() => {
    sessionStorage.setItem(
      'game_result',
      JSON.stringify({ characters: characters.map(c => c.id), scores }),
    )
    router.push('/result')
  }, [characters, scores, router])

  const isAllDone = completedNpcIds.size === characters.length

  const activeCharacter = characters.find(c => c.id === activeNpcId)
  const activeNpcIndex = activeCharacter ? characters.indexOf(activeCharacter) : 0

  return (
    <div className='relative h-full w-full select-none'>
      <Canvas
        shadows
        camera={{ position: [0, 9, 13], fov: 50 }}
        style={{ background: '#c8eaf5' }}
      >
        <GameWorld
          characters={characters}
          playerTargetRef={playerTargetRef}
          playerPosRef={playerPosRef}
          activeNpcId={activeNpcId}
          completedNpcIds={completedNpcIds}
          onNearbyChange={() => {}}
          onGroundClick={handleGroundClick}
          onTalk={handleTalk}
        />
      </Canvas>

      {/* Progress HUD */}
      <div className='pointer-events-none absolute left-1/2 top-4 -translate-x-1/2'>
        <div className='rounded-2xl bg-white/85 px-5 py-2 shadow-md backdrop-blur-sm'>
          <p className='text-sm font-bold text-gray-700'>
            완료 {completedNpcIds.size} / {characters.length}명
          </p>
        </div>
      </div>

      {/* Hint */}
      {!activeNpcId && !isAllDone && (
        <div className='pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2'>
          <p className='rounded-full bg-black/40 px-4 py-1.5 text-xs text-white backdrop-blur-sm'>
            바닥을 클릭해서 이동 · NPC에 가까이 가면 대화 버튼이 나타나요
          </p>
        </div>
      )}

      {/* Dialogue overlay */}
      {activeNpcId && activeCharacter && (
        <DialogueBox
          character={activeCharacter}
          npcIndex={activeNpcIndex}
          onComplete={handleDialogueComplete}
        />
      )}

      {/* All done */}
      {isAllDone && (
        <div className='absolute bottom-8 left-1/2 -translate-x-1/2'>
          <button
            onClick={handleGoResult}
            className='rounded-full bg-pink-500 px-10 py-4 text-lg font-bold text-white shadow-xl transition hover:scale-105 hover:bg-pink-600 active:scale-100'
          >
            결과 보기 💕
          </button>
        </div>
      )}
    </div>
  )
}
