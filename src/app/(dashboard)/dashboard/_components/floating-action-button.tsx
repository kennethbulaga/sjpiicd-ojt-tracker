"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

export function FloatingActionButton() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false)
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return (
    <div
      className={`fixed bottom-24 right-6 z-50 transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) md:bottom-10 md:right-10 ${
        isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-20 opacity-0"
      }`}
    >
      <Button
        asChild
        size="icon"
        className="size-14 rounded-full shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl md:size-16"
      >
        <Link href="/log">
          <Plus className="size-6 md:size-8" />
          <span className="sr-only">Log Hours</span>
        </Link>
      </Button>
    </div>
  )
}
