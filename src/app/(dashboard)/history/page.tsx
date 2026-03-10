import { redirect } from "next/navigation"
import { Suspense } from "react"

import { createClient } from "@/lib/supabase/server"
import { DTRTable } from "@/components/history/DTRTable"
import { ExportActions } from "@/components/history/ExportActions"

export const metadata = {
  title: "DTR History — JP Track",
}

export default async function HistoryPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  // Fetch all time entries for the current user, ordered by date descending
  const { data: entries, error } = await supabase
    .from("time_entries")
    .select(
      "id, date_logged, time_in, time_out, total_minutes, session_type, task_description, created_at"
    )
    .eq("user_id", user.id)
    .order("date_logged", { ascending: false })
    .order("time_in", { ascending: false })

  if (error) {
    console.error("Error fetching time entries:", error)
  }

  const safeEntries = entries ?? []

  // Calculate summary stats
  const totalMinutes = safeEntries.reduce(
    (sum, e) => sum + (e.total_minutes ?? 0),
    0
  )
  const totalHours = totalMinutes / 60

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-6 lg:p-8">
      {/* Header with summary and export */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">DTR History</h1>
          <p className="text-sm text-muted-foreground">
            {safeEntries.length} entries · {totalHours.toFixed(1)} total hours
          </p>
        </div>
        <ExportActions entries={safeEntries} />
      </div>

      {/* DTR Table */}
      <Suspense
        fallback={
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 rounded-lg bg-muted" />
            ))}
          </div>
        }
      >
        <DTRTable entries={safeEntries} />
      </Suspense>
    </div>
  )
}
