// Note 1: "use client" is required because this component uses the useTheme()
// hook from next-themes, which reads and writes the theme state stored in
// localStorage and a <html> class attribute — both browser-only APIs.
"use client"

// Note 2: Lucide's Moon and Sun icons are used for the theme toggle.
// They're imported individually (tree-shaking) so only these two icons
// are included in the client bundle.
import { Moon, Sun } from "lucide-react"
// Note 3: next-themes provides the useTheme() hook which manages dark mode
// across the entire app. It handles localStorage persistence, system
// preference detection, and prevents the "flash of wrong theme" (FOWT)
// by injecting a blocking script in <head>.
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  // Note 4: "resolvedTheme" accounts for the "system" setting — if the user
  // chose "system" and their OS is in dark mode, resolvedTheme will be "dark".
  // This is more reliable than "theme" which could be "system".
  const { setTheme, resolvedTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      // Note 5: The ternary toggles between "light" and "dark". If
      // resolvedTheme is "dark", clicking switches to "light" and vice versa.
      // next-themes persists the choice in localStorage and updates the
      // <html> element's class to ".dark", which triggers Tailwind's dark
      // mode variant (@custom-variant dark defined in globals.css).
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      // Note 6: "min-h-[44px] min-w-[44px]" ensures the toggle button meets
      // accessibility touch target guidelines (44x44px minimum).
      className="min-h-[44px] min-w-[44px]"
    >
      {/* Note 7: Both icons are always rendered but use CSS transforms to
          show/hide based on theme. In light mode: Sun is visible (scale-100),
          Moon is hidden (scale-0). In dark mode: Moon appears (scale-100),
          Sun hides (scale-0). The rotate transitions add a smooth spinning
          animation during the switch. "absolute" on Moon overlays it on Sun
          so they occupy the same space. */}
      <Sun className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      {/* Note 8: "sr-only" (screen-reader only) hides this text visually
          but keeps it accessible to screen readers. This is critical for
          icon-only buttons — without it, screen reader users would hear
          "button" with no description of what it does. */}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
