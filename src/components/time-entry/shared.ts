import { format, parse } from "date-fns"

export function formatMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours === 0) return `${minutes}m`
  if (minutes === 0) return `${hours}h`
  return `${hours}h ${minutes}m`
}

export function formatTime(timeStr: string): string {
  // timeStr is "HH:mm:ss" — parse and format to "h:mm a"
  const date = parse(timeStr, "HH:mm:ss", new Date())
  return format(date, "h:mm a")
}

export type SessionType = "Morning" | "Afternoon" | "Overtime"

export const sessionBadgeVariant: Record<SessionType, "default" | "secondary" | "outline"> = {
  Morning: "default",
  Afternoon: "secondary", // Uniquely overridden by .badge-afternoon dynamically
  Overtime: "outline",
}
