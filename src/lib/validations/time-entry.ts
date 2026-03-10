// Note 1: Zod is a TypeScript-first schema validation library. It lets you
// define a schema once and derive both the TypeScript type AND runtime
// validation from it — eliminating the common bug where types and validation
// logic drift apart.
import { z } from "zod"

// Note 2: "as const" creates a readonly tuple type. This means TypeScript
// knows the exact values ("Morning" | "Afternoon" | "Overtime"), not just
// "string[]". This tuple is used both for the Zod enum and for rendering
// dropdown options in the QuickLogForm — single source of truth.
export const sessionTypes = ["Morning", "Afternoon", "Overtime"] as const
// Note 3: This extracts the union type from the tuple:
// type SessionType = "Morning" | "Afternoon" | "Overtime"
// Using typeof with array index [number] is a TypeScript pattern for
// converting a const array into a union type.
export type SessionType = (typeof sessionTypes)[number]

// Note 4: The timeEntrySchema defines the shape and rules for OJT time entries.
// It's used in both the client (React Hook Form's zodResolver) and server
// (Server Action validation) — ensuring validation is consistent everywhere.
export const timeEntrySchema = z
  .object({
    // Note 5: z.string().date() validates ISO date format (YYYY-MM-DD).
    // The custom error message improves UX by telling users exactly what
    // format is expected instead of a generic "invalid string" message.
    date_logged: z.string().date("Invalid date format"),
    // Note 6: z.string().time() validates ISO time format (HH:mm:ss).
    // These strings (not Date objects) are stored directly in Supabase's
    // TIME columns, avoiding timezone conversion issues.
    time_in: z.string().time("Invalid time format"),
    time_out: z.string().time("Invalid time format"),
    // Note 7: z.enum() restricts values to the sessionTypes tuple.
    // In Zod v4, the `message` option customizes the error — without it, Zod
    // would show "Invalid enum value. Expected 'Morning' | 'Afternoon' | 'Overtime'".
    // (Zod v3 used `errorMap`; v4 simplified this to a `message` string.)
    session_type: z.enum(sessionTypes, {
      message: "Select a session type",
    }),
    // Note 8: Task description is optional (students may not always have
    // a description) with a 500-character max to prevent abuse. The
    // .optional() modifier means the field can be undefined (not submitted).
    task_description: z.string().max(500).optional(),
  })
  // Note 9: .refine() adds custom validation logic that depends on multiple
  // fields. The first refine ensures time_out is chronologically after time_in.
  // The "path" option tells React Hook Form which field to attach the error to.
  .refine((data) => data.time_out > data.time_in, {
    message: "Time Out must be after Time In",
    path: ["time_out"],
  })
  // Note 10: The second refine enforces the OJT time window (7:00 AM - 9:00 PM).
  // String comparison works for time values in HH:mm:ss format because they
  // sort lexicographically (e.g., "07:00:00" < "21:00:00"). This eliminates
  // the need to parse strings into Date objects.
  .refine((data) => data.time_in >= "07:00:00" && data.time_out <= "21:00:00", {
    message: "Entries must be between 7:00 AM and 9:00 PM",
    path: ["time_in"],
  })

// Note 11: z.infer<> extracts the TypeScript type from the Zod schema.
// This means TimeEntryInput always matches the schema — if you add a field
// to the schema, the type updates automatically. No manual synchronization.
export type TimeEntryInput = z.infer<typeof timeEntrySchema>
