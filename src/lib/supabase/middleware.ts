// Note 1: This module contains the session refresh and route protection logic
// that runs on EVERY request via Next.js middleware (src/middleware.ts).
// It's the critical security layer that ensures:
// 1. Auth tokens are always fresh (preventing expired session errors)
// 2. Unauthenticated users can't access dashboard routes
import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

// Note 2: updateSession is called by the middleware on every matching request.
// It creates a Supabase client that can read AND write cookies, then refreshes
// the auth session. This is necessary because Server Components can't write
// cookies — the middleware is the only place that reliably handles this.
export async function updateSession(request: NextRequest) {
  // Note 3: NextResponse.next() creates a response that continues to the
  // actual page. We pass the original request so its headers and cookies
  // are preserved. This response object will have auth cookies set on it.
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Note 4: This Supabase client has a special cookie adapter for middleware.
  // Unlike the server client (which uses Next.js cookies()), the middleware
  // client works with the raw NextRequest/NextResponse cookie APIs.
  // The setAll callback writes cookies to BOTH the request (for downstream
  // Server Components) and the response (for the browser).
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Note 5: Setting cookies on the request makes them available to
          // Server Components that run after this middleware.
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          // Note 6: Creating a new NextResponse.next() is necessary because
          // cookies can only be set during response construction. The updated
          // request (with new cookie values) is passed through.
          supabaseResponse = NextResponse.next({
            request,
          })
          // Note 7: Setting cookies on the response sends them to the browser,
          // where they'll be stored and sent with subsequent requests.
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Note 8: getUser() makes a request to Supabase to verify the token and
  // refresh it if expired. This is the single most important line — without
  // it, expired tokens would cause auth errors in Server Components.
  // Using getUser() (not getSession()) is recommended because getUser()
  // validates the token with the Supabase server, while getSession() only
  // checks the local JWT without server validation.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Note 9: Route protection logic — if no authenticated user exists and
  // the request isn't for the login page or auth callback, redirect to
  // /login. This prevents unauthenticated access to any dashboard route.
  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/api/auth")
  ) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  // Note 10: Return the response with updated auth cookies. It's critical
  // to return THIS exact supabaseResponse (not a new NextResponse) because
  // it contains the refreshed session cookies set by the setAll callback.
  return supabaseResponse
}
