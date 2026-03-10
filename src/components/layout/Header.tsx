// Note 1: The Header is a Server Component (no "use client"). It renders
// static markup (logo, container) and composes Client Component children
// (ThemeToggle, user menu) inside it. This keeps the header's HTML server-
// rendered for performance — only the interactive children need JavaScript.
export function Header() {
  return (
    // Note 2: "sticky top-0 z-40" pins the header to the viewport top during
    // scrolling. z-40 ensures it stays above page content but below modals
    // (which use z-50). This is a common SaaS dashboard pattern.
    //
    // "bg-background/95 backdrop-blur" creates a frosted-glass effect:
    // the header is 95% opaque with a backdrop blur, so content scrolling
    // beneath is subtly visible. The supports-[backdrop-filter] fallback
    // uses 60% opacity only when the browser supports backdrop-filter.
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Note 3: "h-14" (56px) matches the Material Design app bar height.
          This provides sufficient vertical space for touch targets while
          keeping the header compact. "justify-between" spaces the logo
          and actions to opposite ends of the header. */}
      <div className="flex h-14 items-center justify-between px-4 md:px-6">
        {/* Note 4: "JP Track" is the shortened app name for the header.
            Using "text-primary" applies the SJPIICD accent color for
            brand consistency across the application. */}
        <h1 className="text-lg font-semibold">JP Track</h1>
        <div className="flex items-center gap-2">
          {/* Note 5: ThemeToggle (dark/light mode switch) and a user
              avatar/menu dropdown will be placed here. Both are Client
              Components that need browser APIs (next-themes for theme
              state, click handlers for the dropdown). */}
        </div>
      </div>
    </header>
  )
}
