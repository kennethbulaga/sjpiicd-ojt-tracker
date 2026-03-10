// Note 1: "use client" is required because this component uses onClick event
// handlers and the Supabase browser client, both of which need JavaScript
// in the browser to function.
"use client"

import { useState } from "react"
// Note 2: The shadcn Button component provides consistent styling, focus
// states, keyboard navigation, and ARIA attributes out of the box.
// Using it instead of a raw <button> ensures accessibility compliance.
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

// Note 3: This component handles the Google OAuth sign-in flow for SJPIICD
// students. Only @sjp2cd.edu.ph email accounts are allowed — this restriction
// is enforced by a Supabase Auth Trigger (Postgres function) that runs
// BEFORE INSERT on auth.users, rejecting non-SJPIICD emails at the database level.
export function GoogleSignInButton() {
  // Note 4: Track loading state to prevent double-clicks during the redirect.
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    setIsLoading(true)

    // Note 5: Create the Supabase browser client. This uses createBrowserClient
    // from @supabase/ssr, which stores session tokens in cookies instead of
    // localStorage for proper SSR integration.
    const supabase = createClient()

    // Note 6: The Supabase OAuth flow works as follows:
    // 1. signInWithOAuth() redirects the browser to Google's consent screen
    // 2. After Google authentication, Supabase receives the token
    // 3. Supabase redirects to our callback URL (/api/auth/callback)
    // 4. The callback handler exchanges the code for a session
    // 5. The user is redirected to /dashboard
    //
    // The redirectTo option tells Supabase where to send the user after
    // authentication. window.location.origin ensures it works in any
    // environment (localhost, preview, production).
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
        // Note 7: queryParams.hd restricts the Google account picker to
        // show only accounts from the specified domain. This is a UX
        // improvement — the actual enforcement happens at the database
        // trigger level (check_sjpiicd_email).
        queryParams: {
          hd: "sjp2cd.edu.ph",
        },
      },
    })

    // Note 8: If signInWithOAuth fails (e.g., popup blocked, network error),
    // we reset the loading state so the user can try again.
    if (error) {
      setIsLoading(false)
      console.error("OAuth error:", error.message)
    }
    // Note 9: If no error, the browser is redirecting to Google's consent
    // screen. We don't reset isLoading because the page is unloading.
  }

  return (
    <Button
      onClick={handleSignIn}
      variant="outline"
      disabled={isLoading}
      // Note 10: "min-h-[44px]" ensures the button meets the minimum touch
      // target size recommended by Apple HIG (44pt) and Material Design (48dp).
      // This is critical for mobile usability — small buttons cause mis-taps,
      // especially for users with larger fingers or motor impairments.
      className="w-full min-h-[44px] gap-3 text-base font-medium"
    >
      {/* Note 11: Google "G" logo SVG for brand recognition. Using an inline
          SVG (not an image) ensures it scales perfectly at any resolution,
          loads without an extra network request, and can be styled via CSS. */}
      <svg
        className="size-5"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
      {isLoading ? "Redirecting..." : "Sign in with Google"}
    </Button>
  )
}
