// Note 1: "use client" marks this as a Client Component. It's needed here
// because the ProgressRing may use browser APIs for SVG animations or
// interactivity (e.g., hover tooltips). Client Components are sent as
// JavaScript bundles to the browser and hydrated for interactivity.
"use client"

// Note 2: TypeScript interfaces define the shape of component props.
// This provides compile-time type checking — if the parent passes a string
// where a number is expected, TypeScript catches it before runtime.
interface ProgressRingProps {
  hoursCompleted: number
  targetHours: number
}

// Note 3: Named exports (not default) are used for feature components.
// This makes imports more explicit: import { ProgressRing } from "..."
// Default exports are reserved for pages/layouts (Next.js convention).
export function ProgressRing({ hoursCompleted, targetHours }: ProgressRingProps) {
  // Note 4: Math.min caps the percentage at 100% to prevent visual overflow
  // when a student logs more hours than their target (which is allowed).
  const percentage = Math.min(100, (hoursCompleted / targetHours) * 100)
  // Note 5: Math.max ensures "remaining" never goes negative. When
  // hoursCompleted exceeds targetHours, this displays "0.0h remaining"
  // instead of a confusing negative number.
  const hoursRemaining = Math.max(0, targetHours - hoursCompleted)

  return (
    <div className="flex flex-col items-center">
      {/* Note 6: This placeholder will be replaced with an SVG-based ring.
          The SVG approach uses a <circle> element with stroke-dasharray
          and stroke-dashoffset to create the animated progress arc.
          "size-48" (192px) provides a large, readable visualization
          that works as the dashboard's visual centerpiece. */}
      <div className="relative flex size-48 items-center justify-center rounded-full border-8 border-muted">
        <div className="text-center">
          {/* Note 7: toFixed(1) formats the number to one decimal place.
              This prevents long floating-point numbers like "66.66666..."
              from breaking the layout. */}
          <p className="text-3xl font-bold">{percentage.toFixed(1)}%</p>
          <p className="text-sm text-muted-foreground">
            {hoursRemaining.toFixed(1)}h remaining
          </p>
        </div>
      </div>
    </div>
  )
}
