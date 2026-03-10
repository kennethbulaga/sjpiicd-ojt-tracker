export default function LogLoading() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse p-4 md:p-6 lg:p-8">
      {/* Title */}
      <div className="mb-6 h-8 w-32 rounded-md bg-muted" />

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Left: Form skeleton */}
        <div className="rounded-xl border bg-card p-6 shadow-sm space-y-5">
          <div className="h-6 w-24 rounded-md bg-muted" />

          {/* Date */}
          <div className="space-y-2">
            <div className="h-4 w-10 rounded bg-muted" />
            <div className="h-11 w-full rounded-md bg-muted" />
          </div>

          {/* Session type */}
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-muted" />
            <div className="h-11 w-full rounded-md bg-muted" />
          </div>

          {/* Time inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <div className="h-4 w-14 rounded bg-muted" />
              <div className="h-11 w-full rounded-md bg-muted" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-16 rounded bg-muted" />
              <div className="h-11 w-full rounded-md bg-muted" />
            </div>
          </div>

          {/* Textarea */}
          <div className="space-y-2">
            <div className="h-4 w-40 rounded bg-muted" />
            <div className="h-20 w-full rounded-md bg-muted" />
          </div>

          {/* Submit */}
          <div className="h-11 w-full rounded-md bg-primary/50" />
        </div>

        {/* Right: Recent entries skeleton */}
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
    </div>
  )
}
