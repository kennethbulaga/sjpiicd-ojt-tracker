import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Server-only admin client bypassing RLS.
// Use ONLY for public-facing aggregated/read-only queries
// (e.g., landing page company counts) where no user session exists.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}
