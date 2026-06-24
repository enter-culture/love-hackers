import type { Metadata } from 'next'
import { Geist } from 'next/font/google'

import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata: Metadata = {
  title: '러브 해커스 — 로테이션 소개팅 연습',
  description: '동물의 숲 스타일 소개팅 시뮬레이터',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ko' className={`${geist.variable} h-full`}>
      <body className='h-full overflow-hidden bg-black text-white'>{children}</body>
    </html>
  )
}
