import { format } from "date-fns"
import { CalendarDays, Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import { DeleteEntryButton } from "@/components/time-entry/DeleteEntryButton"
import { formatMinutes, formatTime, type SessionType, sessionBadgeVariant } from "./shared"

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
    <Card className="rounded-xl shadow-sm py-3 px-0 sm:py-5">
      <CardHeader className="space-y-0 pb-3 sm:pb-4 px-3 sm:px-5">
        <CardTitle className="flex items-center gap-1.5 sm:gap-2 text-[15px] sm:text-lg">
          <CalendarDays className="size-4 sm:size-5 text-primary" />
          Recent Entries
        </CardTitle>
      </CardHeader>

      <CardContent className="px-3 sm:px-5">
        {!entries || entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center">
            <Clock className="mb-2 sm:mb-3 size-8 sm:size-10 text-muted-foreground/50" />
            <p className="text-[13px] sm:text-sm font-medium text-muted-foreground">
              No entries yet
            </p>
            <p className="mt-1 text-[11px] sm:text-xs text-muted-foreground/70">
              Your recent OJT logs will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="group flex items-start gap-2 sm:gap-3 rounded-lg border p-2.5 sm:p-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <span className="text-[13px] sm:text-sm font-medium">
                      {format(
                        new Date(entry.date_logged + "T00:00:00"),
                        "MMM d, yyyy"
                      )}
                    </span>
                    <Badge
                      variant={sessionBadgeVariant[entry.session_type as SessionType] ?? "outline"}
                      className={cn(
                        "text-[10px] sm:text-xs px-1.5 py-0 sm:px-2.5 sm:py-0.5",
                        entry.session_type === "Afternoon" && "badge-afternoon"
                      )}
                    >
                      {entry.session_type}
                    </Badge>
                  </div>
                  <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-sm text-muted-foreground">
                    {formatTime(entry.time_in)} – {formatTime(entry.time_out)}
                    <span className="ml-1 sm:ml-2 font-medium text-foreground">
                      ({formatMinutes(entry.total_minutes)})
                    </span>
                  </p>
                  {entry.task_description && (
                    <p className="mt-0.5 sm:mt-1 truncate text-[10px] sm:text-xs text-muted-foreground/80">
                      {entry.task_description}
                    </p>
                  )}
                  {entry.created_at && (
                    <p className="mt-1 text-xs text-muted-foreground/60">
                      Logged {format(new Date(entry.created_at), "MMM d 'at' h:mm a")}
                    </p>
                  )}
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
