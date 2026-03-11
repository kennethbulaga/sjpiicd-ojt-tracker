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
    <Card className="rounded-xl shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CalendarDays className="size-5 text-primary" />
          Recent Entries
        </CardTitle>
      </CardHeader>

      <CardContent>
        {!entries || entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Clock className="mb-3 size-10 text-muted-foreground/50" />
            <p className="text-sm font-medium text-muted-foreground">
              No entries yet
            </p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              Your recent OJT logs will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="group flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium">
                      {format(
                        new Date(entry.date_logged + "T00:00:00"),
                        "MMM d, yyyy"
                      )}
                    </span>
                    <Badge
                      variant={sessionBadgeVariant[entry.session_type as SessionType] ?? "outline"}
                      className={cn(
                        entry.session_type === "Afternoon" && "badge-afternoon"
                      )}
                    >
                      {entry.session_type}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatTime(entry.time_in)} – {formatTime(entry.time_out)}
                    <span className="ml-2 font-medium text-foreground">
                      ({formatMinutes(entry.total_minutes)})
                    </span>
                  </p>
                  {entry.task_description && (
                    <p className="mt-1 truncate text-xs text-muted-foreground/80">
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
