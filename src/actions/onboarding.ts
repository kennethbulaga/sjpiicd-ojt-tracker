"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { onboardingSchema } from "@/lib/validations/onboarding"

// typescript-best-practices: Discriminated union for typed Server Action returns.
// Makes illegal states unrepresentable — caller must handle both success and error.
type ActionResult =
  | { success: true }
  | { error: string }
  | { error: Record<string, string[] | undefined> }

export async function skipOnboarding(): Promise<ActionResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  // Set program to "-" so the proxy stops redirecting to /onboarding.
  // Keep default target_hours (486) from the DB.
  const { error } = await supabase
    .from("users")
    .update({ program: "-" })
    .eq("id", user.id)

  if (error) {
    return { error: `Failed to skip onboarding: ${error.message}` }
  }

  revalidatePath("/dashboard")
  redirect("/dashboard")
}

export async function completeOnboarding(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  const raw = {
    target_hours: formData.get("target_hours"),
  }

  // zod: safeParse for user input (parse-use-safeparse), flatten for form errors (error-use-flatten)
  const result = onboardingSchema.safeParse(raw)
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  const { error } = await supabase
    .from("users")
    .update({
      program: "-",
      target_hours: result.data.target_hours,
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
