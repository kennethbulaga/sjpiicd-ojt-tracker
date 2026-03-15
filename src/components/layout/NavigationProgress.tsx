"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

/**
 * GitHub-style navigation progress bar.
 * Sits at the bottom of the header and shows during route transitions.
 *
 * How it works:
 * 1. Listens for clicks on internal <a> elements (Next.js <Link>)
 * 2. If the href differs from the current pathname, starts the animation
 * 3. When the pathname changes (navigation complete), completes the bar
 */
export function NavigationProgress() {
  const pathname = usePathname()
  const [state, setState] = useState<"idle" | "loading" | "completing">("idle")
  const prevPathname = useRef(pathname)
  const completingTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  // When pathname changes -> complete the bar
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname

      // Defer the transition to avoid synchronous setState inside effect body.
      const completeTimer = setTimeout(() => {
        setState((prev) => {
          if (prev === "loading") {
            return "completing"
          }
          return prev
        })
      }, 0)

      return () => clearTimeout(completeTimer)
    }
  }, [pathname])

  // After "completing" animation finishes, go back to idle
  useEffect(() => {
    if (state === "completing") {
      completingTimer.current = setTimeout(() => setState("idle"), 300)
      return () => clearTimeout(completingTimer.current)
    }
  }, [state])

  // Start loading on internal link clicks
  const handleClick = useCallback(
    (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a")
      if (!anchor) return

      const href = anchor.getAttribute("href")
      // Only trigger for internal navigation links
      if (
        href &&
        href.startsWith("/") &&
        href !== pathname &&
        !anchor.hasAttribute("download") &&
        anchor.target !== "_blank"
      ) {
        setState("loading")
      }
    },
    [pathname]
  )

  useEffect(() => {
    document.addEventListener("click", handleClick, { capture: true })
    return () =>
      document.removeEventListener("click", handleClick, { capture: true })
  }, [handleClick])

  if (state === "idle") return null

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden">
      <div
        className={cn(
          "h-full bg-primary",
          state === "loading" &&
            "animate-[progress-load_2s_ease-in-out_forwards]",
          state === "completing" &&
            "animate-[progress-complete_0.3s_ease-out_forwards]"
        )}
      />
    </div>
  )
}
