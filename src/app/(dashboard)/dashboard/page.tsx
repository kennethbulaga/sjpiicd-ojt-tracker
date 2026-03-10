// Note 1: This Server Component page is the main dashboard view at "/dashboard".
// As a Server Component, it can directly fetch data from Supabase on the server
// (using the server client) before rendering — no useEffect or loading spinners
// needed for the initial data. This pattern is called "server-side data fetching"
// and results in faster, SEO-friendly page loads.

// Note 2: In a production implementation, this page will:
// 1. Fetch the user's total minutes from Supabase via the server client
// 2. Pass the data as props to ProgressRing and StatsCards (Client Components)
// This "fetch on server, render on client" pattern keeps data fetching secure
// (API keys never reach the browser) while allowing interactive UI.
export default function DashboardPage() {
  return (
    // Note 3: The responsive padding pattern "p-4 md:p-6 lg:p-8" provides
    // tighter spacing on mobile (16px), medium on tablets (24px), and generous
    // on desktops (32px). This is a mobile-first approach — the base style
    // targets the smallest screen, and breakpoint modifiers add space as
    // viewport width increases.
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {/* Note 4: ProgressRing and StatsCards will be imported here.
          Both are Client Components ("use client") because they need
          interactivity or browser APIs. They receive data as props
          from this Server Component parent. */}
    </div>
  )
}
