// Note 1: Importing from "@/components/ui/card" uses the path alias "@/"
// which maps to "src/" (configured in tsconfig.json). This is cleaner than
// relative paths like "../../../components/ui/card" and makes imports
// consistent regardless of file depth in the folder structure.
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Note 2: The interface defines exactly what data this component needs.
// By accepting pre-calculated values as props (instead of raw time entries),
// this component stays "dumb" — it only renders, doesn't compute.
// The parent (Server Component) or a hook handles the calculations.
interface StatsCardsProps {
  hoursCompleted: number
  targetHours: number
  totalEntries: number
}

// Note 3: Destructuring props in the function signature is a TypeScript/React
// best practice. It makes it immediately clear what data the component uses,
// and each prop can be used directly without "props.hoursCompleted" syntax.
export function StatsCards({
  hoursCompleted,
  targetHours,
  totalEntries,
}: StatsCardsProps) {
  const hoursRemaining = Math.max(0, targetHours - hoursCompleted)

  return (
    // Note 4: This responsive grid is a mobile-first pattern:
    // - Mobile (default): 1 column — cards stack vertically
    // - Tablet (sm: 640px+): 2 columns — side by side
    // - Desktop (lg: 1024px+): 3 columns — all cards visible at once
    // "gap-4" (16px) provides consistent spacing between cards.
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Note 5: The shadcn Card component is a pre-styled container with
          proper border, background, and shadow tokens. It automatically
          adapts to light/dark themes via the semantic color variables
          defined in globals.css (--color-card, --color-card-foreground). */}
      <Card>
        <CardHeader className="pb-2">
          {/* Note 6: "text-sm font-medium text-muted-foreground" creates a
              subtle label above the main value. "muted-foreground" is a
              semantic token for secondary text — it's readable but doesn't
              compete with the primary value for visual attention. */}
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Hours Completed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{hoursCompleted.toFixed(1)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Hours Remaining
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{hoursRemaining.toFixed(1)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Entries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{totalEntries}</p>
        </CardContent>
      </Card>
    </div>
  )
}
