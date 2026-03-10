// Note 1: "use client" is required because this component uses onClick event
// handlers and the Supabase browser client, both of which need JavaScript
// in the browser to function.
"use client"

// Note 2: The shadcn Button component provides consistent styling, focus
// states, keyboard navigation, and ARIA attributes out of the box.
// Using it instead of a raw <button> ensures accessibility compliance.
import { Button } from "@/components/ui/button"

// Note 3: This component handles the Google OAuth sign-in flow for SJPIICD
// students. Only @sjp2cd.edu.ph email accounts are allowed — this restriction
// is enforced by a Supabase Auth Trigger (Postgres function) that runs
// AFTER authentication but BEFORE the user record is created.
export function GoogleSignInButton() {
  const handleSignIn = async () => {
    // Note 4: The Supabase OAuth flow works as follows:
    // 1. signInWithOAuth() redirects the browser to Google's consent screen
    // 2. After Google authentication, Supabase receives the token
    // 3. Supabase redirects to our callback URL (/api/auth/callback)
    // 4. The callback handler exchanges the code for a session
    // 5. The user is redirected to /dashboard
    //
    // The redirectTo option tells Supabase where to send the user after
    // authentication. window.location.origin ensures it works in any
    // environment (localhost, preview, production).
    //
    // Uncomment when Supabase project is connected:
    // const supabase = createClient()
    // await supabase.auth.signInWithOAuth({
    //   provider: "google",
    //   options: { redirectTo: `${window.location.origin}/api/auth/callback` }
    // })
  }

  return (
    <Button
      onClick={handleSignIn}
      variant="outline"
      // Note 5: "min-h-[44px]" ensures the button meets the minimum touch
      // target size recommended by Apple HIG (44pt) and Material Design (48dp).
      // This is critical for mobile usability — small buttons cause mis-taps,
      // especially for users with larger fingers or motor impairments.
      className="w-full min-h-[44px]"
    >
      {/* Note 6: A Google "G" logo SVG icon will be added here for brand
          recognition. Using an SVG (not an image) ensures it scales perfectly
          at any resolution and can be colored via CSS. */}
      Sign in with Google
    </Button>
  )
}
