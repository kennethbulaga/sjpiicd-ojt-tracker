"use client"

import { useEffect, useMemo, useState } from "react"
import { format } from "date-fns"
import { ListTodo, Loader2 } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { DeleteEntryButton } from "@/components/time-entry/DeleteEntryButton"

import { SessionBadge } from "./session-badge"
import { formatMinutes, formatTime, type TimeEntryListItem } from "./shared"

interface DailyEntriesProps {
  dateLogged: string
  userId: string | null
  initialEntries: TimeEntryListItem[]
  refreshToken: number
}

export function DailyEntries({
  dateLogged,
  userId,
  initialEntries,
  refreshToken,
}: DailyEntriesProps) {
  const [entries, setEntries] = useState<TimeEntryListItem[]>(initialEntries)
  const [isLoading, setIsLoading] = useState(initialEntries.length === 0)
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    let isMounted = true

    async function fetchEntries() {
      if (!userId) {
        if (isMounted) {
          setEntries([])
          setIsLoading(false)
        }
        return
      }

      try {
        setIsLoading(true)

        const { data, error: fetchError } = await supabase
          .from("time_entries")
          .select("id, date_logged, time_in, time_out, session_type, total_minutes, task_description, created_at")
          .eq("user_id", userId)
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

    const channel = supabase
      .channel(`daily_entries_changes:${userId ?? "anonymous"}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "time_entries",
          filter: userId ? `user_id=eq.${userId}` : undefined,
        },
        (payload) => {
          const payloadDate =
            (payload.new as { date_logged?: string } | null)?.date_logged ??
            (payload.old as { date_logged?: string } | null)?.date_logged

          if (payloadDate !== dateLogged) {
            return
          }

          fetchEntries()
        }
      )
      .subscribe()

    return () => {
      isMounted = false
      supabase.removeChannel(channel)
    }
  }, [dateLogged, refreshToken, supabase, userId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4 text-muted-foreground">
        <Loader2 className="mr-2 size-4 animate-spin" />
        <span className="text-sm">Loading logs for this day...</span>
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="mt-6 flex flex-col items-center justify-center border-t border-dashed py-6 text-center">
        <ListTodo className="mb-2 size-8 text-muted-foreground/40" />
        <p className="text-sm font-medium text-muted-foreground">
          No logs for {format(new Date(dateLogged + "T00:00:00"), "MMM d")}
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
      <div className="max-h-[250px] space-y-2 overflow-y-auto rounded-md pr-2">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="group flex items-start gap-3 rounded-md border bg-background/50 p-2.5 transition-colors hover:bg-muted/50"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <SessionBadge session={entry.session_type} size="compact" />
                <span className="text-xs font-medium text-foreground">
                  {formatTime(entry.time_in)} – {formatTime(entry.time_out)}
                </span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {formatMinutes(entry.total_minutes)}
                </span>
              </div>
              {entry.task_description ? (
                <p className="mt-1.5 truncate border-l-2 border-muted pl-0.5 text-xs text-muted-foreground/80">
                  {entry.task_description}
                </p>
              ) : null}
            </div>

            <DeleteEntryButton
              entryId={entry.id}
              onDelete={() => {
                setEntries((prev) => prev.filter((current) => current.id !== entry.id))
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
