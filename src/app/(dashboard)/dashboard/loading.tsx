export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse space-y-6 p-4 md:p-6 lg:p-8">
      {/* Header — greeting only, no button */}
      <div className="space-y-2">
        <div className="h-8 w-56 rounded-md bg-muted" />
        <div className="h-5 w-40 rounded-md bg-muted" />
      </div>

      {/* Progress Ring + Stats */}
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start">
          {/* Progress Ring */}
          <div className="flex shrink-0 items-center justify-center rounded-xl border bg-card p-6 shadow-sm">
            <div className="size-48 rounded-full bg-muted" />
          </div>

          {/* Stats Cards */}
          <div className="w-full flex-1">
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border bg-card p-4 shadow-sm space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-20 rounded bg-muted" />
                    <div className="size-4 rounded bg-muted" />
                  </div>
                  <div className="h-7 w-16 rounded bg-muted" />
                  <div className="h-3 w-24 rounded bg-muted" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick actions (mobile only) */}
        <div className="grid grid-cols-2 gap-3 lg:hidden">
          <div className="h-[44px] rounded-md border bg-muted" />
          <div className="h-[44px] rounded-md border bg-muted" />
        </div>
      </div>

      {/* Recent Entries */}
      <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
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
    </div>
  )
}
