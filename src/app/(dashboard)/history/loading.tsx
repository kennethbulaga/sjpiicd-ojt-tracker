export default function HistoryLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-6 lg:p-8 animate-pulse">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-8 w-40 rounded-md bg-muted" />
          <div className="h-4 w-56 rounded-md bg-muted" />
        </div>
        <div className="h-11 w-32 rounded-md bg-muted" />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="h-11 flex-1 rounded-md bg-muted" />
        <div className="h-11 w-full sm:w-[160px] rounded-md bg-muted" />
      </div>

      {/* Table rows */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="h-11 bg-muted/50" /> {/* Table header */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 border-t border-border bg-muted/20" />
        ))}
      </div>
    </div>
  )
}
