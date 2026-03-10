// Note 1: This is the Dashboard Route Group layout. All pages inside "(dashboard)/"
// share this layout — it provides the sidebar, header, and bottom navigation shell.
// The parentheses mean this won't add "/dashboard" to child URLs; instead,
// each page defines its own URL via its folder name.

// Note 2: This layout remains a Server Component. The Sidebar and BottomNav
// components (which need client-side hooks like usePathname) will be Client
// Components imported here. This keeps the layout itself server-rendered for
// faster initial page loads.
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Note 3: "min-h-dvh" ensures the layout fills the full dynamic viewport
    // height, which is essential on mobile where the browser chrome
    // (address bar) changes the available height during scrolling.
    <div className="flex min-h-dvh">
      {/* Note 4: "hidden md:block" is a responsive visibility pattern.
          The sidebar is hidden on mobile (< 768px) and shown on desktop.
          This is the standard approach for responsive navigation:
          - Mobile: Bottom navigation bar (thumb-friendly)
          - Desktop: Side navigation (more space for labels/icons) */}
      <aside className="hidden md:block w-64 border-r border-border">
        {/* Note 5: The Sidebar component (Client Component) will be rendered here.
            It uses usePathname() to highlight the active route. */}
      </aside>

      {/* Note 6: "flex-1" makes the main content area fill all remaining
          horizontal space after the sidebar. "pb-16 md:pb-0" adds bottom
          padding on mobile to prevent the BottomNav from overlapping content,
          but removes it on desktop where there's no bottom nav. */}
      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>

      {/* Note 7: "md:hidden" hides the bottom nav on desktop (>= 768px).
          "fixed bottom-0" pins it to the viewport bottom.
          "pb-[env(safe-area-inset-bottom)]" respects the iPhone notch/home
          indicator area, preventing the nav from being obscured on iOS devices. */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-background pb-[env(safe-area-inset-bottom)]">
        {/* Note 8: The BottomNav component (Client Component) will be rendered here.
            It renders four nav items with icons and uses usePathname() for
            active state styling. Touch targets are 56px tall (exceeding the
            44px minimum recommended by Apple HIG and Material Design). */}
      </nav>
    </div>
  )
}
