"use client"

import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays } from "lucide-react"
import { useMemo, useState } from "react"

interface ActivityCalendarProps {
  loggedDates: string[]
}

export function ActivityCalendar({ loggedDates }: ActivityCalendarProps) {
  const [month, setMonth] = useState<Date>(new Date())

  // Convert YYYY-MM-DD strings to Date objects for react-day-picker modifiers
  const loggedDateObjects = useMemo(
    () => loggedDates.map((d) => new Date(d + "T00:00:00")),
    [loggedDates]
  )

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Activity Calendar
        </CardTitle>
        <CalendarDays className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex justify-center">
        <Calendar
          mode="multiple"
          selected={loggedDateObjects}
          month={month}
          onMonthChange={setMonth}
          modifiersClassNames={{
            selected:
              "bg-primary/20 text-primary font-semibold [&_button]:bg-primary/20 [&_button]:text-primary [&_button]:font-semibold [&_button]:hover:bg-primary/30",
            today: "rounded-md bg-accent text-accent-foreground",
          }}
          disabled={false}
        />
      </CardContent>
    </Card>
  )
}
