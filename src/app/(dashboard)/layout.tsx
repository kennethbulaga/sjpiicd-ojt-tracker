// Note 1: This is the Dashboard Route Group layout. All pages inside "(dashboard)/"
// share this layout — it provides the sidebar, header, and bottom navigation shell.
// The parentheses mean this won't add "/dashboard" to child URLs; instead,
// each page defines its own URL via its folder name.

// Note 2: This layout remains a Server Component. The Sidebar and BottomNav
// components (which need client-side hooks like usePathname) are Client
// Components imported here. The Header is an async Server Component that
// fetches user data on the server side. This keeps the layout itself
// server-rendered for faster initial page loads.
import { Header } from "@/components/layout/Header"
import { Sidebar } from "@/components/layout/Sidebar"
import { BottomNav } from "@/components/layout/BottomNav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Note 3: "min-h-dvh" ensures the layout fills the full dynamic viewport
    // height, which is essential on mobile where the browser chrome
    // (address bar) changes the available height during scrolling.
    // "flex-col" stacks the header on top of the content area.
    <div className="min-h-dvh">
      {/* Note 4: The Header component is rendered at the top of every
          dashboard page. It's an async Server Component that fetches
          the user from Supabase and renders the ThemeToggle and UserMenu.
          In Next.js 16, async Server Components are natively supported
          so no ts-expect-error directives are needed. */}
      <Header />

      {/* Note 5: The main content area uses "flex" to place the sidebar
          beside the page content. "flex-1" makes it fill the remaining
          vertical space below the header. */}
      <div className="flex flex-1">
        {/* Note 6: "hidden md:flex" is a responsive visibility pattern.
            The sidebar is hidden on mobile (< 768px) and shown as a flex
            column on desktop. This is the standard approach for responsive
            navigation:
            - Mobile: Bottom navigation bar (thumb-friendly)
            - Desktop: Side navigation (more space for labels/icons)
            "w-64" (256px) is a standard sidebar width that accommodates
            labels without wasting screen space. "sticky top-14" pins it
            below the header so it scrolls with the page viewport. */}
        <aside className="hidden md:flex w-64 flex-col border-r border-border sticky top-14 h-[calc(100dvh-3.5rem)]">
          <Sidebar />
        </aside>

        {/* Note 7: "flex-1" makes the main content area fill all remaining
            horizontal space after the sidebar. "pb-16 md:pb-0" adds bottom
            padding on mobile to prevent the BottomNav from overlapping content,
            but removes it on desktop where there's no bottom nav. */}
        <main className="flex-1 pb-16 md:pb-0">
          {children}
        </main>
      </div>

      {/* Note 8: "md:hidden" hides the bottom nav on desktop (>= 768px).
          "fixed bottom-0" pins it to the viewport bottom.
          "pb-[env(safe-area-inset-bottom)]" respects the iPhone notch/home
          indicator area, preventing the nav from being obscured on iOS devices.
          "z-40" ensures it stays above page content but below modals. */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background pb-[env(safe-area-inset-bottom)]">
        <BottomNav />
      </nav>
    </div>
  )
}
