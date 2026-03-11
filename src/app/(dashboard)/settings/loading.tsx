export default function SettingsLoading() {
  return (
    <div className="mx-auto max-w-2xl animate-pulse space-y-6 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-8 w-32 rounded-md bg-muted" />
        <div className="h-5 w-56 rounded-md bg-muted" />
      </div>

      {/* Account Card */}
      <div className="rounded-xl border bg-card p-6 shadow-sm space-y-3">
        <div className="h-5 w-20 rounded bg-muted" />
        <div className="h-4 w-40 rounded bg-muted" />
        <div className="h-4 w-48 rounded bg-muted" />
      </div>

      {/* Profile Card */}
      <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
        <div className="space-y-2">
          <div className="h-5 w-16 rounded bg-muted" />
          <div className="h-4 w-64 rounded bg-muted" />
        </div>

        {/* Form fields skeleton */}
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-24 rounded bg-muted" />
            <div className="h-[44px] w-full rounded-md bg-muted" />
            <div className="h-3 w-48 rounded bg-muted" />
          </div>
        ))}

        {/* Submit button */}
        <div className="h-[44px] w-32 rounded-md bg-muted" />
      </div>
    </div>
  )
}
