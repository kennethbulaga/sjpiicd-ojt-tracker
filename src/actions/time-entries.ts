// Note 1: "use server" marks this entire module as a Server Actions module.
// Every exported async function becomes a Server Action — a function that
// runs on the server but can be called from Client Components as if it were
// a local function. Next.js handles the HTTP request/response automatically.
"use server"

// Note 2: revalidatePath tells Next.js to re-fetch the data for specific
// routes. After creating/deleting an entry, the dashboard and history pages
// need fresh data. Without revalidation, they'd show stale cached data.
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
// Note 3: Importing the Zod schema here ensures server-side validation
// mirrors the client-side validation exactly. Even if a malicious user
// bypasses the client form, the server will reject invalid data.
import { timeEntrySchema } from "@/lib/validations/time-entry"
// Note 4: date-fns provides reliable date/time math. differenceInMinutes
// calculates the exact gap between two times, and parse() converts time
// strings ("08:00:00") into Date objects for the calculation.
import { differenceInMinutes, format, parse } from "date-fns"

// Note 5: Server Actions receive FormData when called from a <form> element
// with the "action" attribute. FormData is a web standard that represents
// form field name-value pairs — it works even without JavaScript (progressive
// enhancement). In this app, React Hook Form calls the action programmatically.
export async function createTimeEntry(formData: FormData) {
  // Note 6: Creating the Supabase server client inside the action (not at
  // module scope) ensures each request gets a fresh client with the correct
  // auth context. Module-level clients would share state between requests.
  const supabase = await createClient()
  // Note 7: getUser() verifies the session and returns the authenticated user.
  // This is the first line of defense — if the user isn't logged in,
  // we reject immediately without hitting the database.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  // Note 8: FormData.get() returns FormDataEntryValue (string | File) or null.
  // We extract raw values and pass them to Zod for validation. This keeps
  // the parsing logic in one place (the schema) rather than scattered here.
  const raw = {
    date_logged: formData.get("date_logged"),
    time_in: formData.get("time_in"),
    time_out: formData.get("time_out"),
    session_type: formData.get("session_type"),
    task_description: formData.get("task_description") || undefined,
  }

  // Note 9: safeParse() validates without throwing. It returns either
  // { success: true, data } or { success: false, error }. This is preferred
  // over parse() (which throws) because Server Actions should return
  // errors gracefully, not crash with unhandled exceptions.
  const result = timeEntrySchema.safeParse(raw)
  if (!result.success) {
    // Note 10: flatten() converts Zod's nested error structure into a
    // simpler { fieldErrors: { time_in: ["..."], ... } } format that's
    // easy to display next to form fields in the UI.
    return { error: result.error.flatten().fieldErrors }
  }

  // Future time validation: if the entry is for today, time_out cannot be
  // in the future. This prevents students from logging hours they haven't
  // worked yet (e.g., logging 3PM-5PM when it's only 2PM).
  const now = new Date()
  const todayStr = format(now, "yyyy-MM-dd")
  const currentTimeStr = format(now, "HH:mm:ss")

  if (result.data.date_logged === todayStr) {
    if (result.data.time_out > currentTimeStr) {
      return {
        error: {
          time_out: [
            `Time Out cannot be in the future. Current time is ${format(now, "h:mm a")}.`,
          ],
        },
      }
    }
    if (result.data.time_in > currentTimeStr) {
      return {
        error: {
          time_in: [
            `Time In cannot be in the future. Current time is ${format(now, "h:mm a")}.`,
          ],
        },
      }
    }
  }

  const { time_in, time_out, ...rest } = result.data
  // Note 12: parse() converts time strings to Date objects using a format
  // pattern. The base date (new Date()) doesn't matter because we only
  // care about the time difference, not the absolute date.
  const timeInDate = parse(time_in, "HH:mm:ss", new Date())
  const timeOutDate = parse(time_out, "HH:mm:ss", new Date())
  // Note 13: differenceInMinutes returns a whole number of minutes between
  // two dates. Storing minutes (not hours) as an integer avoids floating-point
  // issues (e.g., 4 hours 30 min = 270, not 4.5000000001).
  const total_minutes = differenceInMinutes(timeOutDate, timeInDate)

  // Note 14: The Supabase insert adds user_id from the authenticated session.
  // Even though RLS would block inserts for other users, explicitly setting
  // user_id is clearer and prevents accidental data leaks.
  const { error } = await supabase.from("time_entries").insert({
    user_id: user.id,
    time_in,
    time_out,
    total_minutes,
    ...rest,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/history")
  revalidatePath("/log")
  return { success: true }
}

export async function deleteTimeEntry(entryId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  // Note 16: The .eq("user_id", user.id) filter is a defense-in-depth
  // measure. Even though RLS policies already restrict access to the user's
  // own entries, this explicit filter ensures the delete only affects
  // rows owned by the authenticated user — protecting against RLS
  // misconfiguration.
  const { error } = await supabase
    .from("time_entries")
    .delete()
    .eq("id", entryId)
    .eq("user_id", user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/history")
  revalidatePath("/log")
  return { success: true }
}
