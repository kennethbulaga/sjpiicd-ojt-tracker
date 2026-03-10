// Note 1: This directive marks the file as containing Server Actions.
// Server Actions allow Client Components to call server-side functions
// directly — no API route needed. The Next.js framework handles the
// serialization, network request, and response automatically.
"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

// Note 2: signOut is a Server Action that terminates the user's Supabase
// session. It clears the session cookies set by @supabase/ssr and
// redirects to the login page.
//
// Why a Server Action instead of client-side signOut?
// - Server-side signOut reliably clears HTTP-only cookies
// - Follows the project convention: all mutations = Server Actions
// - revalidatePath ensures cached data is cleared after logout
export async function signOut() {
  // Note 3: Create a server-side Supabase client with cookie access.
  const supabase = await createClient()

  // Note 4: signOut() revokes the session on the Supabase server and
  // clears the auth cookies from the response. The scope "local" means
  // only this device's session is terminated (not all devices).
  await supabase.auth.signOut()

  // Clear the onboarding cache cookie. Supabase clears its own auth
  // cookies, but our custom cookie must be removed explicitly.
  const cookieStore = await cookies()
  cookieStore.delete("ojt-onboarded")

  // Note 5: Revalidate the root layout to clear any cached authenticated
  // data. This ensures that if the user logs back in as a different user,
  // they won't see stale data from the previous session.
  revalidatePath("/", "layout")

  // Note 6: Redirect to the login page. The redirect() function from
  // next/navigation throws a special error that Next.js catches to
  // perform a server-side redirect. It must be called outside try/catch.
  redirect("/")
}
