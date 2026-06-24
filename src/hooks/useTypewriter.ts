'use client'

import { useEffect, useState } from 'react'

export function useTypewriter(text: string, speed = 40) {
  const [displayed, setDisplayed] = useState('')
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setIsDone(false)
    if (!text) {
      return
    }

    let index = 0
    const timer = setInterval(() => {
      setDisplayed(text.slice(0, index + 1))
      index++
      if (index >= text.length) {
        clearInterval(timer)
        setIsDone(true)
      }
    }, speed)

    return () => clearInterval(timer)
  }, [text, speed])

  return { displayed, isDone }
}
