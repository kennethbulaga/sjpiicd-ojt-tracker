import { Suspense } from "react"

import { QuickLogForm } from "@/components/time-entry/QuickLogForm"
import { RecentEntries } from "@/components/time-entry/RecentEntries"

export const metadata = {
  title: "Log Hours — JP Track",
}

function RecentEntriesSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border bg-card p-6 shadow-sm space-y-4">
      <div className="h-6 w-32 rounded-md bg-muted" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-lg border p-3 space-y-2">
          <div className="flex gap-2">
            <div className="h-4 w-24 rounded bg-muted" />
            <div className="h-5 w-16 rounded-full bg-muted" />
          </div>
          <div className="h-4 w-40 rounded bg-muted" />
        </div>
      ))}
    </div>
  )
}

export default function LogPage() {
  return (
    <div className="mx-auto max-w-5xl p-4 md:p-6 lg:p-8">
      <h1 className="mb-6 text-2xl font-bold">Log Hours</h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Left: Quick Log Form */}
        <QuickLogForm />

        {/* Right: Recent Entries (server-fetched, streamed in) */}
        <Suspense fallback={<RecentEntriesSkeleton />}>
          <RecentEntries />
        </Suspense>
      </div>
    </div>
  )
}
