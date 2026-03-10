import { z } from "zod"

export const onboardingSchema = z.object({
  target_hours: z.coerce
    .number()
    .int("Target hours must be a whole number")
    .min(1, "Target hours must be at least 1")
    .max(2000, "Target hours cannot exceed 2000"),
})

export type OnboardingInput = z.infer<typeof onboardingSchema>
