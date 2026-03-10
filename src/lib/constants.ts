// Note 1: Constants are centralized here instead of being scattered across
// components. This makes them easy to find, update, and reuse. Using "as const"
// on objects makes TypeScript treat all values as literal types (not just
// "string" or "number"), enabling better type inference and preventing
// accidental mutation.

// Note 2: CHED (Commission on Higher Education) mandates specific OJT hours
// per program. 486 hours is the standard for most programs at SJPIICD.
// This Record<string, number> type maps program codes to their required hours.
export const PROGRAM_TARGET_HOURS: Record<string, number> = {
  BSIT: 486,
  BSCS: 486,
  BSBA: 486,
  BSA: 486,
  BSCRIM: 486,
  BSED: 486,
  BEED: 486,
} as const

// Note 3: The default is used when a student's program isn't in the lookup
// table. This prevents errors for programs added in the future.
export const DEFAULT_TARGET_HOURS = 486

// Note 4: Time constraints enforce OJT policy rules at the application level.
// These values are referenced by both the Zod validation schema (compile-time)
// and the QuickLogForm UI (display-time), ensuring consistency.
export const TIME_CONSTRAINTS = {
  // Note 5: MIN_TIME and MAX_TIME define the allowed window for OJT activities.
  // 7:00 AM to 9:00 PM covers standard business hours plus overtime.
  MIN_TIME: "07:00",
  MAX_TIME: "21:00",
  // Note 6: MAX_HOURS_PER_DAY prevents data entry errors. A student can't
  // reasonably log more than 12 hours in a single day, so this catches typos
  // (e.g., accidentally entering "08:00 AM to 08:00 AM" which would be 24 hours).
  MAX_HOURS_PER_DAY: 12,
} as const

// Note 7: Smart defaults pre-fill the time pickers to reduce manual input.
// The morning session (8AM-12PM) and afternoon session (1PM-5PM) are the
// standard SJPIICD OJT schedule. When a student selects "Morning" as their
// session type, the form auto-fills these times — saving about 4 taps.
export const SMART_DEFAULTS = {
  MORNING: { time_in: "08:00", time_out: "12:00" },
  AFTERNOON: { time_in: "13:00", time_out: "17:00" },
} as const
