"use client"

import { Clock, CalendarCheck, Target, TrendingUp, HelpCircle, CalendarClock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { addBusinessDays, format } from "date-fns"

interface StatsCardsProps {
  hoursCompleted: number
  targetHours: number
  todayMinutes: number
  uniqueDaysLogged: number
}

export function StatsCards({
  hoursCompleted,
  targetHours,
  todayMinutes,
  uniqueDaysLogged,
}: StatsCardsProps) {
  const hoursRemaining = Math.max(0, targetHours - hoursCompleted)
  const todayHours = todayMinutes / 60

  // Calculate estimated working days remaining based on student's actual pace
  const avgHoursPerDay = uniqueDaysLogged > 0 ? hoursCompleted / uniqueDaysLogged : 8
  const daysRemaining = hoursRemaining > 0 ? Math.ceil(hoursRemaining / avgHoursPerDay) : 0

  // Estimated finish date — excludes weekends (Sat/Sun)
  const estimatedFinishDate = daysRemaining > 0
    ? format(addBusinessDays(new Date(), daysRemaining), "MMM d, yyyy")
    : null

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
      description: daysRemaining > 0 ? `~${daysRemaining} days left at your pace` : `of ${targetHours}h target`,
      hasInfo: daysRemaining > 0,
    },
    {
      label: "Est. Finish Date",
      value: estimatedFinishDate ?? "—",
      icon: CalendarClock,
      description: estimatedFinishDate ? "Based on your current pace" : "Start logging to see estimate",
    },
    {
      label: "Today",
      value: todayHours > 0 ? `${Math.round(todayHours)}h` : "—",
      icon: TrendingUp,
      description: todayHours > 0 ? "Hours logged today" : "No entries today",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat) => (
        <Card key={stat.label} className="rounded-xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground sm:text-sm flex items-center gap-1">
              {stat.label}
              {"hasInfo" in stat && stat.hasInfo && (
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      className="inline-flex items-center justify-center rounded-full text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                      aria-label="How is this calculated?"
                    >
                      <HelpCircle className="size-3.5" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-64 text-xs leading-relaxed"
                    side="top"
                    align="start"
                  >
                    <p className="font-semibold mb-1">How is this calculated?</p>
                    <p className="text-muted-foreground">
                      Based on your average of <strong>{avgHoursPerDay.toFixed(1)}h</strong> per
                      logging day across <strong>{uniqueDaysLogged}</strong> days. This divides
                      your remaining {Math.ceil(hoursRemaining)}h by your daily average.
                    </p>
                  </PopoverContent>
                </Popover>
              )}
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
