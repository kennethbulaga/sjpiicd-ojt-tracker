"use client"

import { usePathname } from "next/navigation"

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/log": "Log Hours",
  "/history": "DTR History",
  "/settings": "Settings",
}

export function PageTitle() {
  const pathname = usePathname()

  // Match exact path or parent (e.g., /history/123 → "DTR History")
  const title =
    PAGE_TITLES[pathname] ??
    Object.entries(PAGE_TITLES).find(([path]) =>
      pathname.startsWith(`${path}/`)
    )?.[1] ??
    "JP Track"

  return (
    <h2 className="hidden md:block text-lg font-semibold tracking-tight">
      {title}
    </h2>
  )
}
