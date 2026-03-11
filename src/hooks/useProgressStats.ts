// Note 1: "use client" is required because this hook will be used inside
// Client Components (ProgressRing, StatsCards) that render in the browser.
"use client"

// Note 2: This hook encapsulates the progress calculation logic, following
// the "Logic = Hooks" principle. By extracting this math into a hook,
// multiple components can share the same calculations without duplicating
// code. If the formula changes (e.g., adding overtime weighting), you
// update it in one place.
export function useProgressStats(targetHours: number, totalMinutes: number) {
  // Note 3: Converting minutes to hours for display. Supabase stores
  // total_minutes (integer) because it avoids floating-point precision
  // issues that occur with fractional hours (e.g., 2.33333... hours).
  const hoursCompleted = totalMinutes / 60
  // Note 4: Math.max(0, ...) prevents negative remaining hours when a
  // student exceeds their target. Without this guard, the UI would show
  // confusing values like "-12.5 hours remaining".
  const hoursRemaining = Math.max(0, targetHours - hoursCompleted)
  // Note 5: Math.min(100, ...) caps the percentage at 100% for the
  // ProgressRing visualization. Students can exceed their target, but
  // the ring shouldn't overflow past full circle.
  const percentComplete = Math.min(100, (hoursCompleted / targetHours) * 100)

  // Note 6: Rounding to whole numbers for clean display. Math.floor for
  // completed hours (conservative — don't overstate progress), Math.ceil
  // for remaining (don't underestimate work left), Math.round for percentage.
  return {
    hoursCompleted: Math.floor(hoursCompleted),
    hoursRemaining: Math.ceil(hoursRemaining),
    percentComplete: Math.round(percentComplete),
  }
}
