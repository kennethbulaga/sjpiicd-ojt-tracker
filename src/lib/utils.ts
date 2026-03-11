// Note 1: ClassValue is a type from clsx that represents anything that can
// be a CSS class: strings, arrays, objects, null, undefined, false, etc.
// It enables the flexible syntax: cn("base", isActive && "active", { "hidden": !show })
import { type ClassValue, clsx } from "clsx"
// Note 2: tailwind-merge intelligently merges Tailwind classes by resolving
// conflicts. For example, twMerge("px-4 px-6") returns "px-6" (last wins).
// Without it, both classes would apply and the result would depend on CSS
// specificity order (unpredictable in Tailwind's utility-first approach).
import { twMerge } from "tailwind-merge"

// Note 3: cn() is the standard utility in every shadcn/ui project. It
// combines clsx (conditional class joining) with tailwind-merge (conflict
// resolution). Usage example:
//   cn("px-4 py-2", isLarge && "px-8 py-4", className)
// This pattern allows component consumers to override default styles
// by passing their own className prop, which will win over the defaults.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Note 4: Server-side code (Server Components, Server Actions) runs in UTC
// on Vercel. This helper returns date/time strings in Philippine timezone
// (Asia/Manila, UTC+8) so server-side time comparisons match student expectations.
export function getPhilippineNow() {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
  const parts = Object.fromEntries(
    formatter.formatToParts(new Date()).map((p) => [p.type, p.value])
  )
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}:${parts.second}`,
    hour: Number(parts.hour),
  }
}
