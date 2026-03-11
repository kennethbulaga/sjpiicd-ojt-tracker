"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { onboardingServerSchema } from "@/lib/validations/onboarding"

// typescript-best-practices: Discriminated union for typed Server Action returns.
// Makes illegal states unrepresentable — caller must handle both success and error.
type ActionResult =
  | { success: true }
  | { error: string }
  | { error: Record<string, string[] | undefined> }



export async function completeOnboarding(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  const raw = {
    company_name: formData.get("company_name"),
    target_hours: formData.get("target_hours"),
    program: formData.get("program") || undefined,
  }

  // zod: safeParse for user input (parse-use-safeparse), flatten for form errors (error-use-flatten)
  // Uses onboardingServerSchema (with z.coerce) because FormData values are strings.
  const result = onboardingServerSchema.safeParse(raw)
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  const { error } = await supabase
    .from("users")
    .update({
      company_name: result.data.company_name,
      target_hours: result.data.target_hours,
      program: result.data.program || "-",
    })
    .eq("id", user.id)

  if (error) {
    // typescript-best-practices: Wrap external calls with context
    return { error: `Failed to save profile: ${error.message}` }
  }

  revalidatePath("/dashboard")
  revalidatePath("/settings")
  redirect("/dashboard")
}
