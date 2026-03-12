"use client"

import { useState, useCallback, useRef, useEffect } from "react"

const PhilosophicalQuestions = [
  "When you love someone deeply for years, are you loving the person they are right now, or are you continuously falling in love with the memory of who they were when you first met?",
  "Is it possible to ever truly know someone else's mind, or are we only ever falling in love with our own psychological translation of who they are?",
  "If falling in love inevitably carries the risk of eventual grief—through change, distance, or loss—is the depth of your connection just a measurement of how much pain you are willing to endure later?",
  "How much of your current drive and ambition is actually what you want, and how much is just a lingering echo of who you felt you needed to be in the past?",
  "There are entirely different versions of you that exist only in the memories of people you no longer speak to. Are those fragmented versions still a part of who you are today?",
  "Are we constantly building and upgrading our true selves, or are we just slowly stripping away the protective layers of who the world told us to be?",
  "Does the heavy feeling of melancholy come from missing something you lost, or from the quiet realization that you never actually had what you thought you did?",
  "The root of the word nostalgia translates to \"the pain of returning home.\" When we desperately crave the past, do we actually miss the time and place, or do we just miss the person we were when we were there?",
  "You are currently living in the \"good old days\" that a future version of yourself will deeply long for. Does knowing that make the present moment feel more beautiful, or more tragic?",
  "If you could perfectly preserve a single, beautiful memory to live inside forever, would it remain heaven, or would the lack of growth eventually turn it into a psychological hell?"
]

const SHOW_DURATION = 10000  // 10 seconds visible
const HIDE_DURATION = 20000  // 20 seconds hidden

export function PhilosophicalAtom({ className = "w-8 h-8" }: { className?: string }) {
  const [message, setMessage] = useState<string | null>(null)
  const showTimerRef = useRef<NodeJS.Timeout | null>(null)
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastIndexRef = useRef<number>(-1)

  // Pick a random question different from the last one shown
  const pickRandom = useCallback(() => {
    let idx: number
    do {
      idx = Math.floor(Math.random() * PhilosophicalQuestions.length)
    } while (idx === lastIndexRef.current && PhilosophicalQuestions.length > 1)
    lastIndexRef.current = idx
    return PhilosophicalQuestions[idx]
  }, [])

  // Clear all pending timers
  const clearTimers = useCallback(() => {
    if (showTimerRef.current) clearTimeout(showTimerRef.current)
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
  }, [])

  // Schedule: show message → hide after SHOW_DURATION → wait HIDE_DURATION → repeat
  const scheduleCycle = useCallback(() => {
    clearTimers()
    const msg = pickRandom()
    setMessage(msg)

    hideTimerRef.current = setTimeout(() => {
      setMessage(null)
      showTimerRef.current = setTimeout(scheduleCycle, HIDE_DURATION)
    }, SHOW_DURATION)
  }, [pickRandom, clearTimers])

  // Auto-start: first message appears after initial HIDE_DURATION delay
  useEffect(() => {
    showTimerRef.current = setTimeout(scheduleCycle, HIDE_DURATION)
    return clearTimers
  }, [scheduleCycle, clearTimers])

  // Manual click: show immediately and restart the cycle from this point
  const handleClick = useCallback(() => {
    scheduleCycle()
  }, [scheduleCycle])

  return (
    <div className="relative flex items-center justify-center">
      {/* Speech Bubble */}
      {message && (
        <div className="absolute top-[140%] left-1/2 -translate-x-1/2 w-[300px] sm:w-[340px] rounded-xl bg-foreground/95 backdrop-blur-sm px-4 py-3.5 text-[11px] sm:text-xs leading-relaxed font-medium text-background shadow-xl animate-in fade-in slide-in-from-top-2 z-[60] text-center text-balance transition-all hover:bg-foreground hover:scale-105 duration-300">
          {message}
          {/* Arrow pointing up */}
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-3 w-3 rotate-45 bg-foreground/95" />
        </div>
      )}

      {/* Atom Toggle */}
      <button
        type="button"
        onClick={handleClick}
        className="relative hover:scale-110 active:scale-95 transition-transform cursor-pointer"
        aria-label="Interact for a philosophical thought"
      >
        <svg
          viewBox="0 0 1024 1024"
          className={`${className} drop-shadow-sm opacity-90 animate-[spin_10s_linear_infinite]`}
          aria-label="Philosophical Atom"
        >
          <path d="M512 960c-92.8 0-160-200-160-448S419.2 64 512 64s160 200 160 448-67.2 448-160 448z m0-32c65.6 0 128-185.6 128-416S577.6 96 512 96s-128 185.6-128 416 62.4 416 128 416z" className="text-[#050D42] dark:text-blue-300" fill="currentColor" />
          <path d="M124.8 736c-48-80 92.8-238.4 307.2-363.2S852.8 208 899.2 288 806.4 526.4 592 651.2 171.2 816 124.8 736z m27.2-16c33.6 57.6 225.6 17.6 424-97.6S905.6 361.6 872 304 646.4 286.4 448 401.6 118.4 662.4 152 720z" className="text-[#050D42] dark:text-blue-300" fill="currentColor" />
          <path d="M899.2 736c-46.4 80-254.4 38.4-467.2-84.8S76.8 368 124.8 288s254.4-38.4 467.2 84.8S947.2 656 899.2 736z m-27.2-16c33.6-57.6-97.6-203.2-296-318.4S184 246.4 152 304 249.6 507.2 448 622.4s392 155.2 424 97.6z" className="text-[#050D42] dark:text-blue-300" fill="currentColor" />
          <path d="M512 592c-44.8 0-80-35.2-80-80s35.2-80 80-80 80 35.2 80 80-35.2 80-80 80zM272 312c-27.2 0-48-20.8-48-48s20.8-48 48-48 48 20.8 48 48-20.8 48-48 48zM416 880c-27.2 0-48-20.8-48-48s20.8-48 48-48 48 20.8 48 48-20.8 48-48 48z m448-432c-27.2 0-48-20.8-48-48s20.8-48 48-48 48 20.8 48 48-20.8 48-48 48z" className="text-[#2F4BFF] dark:text-blue-400" fill="currentColor" />
        </svg>
      </button>
    </div>
  )
}
