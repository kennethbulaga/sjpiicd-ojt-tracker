// Note 1: "use client" is required because this component uses the
// usePathname() hook to track the active route for visual highlighting.
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Clock, History, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

// Note 2: The nav items array is shared conceptually with BottomNav but
// uses different labels (e.g., "Log Hours" vs "Log") because the sidebar
// has more horizontal space for descriptive text. In a larger app, you
// might extract this to a shared constant with both short and long labels.
const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/log", icon: Clock, label: "Log Hours" },
  { href: "/history", icon: History, label: "DTR History" },
  { href: "/settings", icon: Settings, label: "Settings" },
]

// Note 3: The Sidebar is the desktop navigation component, shown on screens
// >= 768px (md breakpoint). It provides a persistent vertical menu alongside
// the main content area — the standard layout for SaaS dashboards.
export function Sidebar() {
  const pathname = usePathname()

  return (
    // Note 4: "flex h-full flex-col" makes the sidebar a full-height flex
    // container. This allows the nav section to use "flex-1" to fill all
    // available space below the logo header.
    <div className="flex h-full flex-col">
      {/* Note 5: The logo section has "h-14" to match the Header component
          height (56px), creating a visually aligned top edge. The border-b
          separates the logo from the navigation items below. */}
      <div className="flex h-14 items-center border-b border-border px-4">
        <h1 className="text-lg font-bold text-primary">JP Track</h1>
      </div>

      {/* Note 6: "space-y-1" adds 4px vertical gaps between nav items.
          "p-2" adds padding inside the nav container so items don't touch
          the sidebar edges. */}
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive =
            pathname === href || pathname.startsWith(`${href}/`)

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                // Note 7: "min-h-[44px]" ensures each nav item meets the
                // minimum touch target size. "transition-colors" adds a smooth
                // color transition (150ms by default) when hovering or when
                // the active state changes, preventing jarring visual jumps.
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors min-h-[44px]",
                // Note 8: Active items use "bg-primary text-primary-foreground"
                // (SJPIICD accent background with contrasting text). Inactive
                // items use "text-muted-foreground" with hover states that
                // preview the accent color, guiding the user's interaction.
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="size-5" />
              {label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
