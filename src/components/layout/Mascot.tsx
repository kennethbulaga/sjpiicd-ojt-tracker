"use client"

import { useState, useCallback } from "react"
import Image from "next/image"

const PoutingMessages = [
  "Hmph! 😤",
  "Don't touch me! 😾",
  "I'm working here! 🐾",
  "Leave me alone... 😾",
  "Not in the mood! 😼",
  "Pfft. 🙀",
]

export function Mascot() {
  const [message, setMessage] = useState<string | null>(null)

  const handleClick = useCallback(() => {
    // Pick a random angry message
    const randomMsg = PoutingMessages[Math.floor(Math.random() * PoutingMessages.length)]
    setMessage(randomMsg)
    
    // Clear the message after 2.5 seconds
    setTimeout(() => {
      setMessage(null)
    }, 2500)
  }, [])

  return (
    <div className="relative flex items-center justify-center">
      {/* Speech Bubble - Spawns directly below the mascot */}
      {message && (
        <div className="absolute top-[120%] whitespace-nowrap rounded-md bg-foreground px-3 py-1.5 text-xs font-semibold text-background shadow-md animate-in fade-in slide-in-from-top-2 z-50">
          {message}
          {/* Arrow pointing up */}
          <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-foreground" />
        </div>
      )}

      {/* Mascot Image Toggle */}
      <button 
        type="button" 
        onClick={handleClick}
        className="relative hover:scale-110 active:scale-95 transition-transform cursor-pointer"
        aria-label="Interact with mascot"
      >
        {/* We stripped dark:invert so the asset colors never shift automatically */}
        <Image 
          src="/cute-svg/pouting-cat-svgrepo-com.svg" 
          alt="Pouting Mascot" 
          width={32} 
          height={32} 
          className="w-8 h-8 drop-shadow-sm opacity-90"
          priority
        />
      </button>
    </div>
  )
}
