"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import Image from "next/image"

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

export function Mascot() {
  const [message, setMessage] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleClick = useCallback(() => {
    // Clear any existing timeout so quick clicks don't prematurely close the new message
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    // Pick a random philosophical question
    const randomMsg = PhilosophicalQuestions[Math.floor(Math.random() * PhilosophicalQuestions.length)]
    setMessage(randomMsg)
    
    // Give the user 8.5 seconds to read the complex text
    timeoutRef.current = setTimeout(() => {
      setMessage(null)
    }, 8500)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <div className="relative flex items-center justify-center">
      {/* Speech Bubble - Designed for heavy text blocks and viewport edge collision safety */}
      {message && (
        <div className="absolute top-[140%] left-1/2 -translate-x-1/2 w-[300px] sm:w-[340px] rounded-xl bg-foreground/95 backdrop-blur-sm px-4 py-3.5 text-[11px] sm:text-xs leading-relaxed font-medium text-background shadow-xl animate-in fade-in slide-in-from-top-2 z-[60] text-center text-balance transition-all hover:bg-foreground hover:scale-105 duration-300">
          {message}
          {/* Arrow pointing up */}
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-3 w-3 rotate-45 bg-foreground/95" />
        </div>
      )}

      {/* Mascot Image Toggle - Ambient infinite spin for mobile consistency */}
      <button 
        type="button" 
        onClick={handleClick}
        className="relative hover:scale-110 active:scale-95 transition-transform cursor-pointer"
        aria-label="Interact for a philosophical thought"
      >
        <Image 
          src="/cute-svg/genetic-data-svgrepo-com.svg" 
          alt="Philosophical Atom" 
          width={32} 
          height={32} 
          className="w-8 h-8 drop-shadow-sm opacity-90 animate-[spin_10s_linear_infinite]"
          priority
        />
      </button>
    </div>
  )
}
