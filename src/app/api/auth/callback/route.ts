// Note 1: This is a Next.js Route Handler (API route). Files named "route.ts"
// in the app directory define HTTP endpoint handlers. This file at
// "api/auth/callback/route.ts" handles GET requests to "/api/auth/callback".
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Note 2: This endpoint is the OAuth callback URL that Supabase redirects to
// after a successful Google sign-in. The flow is:
// 1. User clicks "Sign in with Google" → redirected to Google
// 2. Google authenticates → redirects to Supabase
// 3. Supabase generates an auth code → redirects here
// 4. This handler exchanges the code for a session cookie
// 5. User is redirected to the dashboard (or the "next" URL)
export async function GET(request: Request) {
  // Note 3: URL parsing extracts the "code" and "next" query parameters.
  // The "code" is a one-time authorization code from Supabase OAuth.
  // The "next" parameter allows deep-linking — if a user tried to access
  // "/history" while logged out, they'll be redirected back there after login.
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  let next = searchParams.get("next") ?? "/dashboard"

  // Note 4: Security — prevent open redirect attacks by ensuring "next" is
  // always a relative path. An attacker could craft a URL like
  // /api/auth/callback?code=...&next=https://evil.com to steal sessions.
  if (!next.startsWith("/")) {
    next = "/dashboard"
  }

  if (code) {
    // Note 5: Create a server-side Supabase client that can read/write cookies.
    // This is a Route Handler (not a Server Component), so cookie writes work.
    const supabase = await createClient()

    // Note 6: exchangeCodeForSession() sends the authorization code to
    // Supabase, which returns a session (access token + refresh token).
    // The @supabase/ssr library automatically sets these as HTTP-only
    // cookies, which is more secure than storing tokens in localStorage
    // because cookies are not accessible via JavaScript (XSS protection).
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Note 7: Handle x-forwarded-host for production environments behind
      // a load balancer or reverse proxy (e.g., Vercel). The original host
      // header may be rewritten by the proxy, so we check the forwarded host.
      const forwardedHost = request.headers.get("x-forwarded-host")
      const isLocalEnv = process.env.NODE_ENV === "development"

      if (isLocalEnv) {
        // Note 8: In local development, there's no load balancer, so we can
        // safely use the origin from the request URL.
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        // Note 9: In production behind a proxy, use the forwarded host
        // to construct the correct redirect URL.
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // Note 10: On failure, redirect to login with an error query parameter.
  // Using a query parameter (not a hash fragment) ensures the error is
  // available on the server side so the login page (Server Component)
  // can display an appropriate error message.
  return NextResponse.redirect(`${origin}/?error=auth_callback_error`)
}
