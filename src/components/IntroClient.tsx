'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

import introData from '../../public/animations/intro.json'
import naneunsoloLogo from '../../public/animations/naneunsolo-logo.json'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

export function IntroClient() {
  const router = useRouter()

  return (
    <main className='intro-screen'>
      <div className='intro-grain' aria-hidden='true' />
      <div className='intro-spotlight intro-spotlight-left' aria-hidden='true' />
      <div className='intro-spotlight intro-spotlight-right' aria-hidden='true' />

      <section className='intro-content' aria-labelledby='intro-title'>
        <div className='intro-naneunsolo-logo' role='img' aria-label='나는솔로'>
          <Lottie
            animationData={naneunsoloLogo}
            className='intro-naneunsolo-lottie'
            loop
            autoplay
            rendererSettings={{ preserveAspectRatio: 'xMidYMid meet' }}
          />
        </div>

        <p className='intro-season'>ROMANCE SIMULATION · 2026</p>

        <div className='intro-logo-lockup'>
          <span className='intro-logo-line' />
          <h1 id='intro-title'>우리의<br /><em>첫 번째 밤</em></h1>
          <span className='intro-logo-line' />
        </div>

        <p className='intro-tagline'>낯선 설렘이 시작되는 순간</p>

        <div className='intro-lottie-stage' aria-hidden='true'>
          <div className='intro-lottie-halo' />
          <Lottie
            animationData={introData}
            className='intro-lottie'
            loop
            autoplay
            rendererSettings={{ preserveAspectRatio: 'xMidYMid meet' }}
          />
        </div>

        <button onClick={() => router.push('/lobby')} className='intro-enter-button'>
          <span>새로운 인연, 입장하기</span>
          <svg viewBox='0 0 24 24' aria-hidden='true'>
            <path d='M5 12h13M13 6l6 6-6 6' />
          </svg>
        </button>

        <p className='intro-hint'>TAP TO BEGIN</p>
      </section>
    </main>
  )
}
