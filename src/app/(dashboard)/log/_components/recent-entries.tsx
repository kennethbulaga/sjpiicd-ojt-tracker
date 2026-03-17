import { format } from "date-fns"
import { CalendarDays, Clock } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { DeleteEntryButton } from "@/components/time-entry/DeleteEntryButton"

import { SessionBadge } from "./session-badge"
import { formatMinutes, formatTime } from "./shared"

export async function RecentEntries() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: entries } = await supabase
    .from("time_entries")
    .select("id, date_logged, time_in, time_out, session_type, total_minutes, task_description, created_at")
    .eq("user_id", user.id)
    .order("date_logged", { ascending: false })
    .order("time_in", { ascending: false })
    .limit(6)

  return (
    <Card className="rounded-xl px-0 py-3 shadow-sm sm:py-5">
      <CardHeader className="space-y-0 px-3 pb-3 sm:px-5 sm:pb-4">
        <CardTitle className="flex items-center gap-1.5 text-[15px] sm:gap-2 sm:text-lg">
          <CalendarDays className="size-4 text-primary sm:size-5" />
          Recent Entries
        </CardTitle>
      </CardHeader>

      <CardContent className="px-3 sm:px-5">
        {!entries || entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center sm:py-8">
            <Clock className="mb-2 size-8 text-muted-foreground/50 sm:mb-3 sm:size-10" />
            <p className="text-[13px] font-medium text-muted-foreground sm:text-sm">
              No entries yet
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground/70 sm:text-xs">
              Your recent OJT logs will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="group flex items-start gap-2 rounded-lg border p-2.5 transition-colors hover:bg-muted/50 sm:gap-3 sm:p-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="text-[13px] font-medium sm:text-sm">
                      {format(new Date(entry.date_logged + "T00:00:00"), "MMM d, yyyy")}
                    </span>
                    <SessionBadge session={entry.session_type} />
                  </div>
                  <p className="mt-0.5 text-[11px] text-muted-foreground sm:mt-1 sm:text-sm">
                    {formatTime(entry.time_in)} – {formatTime(entry.time_out)}
                    <span className="ml-1 font-medium text-foreground sm:ml-2">
                      ({formatMinutes(entry.total_minutes)})
                    </span>
                  </p>
                  {entry.task_description ? (
                    <p className="mt-0.5 truncate text-[10px] text-muted-foreground/80 sm:mt-1 sm:text-xs">
                      {entry.task_description}
                    </p>
                  ) : null}
                  {entry.created_at ? (
                    <p className="mt-1 text-xs text-muted-foreground/60">
                      Logged {format(new Date(entry.created_at), "MMM d 'at' h:mm a")}
                    </p>
                  ) : null}
                </div>

                <DeleteEntryButton entryId={entry.id} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
