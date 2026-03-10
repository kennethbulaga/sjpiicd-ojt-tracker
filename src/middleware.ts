// Note 1: This is the Next.js middleware entry point. Middleware runs BEFORE
// every matched request, making it the ideal place for authentication checks
// and session management. It executes on the Edge Runtime (not Node.js),
// which means it runs in data centers close to the user for low latency.
import { type NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

// Note 2: The middleware function delegates to updateSession(), which handles
// both session refresh (keeping auth tokens fresh) and route protection
// (redirecting unauthenticated users to /login). Keeping the logic in a
// separate module (lib/supabase/middleware.ts) makes it testable and
// keeps this file clean.
export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

// Note 3: The matcher config determines which routes the middleware runs on.
// This negative lookahead regex matches ALL routes EXCEPT:
// - _next/static: Webpack-bundled static assets (JS, CSS)
// - _next/image: Next.js image optimization API responses
// - favicon.ico: Browser favicon request
// - Static files: Images and media (svg, png, jpg, etc.)
//
// By excluding these, the middleware only runs on page navigations and
// API calls — not on every static asset request, which would slow down
// page loads significantly.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
