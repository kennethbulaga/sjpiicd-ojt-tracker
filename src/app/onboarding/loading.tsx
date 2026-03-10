export default function OnboardingLoading() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-muted/40 px-4 py-8 animate-pulse">
      {/* Logo skeleton */}
      <div className="mb-6 size-16 rounded-xl bg-muted" />

      {/* Card skeleton */}
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-sm">
        {/* Title area */}
        <div className="mx-auto mb-2 h-7 w-48 rounded bg-muted" />
        <div className="mx-auto mb-6 h-4 w-64 rounded bg-muted" />

        {/* Form fields */}
        <div className="space-y-5">
          <div>
            <div className="mb-2 h-4 w-20 rounded bg-muted" />
            <div className="h-11 rounded-md bg-muted" />
          </div>
          <div>
            <div className="mb-2 h-4 w-32 rounded bg-muted" />
            <div className="h-11 rounded-md bg-muted" />
          </div>
          <div>
            <div className="mb-2 h-4 w-36 rounded bg-muted" />
            <div className="h-11 rounded-md bg-muted" />
          </div>
          <div className="h-11 rounded-md bg-primary/20" />
        </div>
      </div>
    </div>
  )
}
