// Note 1: This page maps to the "/log" route. It serves as the primary data
// entry point where students log their OJT hours using either the QuickLogForm
// (timesheet-style manual entry) or the LiveTracker (start/stop timer).

// Note 2: As a Server Component, this page can pre-fetch user preferences
// (e.g., default session type, target hours) from Supabase before rendering.
// The QuickLogForm and LiveTracker are Client Components that receive this
// pre-fetched data as props — keeping API keys server-side while enabling
// interactive form controls in the browser.
export default function LogPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl font-bold">Log Hours</h1>
      {/* Note 3: Two Client Components will be placed here:
          - QuickLogForm: Calendar-based rapid entry with smart defaults
            (Morning: 8AM-12PM, Afternoon: 1PM-5PM)
          - LiveTracker: Start/stop timer for real-time hour tracking
          Both submit data via Server Actions (not API routes) for
          type-safe, progressively-enhanced form handling. */}
    </div>
  )
}
