import { format, parse } from "date-fns"

export function formatMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours === 0) return `${minutes}m`
  if (minutes === 0) return `${hours}h`
  return `${hours}h ${minutes}m`
}

export function formatTime(timeStr: string): string {
  const date = parse(timeStr, "HH:mm:ss", new Date())
  return format(date, "h:mm a")
}

export type SessionType = "Morning" | "Afternoon" | "Overtime"

export interface TimeEntryListItem {
  id: string
  date_logged: string
  time_in: string
  time_out: string
  session_type: SessionType
  total_minutes: number
  task_description: string | null
  created_at: string
}
