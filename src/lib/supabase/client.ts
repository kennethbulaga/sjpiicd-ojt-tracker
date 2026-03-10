// Note 1: This module creates a Supabase client for use in Client Components
// (components with "use client"). It uses createBrowserClient from @supabase/ssr
// which stores the session in cookies (not localStorage), ensuring the session
// is shared between server and client rendering.
import { createBrowserClient } from "@supabase/ssr"

// Note 2: Unlike the server client (which is async and uses the cookies() API),
// the browser client is synchronous — it reads cookies directly from
// document.cookie. This makes it safe to call inside event handlers,
// useEffect hooks, and other client-side code.
export function createClient() {
  // Note 3: NEXT_PUBLIC_ prefix means these env vars are available in the
  // browser bundle. The anon key is designed to be public — it grants
  // access only through RLS policies, not admin privileges. Never expose
  // the service_role key in client code.
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
