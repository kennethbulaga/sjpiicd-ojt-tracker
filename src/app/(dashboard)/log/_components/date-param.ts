import { format } from "date-fns"

export function resolveDateParam(rawDate?: string): string {
  if (!rawDate) {
    return format(new Date(), "yyyy-MM-dd")
  }

  const parsed = new Date(`${rawDate}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) {
    return format(new Date(), "yyyy-MM-dd")
  }

  return rawDate
}
