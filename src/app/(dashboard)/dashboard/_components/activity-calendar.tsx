"use client"

import { useState } from "react"
import { CalendarDays } from "lucide-react"

import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ActivityCalendarProps {
  loggedDates: Date[]
}

export function ActivityCalendar({ loggedDates }: ActivityCalendarProps) {
  const [month, setMonth] = useState<Date>(new Date())

  return (
    <Card className="rounded-xl px-0 py-3 shadow-sm sm:py-5">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-3 pb-1 sm:px-5 sm:pb-2">
        <CardTitle className="text-[11px] font-medium text-muted-foreground sm:text-sm">
          Activity Calendar
        </CardTitle>
        <CalendarDays className="size-3.5 shrink-0 text-muted-foreground sm:size-4" />
      </CardHeader>
      <CardContent className="flex justify-center px-3 sm:px-5">
        <Calendar
          mode="multiple"
          selected={loggedDates}
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
