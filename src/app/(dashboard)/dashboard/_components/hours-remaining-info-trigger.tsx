"use client"

import { HelpCircle } from "lucide-react"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface HoursRemainingInfoTriggerProps {
  hoursRemaining: number
}

export function HoursRemainingInfoTrigger({
  hoursRemaining,
}: HoursRemainingInfoTriggerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="inline-flex shrink-0 items-center justify-center rounded-full text-muted-foreground/60 transition-colors hover:text-muted-foreground"
          aria-label="How is this calculated?"
        >
          <HelpCircle className="size-3 lg:size-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 text-xs leading-relaxed" side="top" align="start">
        <p className="mb-1 font-semibold">How is this calculated?</p>
        <p className="text-muted-foreground">
          Based on a constant <strong>8h</strong> maximum per day. This divides your
          remaining {Math.ceil(hoursRemaining)}h by 8 hours.
        </p>
      </PopoverContent>
    </Popover>
  )
}
