'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

import introData from '../../public/animations/intro.json'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

export function IntroClient() {
  const router = useRouter()

  return (
    <div className='flex h-full flex-col items-center justify-center gap-8 bg-gradient-to-b from-rose-950 via-pink-950 to-black px-6'>
      <div className='flex flex-col items-center gap-2'>
        <p className='text-sm font-medium tracking-[0.3em] text-pink-400 uppercase'>Love Hackers</p>
        <h1 className='text-4xl font-bold text-white'>소개팅 연습</h1>
        <p className='text-sm text-pink-300/70'>동물의 숲 스타일 로테이션 시뮬레이터</p>
      </div>

      <div className='w-64'>
        <Lottie animationData={introData} loop autoplay />
      </div>

      <button
        onClick={() => router.push('/lobby')}
        className='flex items-center gap-3 rounded-full bg-white px-8 py-4 font-semibold text-gray-800 shadow-lg transition hover:scale-105 hover:shadow-pink-500/30 active:scale-100'
      >
        <svg width='20' height='20' viewBox='0 0 48 48' aria-hidden='true'>
          <path fill='#4285F4' d='M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z' />
          <path fill='#34A853' d='M6.3 14.7l7 5.1C15.1 16.2 19.2 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 16.3 2 9.6 7.2 6.3 14.7z' />
          <path fill='#FBBC05' d='M24 46c5.9 0 10.9-2 14.5-5.4l-6.7-5.5C29.9 36.8 27.1 38 24 38c-6.1 0-11.2-4.1-13-9.6l-6.9 5.3C7.8 41.8 15.4 46 24 46z' />
          <path fill='#EA4335' d='M44.5 20H24v8.5h11.8c-.9 2.7-2.6 4.9-5 6.5l6.7 5.5C42.1 36.6 45 31.3 45 24c0-1.3-.2-2.7-.5-4z' />
        </svg>
        Google로 시작하기
      </button>
    </div>
  )
}
