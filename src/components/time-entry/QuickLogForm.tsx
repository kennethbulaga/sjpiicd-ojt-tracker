"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon, Clock, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { createTimeEntry } from "@/actions/time-entries"
import { DailyEntries } from "@/components/time-entry/DailyEntries"
import {
  timeEntrySchema,
  sessionTypes,
  type TimeEntryInput,
} from "@/lib/validations/time-entry"
import { SMART_DEFAULTS } from "@/lib/constants"

// Silently update URL without triggering navigation
function updateDateParam(date: string) {
  const url = new URL(window.location.href)
  url.searchParams.set("date", date)
  window.history.replaceState({}, "", url.toString())
}

export function QuickLogForm() {
  const [isPending, startTransition] = useTransition()
  const searchParams = useSearchParams()
  // Refresh key: increment to force DailyEntries to remount and refetch
  const [refreshKey, setRefreshKey] = useState(0)

  // Persist date in URL: read from ?date= param, fallback to today
  const initialDate = searchParams.get("date") || format(new Date(), "yyyy-MM-dd")

  const form = useForm<TimeEntryInput>({
    resolver: zodResolver(timeEntrySchema),
    defaultValues: {
      date_logged: initialDate,
      time_in: SMART_DEFAULTS.MORNING.time_in + ":00",
      time_out: SMART_DEFAULTS.MORNING.time_out + ":00",
      session_type: "Morning",
      task_description: "",
    },
  })

  // Apply smart defaults when session type changes
  function handleSessionTypeChange(value: string) {
    form.setValue("session_type", value as TimeEntryInput["session_type"])

    if (value === "Morning") {
      form.setValue("time_in", SMART_DEFAULTS.MORNING.time_in + ":00")
      form.setValue("time_out", SMART_DEFAULTS.MORNING.time_out + ":00")
    } else if (value === "Afternoon") {
      form.setValue("time_in", SMART_DEFAULTS.AFTERNOON.time_in + ":00")
      form.setValue("time_out", SMART_DEFAULTS.AFTERNOON.time_out + ":00")
    }
    // Overtime: keep current times (user decides)
  }

  function onSubmit(data: TimeEntryInput) {
    startTransition(async () => {
      const formData = new FormData()
      formData.set("date_logged", data.date_logged)
      formData.set("time_in", data.time_in)
      formData.set("time_out", data.time_out)
      formData.set("session_type", data.session_type)
      if (data.task_description) {
        formData.set("task_description", data.task_description)
      }

      const result = await createTimeEntry(formData)

      if (result && "error" in result) {
        if (typeof result.error === "string") {
          toast.error("Failed to log entry", { description: result.error })
        } else {
          // Field-level errors from Zod
          const errors = result.error as Record<string, string[] | undefined>
          Object.entries(errors).forEach(([field, messages]) => {
            if (messages?.[0]) {
              form.setError(field as keyof TimeEntryInput, {
                type: "server",
                message: messages[0],
              })
            }
          })
          toast.error("Please fix the errors in the form.")
        }
        return
      }

      toast.success("Hours logged!", {
        description: `${data.session_type} session on ${format(new Date(data.date_logged + "T00:00:00"), "MMM d, yyyy")}`,
      })

      // Force DailyEntries to remount and refetch (ensures entry appears immediately)
      setRefreshKey((k) => k + 1)

      // Reset form but keep the date and session type for quick re-entry
      form.reset({
        date_logged: data.date_logged,
        time_in: data.time_in,
        time_out: data.time_out,
        session_type: data.session_type,
        task_description: "",
      })
    })
  }

  return (
    <Card className="rounded-xl shadow-sm py-3 px-0 sm:py-5">
      <CardHeader className="space-y-0 pb-3 sm:pb-4 px-3 sm:px-5">
        <CardTitle className="flex items-center gap-1.5 sm:gap-2 text-[15px] sm:text-lg">
          <Clock className="size-4 sm:size-5 text-primary" />
          Quick Log
        </CardTitle>
      </CardHeader>

      <CardContent className="px-3 sm:px-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
            {/* Date Picker */}
            <FormField
              control={form.control}
              name="date_logged"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full min-h-[44px] justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 size-4" />
                          {field.value
                            ? format(
                                new Date(field.value + "T00:00:00"),
                                "EEEE, MMMM d, yyyy"
                              )
                            : "Pick a date"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value
                            ? new Date(field.value + "T00:00:00")
                            : undefined
                        }
                        onSelect={(date) => {
                          if (date) {
                            const dateStr = format(date, "yyyy-MM-dd")
                            field.onChange(dateStr)
                            updateDateParam(dateStr)
                          }
                        }}
                        disabled={(date) => date > new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            {/* Session Type */}
            <FormField
              control={form.control}
              name="session_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Session Type</FormLabel>
                  <Select
                    onValueChange={handleSessionTypeChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="min-h-[44px]">
                        <SelectValue placeholder="Select session" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sessionTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Selecting Morning or Afternoon auto-fills the times.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Time In / Time Out — side by side */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="time_in"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time In</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        step="60"
                        className="min-h-[44px]"
                        value={field.value.slice(0, 5)}
                        onChange={(e) =>
                          field.onChange(e.target.value + ":00")
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time_out"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Out</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        step="60"
                        className="min-h-[44px]"
                        value={field.value.slice(0, 5)}
                        onChange={(e) =>
                          field.onChange(e.target.value + ":00")
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Task Description (optional) */}
            <FormField
              control={form.control}
              name="task_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    What did you work on?{" "}
                    <span className="font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Encoded student records, organized files..."
                      className="min-h-[80px] resize-none"
                      maxLength={500}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-right">
                    {field.value?.length ?? 0}/500
                  </FormDescription>
                </FormItem>
              )}
            />

            {/* Submit */}
            <Button
              type="submit"
              className="w-full min-h-[44px] text-base font-semibold"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Logging...
                </>
              ) : (
                "Log Hours"
              )}
            </Button>
          </form>
        </Form>
        <DailyEntries key={refreshKey} dateLogged={form.watch("date_logged")} />
      </CardContent>
    </Card>
  )
}
