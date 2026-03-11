// Note 1: "use server" makes every exported async function in this module
// a Server Action. These run exclusively on the server — the client calls
// them like regular functions, but Next.js converts the call into an HTTP
// POST request behind the scenes.
"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
// zod: compose-shared-schemas — import from shared validation module
// so client and server always validate with identical rules.
import { profileServerSchema } from "@/lib/validations/profile"

// Note 6: The updateProfile Server Action follows the same pattern as
// createTimeEntry: authenticate -> validate -> mutate -> revalidate.
// This consistency makes the codebase predictable and easier to maintain.
export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  const raw = {
    full_name: formData.get("full_name"),
    nickname: formData.get("nickname") || null,
    program: formData.get("program"),
    company_name: formData.get("company_name") || undefined,
    target_hours: formData.get("target_hours"),
  }

  const result = profileServerSchema.safeParse(raw)
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  // Note 7: The Supabase update uses .eq("id", user.id) to ensure the
  // user can only update their own profile. Combined with RLS policies,
  // this creates two layers of protection against unauthorized updates.
  const { error } = await supabase
    .from("users")
    .update(result.data)
    .eq("id", user.id)

  if (error) {
    return { error: error.message }
  }

  // Note 8: Revalidating both /dashboard and /settings ensures the
  // updated profile data (e.g., new target hours, program) is reflected
  // everywhere it's displayed. The dashboard shows progress based on
  // target_hours, so it must be revalidated when that value changes.
  revalidatePath("/dashboard")
  revalidatePath("/settings")
  return { success: true }
}
