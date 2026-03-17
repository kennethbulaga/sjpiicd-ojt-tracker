"use client"

import { useCallback } from "react"
import { Download } from "lucide-react"
import { format, parse } from "date-fns"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

interface TimeEntry {
  id: string
  date_logged: string
  time_in: string
  time_out: string
  total_minutes: number
  session_type: string
  task_description: string | null
  created_at: string
}

interface ExportActionsProps {
  entries: TimeEntry[]
}

function formatTime(timeStr: string): string {
  const date = parse(timeStr, "HH:mm:ss", new Date())
  return format(date, "h:mm a")
}

export function ExportActions({ entries }: ExportActionsProps) {
  const handleExportCSV = useCallback(() => {
    if (entries.length === 0) {
      toast.error("No entries to export.")
      return
    }

    // CSV header
    const headers = [
      "Date",
      "Day",
      "Session Type",
      "Time In",
      "Time Out",
      "Duration (hrs)",
      "Task Description",
    ]

    // CSV rows
    const rows = entries.map((entry) => {
      const dateObj = new Date(entry.date_logged + "T00:00:00")
      return [
        format(dateObj, "yyyy-MM-dd"),
        format(dateObj, "EEEE"),
        entry.session_type,
        formatTime(entry.time_in),
        formatTime(entry.time_out),
        (entry.total_minutes / 60).toFixed(2),
        entry.task_description
          ? `"${entry.task_description.replace(/"/g, '""')}"`
          : "",
      ].join(",")
    })

    // Combine and create blob
    const csv = [headers.join(","), ...rows].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })

    // Trigger download
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute(
      "download",
      `JP-Track-DTR-${format(new Date(), "yyyy-MM-dd")}.csv`
    )
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast.success("CSV exported!", {
      description: `${entries.length} entries downloaded.`,
    })
  }, [entries])

  return (
    <Button
      variant="outline"
      className="min-h-[44px]"
      onClick={handleExportCSV}
      disabled={entries.length === 0}
    >
      <Download className="mr-2 size-4" />
      Export CSV
    </Button>
  )
}
