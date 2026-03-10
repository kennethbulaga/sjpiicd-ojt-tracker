import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Public routes — accessible without authentication
  const isPublicRoute =
    pathname === "/" || pathname.startsWith("/api/auth")

  // Unauthenticated users on protected routes → go to landing
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  if (user) {
    // Check if user needs onboarding (program not set)
    // Skip this check on /onboarding itself and API routes to avoid loops
    const needsOnboardingCheck =
      !pathname.startsWith("/onboarding") && !pathname.startsWith("/api/")

    if (needsOnboardingCheck) {
      const { data: profile } = await supabase
        .from("users")
        .select("program")
        .eq("id", user.id)
        .single()

      // New users have program = '' from the handle_new_user trigger
      const needsOnboarding =
        profile && (!profile.program || profile.program === "")

      if (needsOnboarding) {
        const url = request.nextUrl.clone()
        url.pathname = "/onboarding"
        return NextResponse.redirect(url)
      }
    }

    // Authenticated users on landing page → go to dashboard
    if (pathname === "/") {
      const url = request.nextUrl.clone()
      url.pathname = "/dashboard"
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
