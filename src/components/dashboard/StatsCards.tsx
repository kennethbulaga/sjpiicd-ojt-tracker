import { Clock, CalendarCheck, Target, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatsCardsProps {
  hoursCompleted: number
  targetHours: number
  totalEntries: number
  todayMinutes: number
}

export function StatsCards({
  hoursCompleted,
  targetHours,
  totalEntries,
  todayMinutes,
}: StatsCardsProps) {
  const hoursRemaining = Math.max(0, targetHours - hoursCompleted)
  const todayHours = todayMinutes / 60

  const stats = [
    {
      label: "Hours Completed",
      value: Math.floor(hoursCompleted).toString(),
      icon: Clock,
      description: "Total logged hours",
    },
    {
      label: "Hours Remaining",
      value: Math.ceil(hoursRemaining).toString(),
      icon: Target,
      description: `of ${targetHours}h target`,
    },
    {
      label: "Total Entries",
      value: totalEntries.toString(),
      icon: CalendarCheck,
      description: "Time logs recorded",
    },
    {
      label: "Today",
      value: todayHours > 0 ? `${Math.round(todayHours)}h` : "—",
      icon: TrendingUp,
      description: todayHours > 0 ? "Hours logged today" : "No entries today",
    },
  ] as const

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat) => (
        <Card key={stat.label} className="rounded-xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground sm:text-sm">
              {stat.label}
            </CardTitle>
            <stat.icon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold sm:text-2xl">{stat.value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
