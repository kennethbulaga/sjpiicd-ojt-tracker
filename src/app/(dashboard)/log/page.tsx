import { Suspense } from "react"

import { createClient } from "@/lib/supabase/server"
import { resolveDateParam } from "./_components/date-param"
import { QuickLogForm } from "./_components/quick-log-form"
import { RecentEntries } from "./_components/recent-entries"
import type { TimeEntryListItem } from "./_components/shared"

export const metadata = {
  title: "Log Hours — JP Track",
}

interface LogPageProps {
  searchParams: Promise<{ date?: string }>
}

function RecentEntriesSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-4 sm:gap-6 rounded-xl border bg-card py-3 px-3 sm:py-5 sm:px-5 shadow-sm">
      <div className="h-5 sm:h-6 w-32 rounded-md bg-muted" />
      <div className="space-y-2 sm:space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg border p-2.5 sm:p-3 space-y-2">
            <div className="flex gap-2">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="h-4 sm:h-5 w-16 rounded-full bg-muted" />
            </div>
            <div className="h-3 sm:h-4 w-40 rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default async function LogPage({ searchParams }: LogPageProps) {
  const params = await searchParams
  const initialDate = resolveDateParam(params.date)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let initialEntries: TimeEntryListItem[] = []

  if (user) {
    const { data } = await supabase
      .from("time_entries")
      .select("id, date_logged, time_in, time_out, session_type, total_minutes, task_description, created_at")
      .eq("user_id", user.id)
      .eq("date_logged", initialDate)
      .order("time_in", { ascending: false })

    initialEntries = (data ?? []) as TimeEntryListItem[]
  }

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-6 lg:p-8">
      <h1 className="mb-6 text-2xl font-bold">Log Hours</h1>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1fr_1fr]">
        <QuickLogForm
          initialDate={initialDate}
          userId={user?.id ?? null}
          initialEntries={initialEntries}
        />

        {/* Right: Recent Entries (server-fetched, streamed in) */}
        <Suspense fallback={<RecentEntriesSkeleton />}>
          <RecentEntries />
        </Suspense>
      </div>
    </div>
  )
}
