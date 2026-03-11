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
import { getPhilippineNow } from "@/lib/utils"
// Note 4: date-fns provides reliable date/time math. differenceInMinutes
// calculates the exact gap between two times, and parse() converts time
// strings ("08:00:00") into Date objects for the calculation.
import { differenceInMinutes, parse } from "date-fns"

// Helper: format minutes as "Xh Ym" for error messages
function formatMinutesShort(mins: number): string {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

// Helper: format "HH:mm:ss" time string as "h:mm AM/PM" for error messages
function formatTimeDisplay(timeStr: string): string {
  const date = parse(timeStr, "HH:mm:ss", new Date())
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date)
}

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

  // Future time validation: if the entry is for today (PH time), time_out
  // cannot be in the future. Uses Philippine timezone to match student expectations.
  const phNow = getPhilippineNow()
  const todayStr = phNow.date
  const currentTimeStr = phNow.time

  if (result.data.date_logged === todayStr) {
    if (result.data.time_out > currentTimeStr) {
      // Format current PH time for display (e.g., "3:45 PM")
      const displayTime = new Intl.DateTimeFormat("en-PH", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Manila",
      }).format(new Date())
      return {
        error: {
          time_out: [
            `Time Out cannot be in the future. Current time is ${displayTime}.`,
          ],
        },
      }
    }
    if (result.data.time_in > currentTimeStr) {
      const displayTime = new Intl.DateTimeFormat("en-PH", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Manila",
      }).format(new Date())
      return {
        error: {
          time_in: [
            `Time In cannot be in the future. Current time is ${displayTime}.`,
          ],
        },
      }
    }
  }

  const { time_in, time_out, ...rest } = result.data

  // Calculate duration of the new entry first (needed for limit check)
  const timeInDate = parse(time_in, "HH:mm:ss", new Date())
  const timeOutDate = parse(time_out, "HH:mm:ss", new Date())
  const total_minutes = differenceInMinutes(timeOutDate, timeInDate)

  // Fetch existing entries for the same date to check limits and overlaps
  const { data: existingEntries } = await supabase
    .from("time_entries")
    .select("time_in, time_out, total_minutes, session_type")
    .eq("user_id", user.id)
    .eq("date_logged", result.data.date_logged)

  if (existingEntries && existingEntries.length > 0) {
    // Max 12 hours/day validation
    const existingMinutes = existingEntries.reduce(
      (sum, e) => sum + (e.total_minutes ?? 0),
      0
    )
    const MAX_DAILY_MINUTES = 720 // 12 hours
    if (existingMinutes + total_minutes > MAX_DAILY_MINUTES) {
      const remainingMinutes = Math.max(0, MAX_DAILY_MINUTES - existingMinutes)
      const remainingH = Math.floor(remainingMinutes / 60)
      const remainingM = remainingMinutes % 60
      const remainingStr = remainingH > 0
        ? `${remainingH}h${remainingM > 0 ? ` ${remainingM}m` : ""}`
        : `${remainingM}m`
      return {
        error: {
          time_out: [
            `Adding this session (${formatMinutesShort(total_minutes)}) would exceed the 12-hour daily limit. You have ${remainingStr} remaining today.`,
          ],
        },
      }
    }

    // Overlap detection — check if new [time_in, time_out] overlaps any existing entry
    // Two ranges [A_start, A_end] and [B_start, B_end] overlap iff A_start < B_end AND A_end > B_start
    for (const existing of existingEntries) {
      if (time_in < existing.time_out && time_out > existing.time_in) {
        const overlapStart = formatTimeDisplay(existing.time_in)
        const overlapEnd = formatTimeDisplay(existing.time_out)
        return {
          error: {
            time_in: [
              `This session overlaps with an existing ${existing.session_type} entry (${overlapStart} – ${overlapEnd}).`,
            ],
          },
        }
      }
    }
  }

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
