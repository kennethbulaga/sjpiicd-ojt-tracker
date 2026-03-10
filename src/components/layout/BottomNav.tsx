// Note 1: "use client" is required because this component uses the
// usePathname() hook from next/navigation, which is a Client Component hook.
// It reads the current URL path to determine which nav item is active.
"use client"

// Note 2: Next.js <Link> provides client-side navigation with automatic
// prefetching. When a nav item becomes visible in the viewport, Next.js
// prefetches its page data in the background, making navigation feel instant.
import Link from "next/link"
// Note 3: usePathname() returns the current URL pathname (e.g., "/dashboard").
// It's a hook (not a utility function) because it needs to re-render the
// component when the URL changes, keeping the active state in sync.
import { usePathname } from "next/navigation"
// Note 4: Lucide React provides tree-shakeable SVG icons. Importing individual
// icons (not the entire library) ensures only the icons used are included
// in the JavaScript bundle, keeping it small.
import { LayoutDashboard, Clock, History, Settings } from "lucide-react"
// Note 5: cn() merges Tailwind classes with conflict resolution. For example,
// cn("text-red-500", "text-blue-500") returns "text-blue-500" (last wins).
// This is essential when conditionally applying active/inactive styles.
import { cn } from "@/lib/utils"

// Note 6: Defining nav items as a constant array outside the component
// prevents re-creating the array on every render. Each item maps an href
// to an icon component and label. This data-driven approach makes it easy
// to add/remove nav items without touching the rendering logic.
const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/log", icon: Clock, label: "Log" },
  { href: "/history", icon: History, label: "History" },
  { href: "/settings", icon: Settings, label: "Settings" },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    // Note 7: "justify-around" distributes nav items evenly across the
    // full width, giving each item equal space. This is the standard
    // pattern for mobile bottom navigation (Material Design, iOS Tab Bar).
    <div className="flex justify-around">
      {navItems.map(({ href, icon: Icon, label }) => {
        // Note 8: Active state detection checks both exact match (pathname === href)
        // and prefix match (pathname.startsWith). The prefix match handles nested
        // routes — e.g., "/history/entry/123" still highlights the "History" tab.
        const isActive =
          pathname === href || pathname.startsWith(`${href}/`)

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              // Note 9: "min-h-[56px] min-w-[64px]" ensures each nav item exceeds
              // the 44px minimum touch target recommended by both Apple HIG and
              // Material Design guidelines. The flex-col layout stacks the icon
              // above the label, which is the standard bottom nav pattern.
              "flex flex-col items-center py-2 px-3 min-h-[56px] min-w-[64px] text-xs",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {/* Note 10: "size-5" (20px) is the standard icon size for bottom
                navigation. The Icon variable holds a React component (from
                Lucide) — this pattern of renaming "icon" to "Icon" (capitalized)
                is required because React treats lowercase names as HTML elements
                and uppercase names as components. */}
            <Icon className="size-5" />
            <span className="mt-1">{label}</span>
          </Link>
        )
      })}
    </div>
  )
}
