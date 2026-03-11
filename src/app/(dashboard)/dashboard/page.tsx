import { redirect } from "next/navigation"
import { Suspense } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"

import { createClient } from "@/lib/supabase/server"
import { getPhilippineNow } from "@/lib/utils"
import { ProgressRing } from "@/components/dashboard/ProgressRing"
import { StatsCards } from "@/components/dashboard/StatsCards"
import { RecentEntries } from "@/components/time-entry/RecentEntries"
import { FloatingActionButton } from "@/components/dashboard/FloatingActionButton"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Dashboard — JP Track",
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  // Fetch user profile for target_hours
  const { data: profile } = await supabase
    .from("users")
    .select("target_hours, full_name, nickname")
    .eq("id", user.id)
    .single()

  const targetHours = profile?.target_hours ?? 486

  // Fetch total minutes from all time entries
  const { data: entries } = await supabase
    .from("time_entries")
    .select("total_minutes, date_logged")
    .eq("user_id", user.id)

  const totalMinutes = entries?.reduce((sum, e) => sum + (e.total_minutes ?? 0), 0) ?? 0
  const hoursCompleted = totalMinutes / 60
  const totalEntries = entries?.length ?? 0

  // Get Philippine date/time for server-side calculations
  const phNow = getPhilippineNow()

  // Today's minutes (using PH date, not server UTC)
  const today = phNow.date
  const todayMinutes =
    entries
      ?.filter((e) => e.date_logged === today)
      .reduce((sum, e) => sum + (e.total_minutes ?? 0), 0) ?? 0

  // Greeting
  const firstName =
    profile?.nickname ||
    profile?.full_name?.split(" ")[0] ||
    user.user_metadata?.full_name?.split(" ")[0] ||
    "Student"

  const greeting =
    phNow.hour < 12 ? "Good morning" : phNow.hour < 17 ? "Good afternoon" : "Good evening"

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-6 lg:p-8">
      {/* Header with greeting + CTA */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {greeting}, {firstName}!
          </h1>
          <p className="text-sm text-muted-foreground">
            Here&apos;s your OJT progress overview.
          </p>
        </div>
      </div>

      {/* Progress Ring + Stats */}
      <div className="space-y-6">
        {/* Top row: Progress Ring centered on mobile, left-aligned on desktop with stats beside it */}
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start">
          <div className="flex shrink-0 items-center justify-center rounded-xl border bg-card p-6 shadow-sm">
            <ProgressRing
              hoursCompleted={hoursCompleted}
              targetHours={targetHours}
            />
          </div>

          {/* Stats Cards — full width, all 4 in a single row on lg */}
          <div className="w-full flex-1">
            <StatsCards
              hoursCompleted={hoursCompleted}
              targetHours={targetHours}
              totalEntries={totalEntries}
              todayMinutes={todayMinutes}
            />
          </div>
        </div>

        {/* Quick actions for mobile */}
        <div className="grid grid-cols-2 gap-3 lg:hidden">
          <Button variant="outline" className="min-h-[44px]" asChild>
            <Link href="/history">View History</Link>
          </Button>
          <Button variant="outline" className="min-h-[44px]" asChild>
            <Link href="/settings">Settings</Link>
          </Button>
        </div>
      </div>

      {/* Recent Entries (reuse from /log page) */}
      <Suspense
        fallback={
          <div className="animate-pulse rounded-xl border bg-card p-6 shadow-sm space-y-4">
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
        }
      >
        <RecentEntries />
      </Suspense>

      <FloatingActionButton />
    </div>
  )
}
