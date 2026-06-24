import { Suspense } from 'react'

import { GameClient } from '@/components/GameClient'

export default function GamePage() {
  return (
    <Suspense fallback={<div className='flex h-full items-center justify-center bg-sky-100'><p className='text-gray-500'>게임 불러오는 중...</p></div>}>
      <GameClient />
    </Suspense>
  )
}
