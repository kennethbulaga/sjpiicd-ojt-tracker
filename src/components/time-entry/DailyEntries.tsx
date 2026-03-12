"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { ListTodo, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { DeleteEntryButton } from "@/components/time-entry/DeleteEntryButton"
import { formatMinutes, formatTime, type SessionType, sessionBadgeVariant } from "./shared"

interface TimeEntry {
  id: string
  date_logged: string
  time_in: string
  time_out: string
  session_type: string
  total_minutes: number
  task_description: string | null
  created_at: string
}

export function DailyEntries({ dateLogged }: { dateLogged: string }) {
  const [entries, setEntries] = useState<TimeEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    let isMounted = true

    async function fetchEntries() {
      try {
        setIsLoading(true)
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !user) {
          if (isMounted) setIsLoading(false)
          return
        }

        const { data, error: fetchError } = await supabase
          .from("time_entries")
          .select("id, date_logged, time_in, time_out, session_type, total_minutes, task_description, created_at")
          .eq("user_id", user.id)
          .eq("date_logged", dateLogged)
          .order("time_in", { ascending: false })

        if (fetchError) {
          console.error("Failed to fetch daily entries:", fetchError)
        }

        if (isMounted) {
          setEntries(data || [])
          setIsLoading(false)
        }
      } catch (err) {
        console.error("Unexpected error fetching daily entries:", err)
        if (isMounted) setIsLoading(false)
      }
    }

    fetchEntries()

    // Subscribe to real-time changes for time_entries
    const channel = supabase
      .channel("daily_entries_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "time_entries",
          filter: `date_logged=eq.${dateLogged}`,
        },
        () => {
          // Re-fetch to ensure we have the correct user/data and ordering
          fetchEntries()
        }
      )
      .subscribe()

    return () => {
      isMounted = false
      supabase.removeChannel(channel)
    }
  }, [dateLogged, supabase])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4 text-muted-foreground">
        <Loader2 className="size-4 animate-spin mr-2" />
        <span className="text-sm">Loading logs for this day...</span>
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center border-t mt-6 border-dashed">
        <ListTodo className="mb-2 size-8 text-muted-foreground/40" />
        <p className="text-sm font-medium text-muted-foreground">
          No logs for{" "}
          {format(new Date(dateLogged + "T00:00:00"), "MMM d")}
        </p>
      </div>
    )
  }

  return (
    <div className="mt-6 border-t pt-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium">
          Logged on {format(new Date(dateLogged + "T00:00:00"), "MMM d, yyyy")}
        </span>
        <span className="text-sm font-medium text-foreground">
          {formatMinutes(entries.reduce((acc, curr) => acc + curr.total_minutes, 0))} Total
        </span>
      </div>
      <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 rounded-md">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="group flex items-start gap-3 rounded-md border p-2.5 transition-colors hover:bg-muted/50 bg-background/50"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant={sessionBadgeVariant[entry.session_type as SessionType] ?? "outline"}
                  className={cn(
                    "text-[10px] px-1.5 py-0",
                    entry.session_type === "Afternoon" && "badge-afternoon"
                  )}
                >
                  {entry.session_type}
                </Badge>
                <span className="text-xs font-medium text-foreground">
                  {formatTime(entry.time_in)} – {formatTime(entry.time_out)}
                </span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {formatMinutes(entry.total_minutes)}
                </span>
              </div>
              {entry.task_description && (
                <p className="mt-1.5 truncate text-xs text-muted-foreground/80 pl-0.5 border-l-2 border-muted">
                  {entry.task_description}
                </p>
              )}
            </div>

            <DeleteEntryButton 
              entryId={entry.id} 
              onDelete={() => {
                setEntries(prev => prev.filter(e => e.id !== entry.id))
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
