import { z } from "zod"

// Client-side schema: used by React Hook Form where Input type="number"
// already provides a number. No coercion needed.
export const onboardingSchema = z.object({
  target_hours: z
    .number({ message: "Target hours is required" })
    .int("Target hours must be a whole number")
    .min(1, "Target hours must be at least 1")
    .max(2000, "Target hours cannot exceed 2000"),
})

// Server-side schema: used by Server Actions where FormData.get() returns
// a string. Coercion converts the string to a number before validation.
export const onboardingServerSchema = z.object({
  target_hours: z.coerce
    .number()
    .int("Target hours must be a whole number")
    .min(1, "Target hours must be at least 1")
    .max(2000, "Target hours cannot exceed 2000"),
})

export type OnboardingInput = z.infer<typeof onboardingSchema>
