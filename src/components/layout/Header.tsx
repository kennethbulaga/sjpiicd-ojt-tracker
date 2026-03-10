// Note 1: The Header is an async Server Component. It fetches the
// authenticated user's data from Supabase on the server, then passes
// it as props to the UserMenu Client Component. This pattern keeps
// sensitive operations (auth checks) on the server while only sending
// the minimum required data to the browser.
import { createClient } from "@/lib/supabase/server"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { UserMenu } from "@/components/layout/UserMenu"

export async function Header() {
  // Note 2: Fetch the authenticated user from Supabase using getUser().
  // getUser() validates the JWT with Supabase's servers (not just decoding
  // the local token), ensuring the session is valid and not expired.
  // This is the recommended approach over getSession() which only checks
  // the local JWT without server validation.
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Note 3: Extract user metadata from the Supabase auth user object.
  // Google OAuth stores the user's name and avatar URL in user_metadata.
  // We use optional chaining (?.) and nullish coalescing (??) for safety
  // in case metadata fields are missing.
  const userEmail = user?.email ?? ""
  const userName =
    (user?.user_metadata?.full_name as string) ??
    (user?.user_metadata?.name as string) ??
    ""
  const userAvatar = (user?.user_metadata?.avatar_url as string) ?? undefined

  return (
    // Note 4: "sticky top-0 z-40" pins the header to the viewport top during
    // scrolling. z-40 ensures it stays above page content but below modals
    // (which use z-50). This is a common SaaS dashboard pattern.
    //
    // "bg-background/95 backdrop-blur" creates a frosted-glass effect:
    // the header is 95% opaque with a backdrop blur, so content scrolling
    // beneath is subtly visible. The supports-[backdrop-filter] fallback
    // uses 60% opacity only when the browser supports backdrop-filter.
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Note 5: "h-14" (56px) matches the Material Design app bar height.
          This provides sufficient vertical space for touch targets while
          keeping the header compact. "justify-between" spaces the logo
          and actions to opposite ends of the header. */}
      <div className="flex h-14 items-center justify-between px-4 md:px-6">
        {/* Note 6: "JP Track" heading is shown on mobile (where the sidebar
            logo is hidden). On desktop, the sidebar already shows the logo,
            so this serves as a secondary brand marker. Using "md:hidden" to
            hide it on desktop would be an option, but keeping it visible
            provides consistent branding across breakpoints. */}
        <h1 className="text-lg font-semibold md:hidden">JP Track</h1>

        {/* Note 7: Spacer div on desktop — pushes the action buttons to the
            right edge when the sidebar logo is already visible. On mobile,
            the h1 above handles the left side. */}
        <div className="hidden md:block" />

        {/* Note 8: Action buttons group — ThemeToggle and UserMenu. "gap-2"
            adds 8px spacing between them. Both are Client Components that
            require browser APIs (next-themes for ThemeToggle, click handlers
            for UserMenu dropdown). */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user && (
            <UserMenu
              userEmail={userEmail}
              userName={userName}
              userAvatar={userAvatar}
            />
          )}
        </div>
      </div>
    </header>
  )
}
