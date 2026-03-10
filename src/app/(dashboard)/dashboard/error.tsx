// Note 1: "use client" is REQUIRED for error.tsx files. Next.js error boundaries
// must be Client Components because they use React's error boundary mechanism,
// which relies on class component lifecycle methods (componentDidCatch) that
// only work on the client side.
"use client"

// Note 2: "error.tsx" is a special App Router file that catches runtime errors
// in its route segment and all child segments. If page.tsx or any component it
// renders throws an error, this component renders instead of crashing the app.
// It acts as a React Error Boundary scoped to the "/dashboard" route.
export default function DashboardError({
  error,
  reset,
}: {
  // Note 3: The "error" prop contains the thrown Error object. The optional
  // "digest" property is a hashed error identifier that Next.js generates
  // for server-side errors — it's safe to show to users (unlike the full
  // error message which might contain sensitive data).
  error: Error & { digest?: string }
  // Note 4: "reset" is a function provided by Next.js that re-renders the
  // route segment. Calling it attempts to recover from the error by re-running
  // the Server Component that failed. This is useful for transient errors
  // (e.g., a database timeout that succeeds on retry).
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      {/* Note 5: "text-destructive" maps to the destructive color token
          defined in globals.css (a red shade in OKLCH). Using semantic color
          tokens instead of hardcoded colors ensures consistency and automatic
          dark mode support. */}
      <h2 className="text-xl font-semibold text-destructive">
        Something went wrong
      </h2>
      <p className="mt-2 text-muted-foreground">
        {error.message || "Failed to load dashboard data."}
      </p>
      {/* Note 6: The retry button uses semantic color classes (bg-primary,
          text-primary-foreground) which automatically adapt to theme changes.
          "hover:bg-primary/90" uses Tailwind's opacity modifier to darken
          the background on hover — a common interactive feedback pattern. */}
      <button
        onClick={reset}
        className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
      >
        Try again
      </button>
    </div>
  )
}
