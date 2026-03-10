// Note 1: "loading.tsx" is a special Next.js App Router file that creates an
// automatic loading UI. When a user navigates to "/dashboard", Next.js shows
// this component INSTANTLY while the actual page.tsx is being server-rendered.
// Under the hood, it wraps page.tsx in a React Suspense boundary.

// Note 2: This is a "skeleton loading" pattern — showing placeholder shapes
// that match the layout of the real content. This is superior to a spinner
// because it gives users a preview of the page structure, reducing perceived
// loading time by up to 30% (based on UX research).
export default function DashboardLoading() {
  return (
    // Note 3: "animate-pulse" applies a CSS animation that fades content
    // in and out (opacity 0.5 to 1), creating the characteristic shimmer
    // effect. Tailwind provides this as a utility class — no custom CSS needed.
    <div className="p-4 md:p-6 lg:p-8 animate-pulse">
      {/* Note 4: This div mimics the ProgressRing component's dimensions.
          "size-48" is shorthand for "w-48 h-48" (192px x 192px).
          Using "bg-muted" for skeleton shapes ensures they adapt to
          both light and dark themes automatically. */}
      <div className="mx-auto mb-8 size-48 rounded-full bg-muted" />
      {/* Note 5: This grid mimics the StatsCards layout. The responsive
          grid ("grid-cols-1 sm:grid-cols-2 lg:grid-cols-3") matches the
          real component so the skeleton → content transition feels seamless.
          Array.from creates placeholder cards without needing real data. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 rounded-lg bg-muted" />
        ))}
      </div>
    </div>
  )
}
