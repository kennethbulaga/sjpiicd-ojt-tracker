import { z } from "zod"

// Client-side profile schema: used by React Hook Form where HTML
// input type="number" provides an actual number value. No coercion needed.
export const profileSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  nickname: z.string().optional(),
  program: z.string().min(1, "Program is required"),
  company_name: z.string().optional(),
  target_hours: z
    .number({ error: "Enter a valid number" })
    .int("Must be a whole number")
    .min(1, "Target hours must be at least 1")
    .max(999, "Target hours cannot exceed 999"),
})

// Server-side profile schema: used by Server Actions where FormData.get()
// returns strings. Coercion converts the string to number before validation.
export const profileServerSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  nickname: z.string().optional(),
  program: z.string().min(1, "Program is required"),
  company_name: z.string().optional(),
  target_hours: z.coerce
    .number()
    .int()
    .min(1, "Target hours must be at least 1")
    .max(999, "Target hours cannot exceed 999"),
})

export type ProfileInput = z.infer<typeof profileSchema>
