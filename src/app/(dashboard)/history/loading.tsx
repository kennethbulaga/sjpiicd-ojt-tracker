// Note 1: This loading skeleton mimics the DTR History page structure.
// Next.js shows this instantly while the real page data is being fetched.
// The skeleton shapes should match the final layout so the transition
// from skeleton to real content feels seamless and predictable.
export default function HistoryLoading() {
  return (
    <div className="p-4 md:p-6 lg:p-8 animate-pulse">
      {/* Note 2: "h-8 w-40" mimics the page heading dimensions.
          "rounded" and "bg-muted" create a subtle placeholder bar.
          These skeleton elements use the "muted" semantic color token
          which adapts to dark mode automatically. */}
      <div className="h-8 w-40 rounded bg-muted mb-6" />
      {/* Note 3: Eight skeleton rows simulate the DTR table. Using
          Array.from({ length: 8 }) creates an array of 8 undefined values,
          which is a clean way to render repeated placeholder elements
          without creating a real array. The underscore (_) convention
          indicates an intentionally unused variable. */}
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-12 rounded bg-muted" />
        ))}
      </div>
    </div>
  )
}
