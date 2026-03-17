import { addBusinessDays, format } from "date-fns"
import { CalendarClock, Clock, Target, TrendingUp } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { HoursRemainingInfoTrigger } from "./hours-remaining-info-trigger"

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

  const constantHoursPerDay = 8
  const daysRemaining =
    hoursRemaining > 0 ? Math.ceil(hoursRemaining / constantHoursPerDay) : 0

  const estimatedFinishDate =
    daysRemaining > 0
      ? format(addBusinessDays(new Date(), daysRemaining), "MMM d, yyyy")
      : null

  const stats = [
    {
      label: "Hours Completed",
      value: Math.floor(hoursCompleted).toString(),
      icon: Clock,
      description: "Total logged hours",
      showInfo: false,
    },
    {
      label: "Hours Remaining",
      value: Math.ceil(hoursRemaining).toString(),
      icon: Target,
      description:
        daysRemaining > 0
          ? `~${daysRemaining} days left at 8h/day`
          : `of ${targetHours}h target`,
      showInfo: daysRemaining > 0,
    },
    {
      label: "Est. Finish Date",
      value: estimatedFinishDate ?? "—",
      icon: CalendarClock,
      description: estimatedFinishDate
        ? "Based on an 8h/day pace"
        : "Start logging to see estimate",
      showInfo: false,
    },
    {
      label: "Today",
      value: todayHours > 0 ? `${Math.round(todayHours)}h` : "—",
      icon: TrendingUp,
      description: todayHours > 0 ? "Hours logged today" : "No entries today",
      showInfo: false,
    },
  ] as const

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="flex flex-col gap-2 rounded-xl px-0 py-3 shadow-sm sm:gap-4 sm:py-5"
        >
          <CardHeader className="flex flex-row items-start justify-between space-y-0 px-3 pb-1 sm:px-5 sm:pb-2">
            <CardTitle className="flex items-start gap-1 text-[11px] font-medium text-muted-foreground sm:text-sm">
              <span className="leading-tight">{stat.label}</span>
              {stat.showInfo ? (
                <HoursRemainingInfoTrigger hoursRemaining={hoursRemaining} />
              ) : null}
            </CardTitle>
            <stat.icon className="size-3.5 shrink-0 text-muted-foreground sm:size-4" />
          </CardHeader>
          <CardContent className="mt-auto px-3 sm:px-5">
            <p className="text-lg font-bold sm:text-2xl">{stat.value}</p>
            <p className="mt-0.5 text-[10px] leading-tight text-muted-foreground sm:text-xs">
              {stat.description}
            </p>
            {stat.label === "Hours Completed" ? (
              <p className="mt-0.5 text-[10px] leading-tight text-muted-foreground/80 sm:text-xs">
                {uniqueDaysLogged} logged day{uniqueDaysLogged === 1 ? "" : "s"}
              </p>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
