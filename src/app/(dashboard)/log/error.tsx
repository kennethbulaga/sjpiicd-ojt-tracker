"use client"

export default function LogError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center justify-center p-8 text-center">
      <h2 className="text-xl font-semibold text-destructive">
        Something went wrong
      </h2>
      <p className="mt-2 text-muted-foreground">
        {error.message || "Failed to load the log form."}
      </p>
      <button
        onClick={reset}
        className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
      >
        Try again
      </button>
    </div>
  )
}
