'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { CHARACTERS } from '@/lib/characters'
import { QUESTIONS_PER_NPC } from '@/lib/questions'

const MAX_SCORE = QUESTIONS_PER_NPC * 10

function getComment(score: number): string {
  const pct = score / MAX_SCORE
  if (pct >= 0.85) {
    return '완전 잘 통했어요 💕'
  }
  if (pct >= 0.55) {
    return '괜찮은 첫만남이었어요 😊'
  }
  return '좀 더 자연스럽게 해봐요 😅'
}

function HeartBar({ score }: { score: number }) {
  const pct = Math.round((score / MAX_SCORE) * 100)
  return (
    <div className='h-3 w-full overflow-hidden rounded-full bg-pink-100'>
      <div
        className='h-full rounded-full bg-gradient-to-r from-pink-400 to-rose-500 transition-all duration-700'
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export function ResultClient() {
  const router = useRouter()
  const [results, setResults] = useState<{ characterId: string; score: number }[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const raw = sessionStorage.getItem('game_result')
    if (!raw) {
      router.replace('/lobby')
      return
    }
    const { characters: ids, scores } = JSON.parse(raw) as {
      characters: string[]
      scores: Record<string, number>
    }
    const mapped = ids.map((id: string) => ({
      characterId: id,
      score: scores[id] ?? 0,
    }))
    mapped.sort((a, b) => b.score - a.score)
    setResults(mapped)
    setIsLoaded(true)
  }, [router])

  if (!isLoaded) {
    return (
      <div className='flex h-full items-center justify-center bg-gradient-to-b from-pink-950 to-black'>
        <p className='text-pink-300'>결과 불러오는 중...</p>
      </div>
    )
  }

  return (
    <div className='flex h-full flex-col items-center bg-gradient-to-b from-rose-950 via-pink-950 to-black px-4 py-8 overflow-y-auto'>
      <div className='w-full max-w-md'>
        <h1 className='mb-2 text-center text-2xl font-bold text-white'>오늘의 소개팅 결과 💌</h1>
        <p className='mb-8 text-center text-sm text-pink-300/70'>각 상대방과의 호감도 점수예요</p>

        <div className='flex flex-col gap-4'>
          {results.map(({ characterId, score }, rank) => {
            const char = CHARACTERS.find(c => c.id === characterId)
            if (!char) {
              return null
            }
            const comment = getComment(score)
            return (
              <div
                key={characterId}
                className='rounded-2xl bg-white/10 p-5 backdrop-blur-sm'
                style={{ borderLeft: `4px solid ${char.color}` }}
              >
                <div className='mb-3 flex items-center gap-3'>
                  <div
                    className='flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white'
                    style={{ backgroundColor: char.color }}
                  >
                    {rank + 1}위
                  </div>
                  <div>
                    <p className='font-bold text-white'>{char.displayName}</p>
                    <p className='text-xs text-pink-300/70'>{comment}</p>
                  </div>
                  <span className='ml-auto text-lg font-bold text-white'>
                    {score} <span className='text-xs text-pink-300'>/ {MAX_SCORE}</span>
                  </span>
                </div>
                <HeartBar score={score} />
              </div>
            )
          })}
        </div>

        <button
          onClick={() => router.push('/lobby')}
          className='mt-10 w-full rounded-full bg-pink-500 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-pink-600'
        >
          다시 해보기 🔄
        </button>
      </div>
    </div>
  )
}
