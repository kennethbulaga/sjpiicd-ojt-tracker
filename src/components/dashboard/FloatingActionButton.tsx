"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FloatingActionButton() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Hide if scrolling down past 50px
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false)
      } 
      // Show immediately if scrolling up
      else if (currentScrollY < lastScrollY) {
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    // Passive listener for native-like 60fps scrolling performance
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return (
    <div 
      className={`fixed bottom-24 right-6 z-50 md:bottom-10 md:right-10 transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
      }`}
    >
      <Button asChild size="icon" className="size-14 rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all md:size-16">
        <Link href="/log">
          <Plus className="size-6 md:size-8" />
          <span className="sr-only">Log Hours</span>
        </Link>
      </Button>
    </div>
  )
}
