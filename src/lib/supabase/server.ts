// Note 1: This module creates a Supabase client for use in Server Components,
// Server Actions, and Route Handlers. It uses @supabase/ssr (not the vanilla
// @supabase/supabase-js) because SSR requires cookie-based session management
// instead of localStorage (which doesn't exist on the server).
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

// Note 2: The function is async because Next.js 15+ requires "await cookies()"
// (the cookies API became asynchronous for better streaming support).
// Naming it "createClient" (not "createSupabaseClient") follows the
// convention used in Supabase's official documentation.
export async function createClient() {
  // Note 3: "await cookies()" returns a read/write interface to the
  // request's cookies. In Server Components, cookies are read-only
  // (setAll will silently fail via the try-catch below). In Server Actions
  // and Route Handlers, cookies are writable.
  const cookieStore = await cookies()

  return createServerClient(
    // Note 4: The "!" (non-null assertion) tells TypeScript these environment
    // variables are guaranteed to exist at runtime. They're prefixed with
    // "NEXT_PUBLIC_" because Supabase's anon key is safe to expose to the
    // browser — it's a public key that only works with Row Level Security (RLS).
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // Note 5: The cookies adapter bridges Supabase's session management
      // with Next.js cookie handling. getAll() reads all cookies from the
      // request, and setAll() writes updated session cookies to the response.
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Note 6: This catch is intentional and expected. When setAll()
            // is called from a Server Component (which is read-only), the
            // cookie write fails silently. This is safe because the middleware
            // (src/middleware.ts) refreshes the session on every request,
            // ensuring the cookies are always up-to-date.
          }
        },
      },
    }
  )
}
