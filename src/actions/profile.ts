// Note 1: "use server" makes every exported async function in this module
// a Server Action. These run exclusively on the server — the client calls
// them like regular functions, but Next.js converts the call into an HTTP
// POST request behind the scenes.
"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
// Note 2: Zod is imported for server-side validation. The profileSchema
// is defined locally (not shared with the client) because the settings
// form may have different client-side UX validation (e.g., debounced
// uniqueness checks) that don't belong in the server schema.
import { z } from "zod"

// Note 3: The profile schema validates user profile update data.
// Each field has specific constraints that map to business rules.
const profileSchema = z.object({
  // Note 4: z.string().min(1) rejects empty strings. Without min(1),
  // an empty form submission would pass validation because "" is still
  // a valid string. This is a common Zod gotcha.
  full_name: z.string().min(1, "Full name is required"),
  program: z.string().min(1, "Program is required"),
  company_name: z.string().optional(),
  // Note 5: z.coerce.number() converts string input ("486") to a number.
  // This is necessary because FormData always returns strings, even for
  // number inputs. The chain .int().min(1).max(2000) ensures the value
  // is a reasonable positive integer for OJT target hours.
  target_hours: z.coerce
    .number()
    .int()
    .min(1, "Target hours must be at least 1")
    .max(2000, "Target hours cannot exceed 2000"),
})

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
    program: formData.get("program"),
    company_name: formData.get("company_name") || undefined,
    target_hours: formData.get("target_hours"),
  }

  const result = profileSchema.safeParse(raw)
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
