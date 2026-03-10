"use client"

export default function OnboardingError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-muted/40 px-4 py-8 text-center">
      <h2 className="text-xl font-semibold text-destructive">
        Something went wrong
      </h2>
      <p className="mt-2 max-w-sm text-muted-foreground">
        {error.message || "Failed to load the onboarding page."}
      </p>
      <button
        onClick={reset}
        className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 min-h-[44px]"
      >
        Try again
      </button>
    </div>
  )
}
