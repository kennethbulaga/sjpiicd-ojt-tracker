"use client"

import { useState, useMemo } from "react"
import { format, parse } from "date-fns"
import { ChevronDown, ChevronUp, Clock, Search } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DeleteEntryButton } from "@/components/time-entry/DeleteEntryButton"

type SessionType = "Morning" | "Afternoon" | "Overtime"

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

interface DTRTableProps {
  entries: TimeEntry[]
}

const SESSION_BADGE_VARIANT: Record<
  SessionType,
  "default" | "secondary" | "outline"
> = {
  Morning: "default",
  Afternoon: "secondary",
  Overtime: "outline",
}

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50] as const

function formatTime(timeStr: string): string {
  const date = parse(timeStr, "HH:mm:ss", new Date())
  return format(date, "h:mm a")
}

function formatMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours === 0) return `${minutes}m`
  if (minutes === 0) return `${hours}h`
  return `${hours}h ${minutes}m`
}

export function DTRTable({ entries }: DTRTableProps) {
  const [sessionFilter, setSessionFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(10)
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set())

  // Filter entries
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesSession =
        sessionFilter === "all" || entry.session_type === sessionFilter
      const matchesSearch =
        searchQuery === "" ||
        entry.task_description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        entry.date_logged.includes(searchQuery)
      return matchesSession && matchesSearch
    })
  }, [entries, sessionFilter, searchQuery])

  // Group entries by date
  const groupedEntries = useMemo(() => {
    const groups = new Map<string, TimeEntry[]>()
    for (const entry of filteredEntries) {
      const group = groups.get(entry.date_logged) ?? []
      group.push(entry)
      groups.set(entry.date_logged, group)
    }
    return groups
  }, [filteredEntries])

  // Paginate grouped dates
  const allDates = useMemo(
    () => Array.from(groupedEntries.keys()),
    [groupedEntries]
  )
  const totalPages = Math.max(1, Math.ceil(allDates.length / itemsPerPage))
  const paginatedDates = allDates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Reset to page 1 when filters change
  const handleFilterChange = (value: string) => {
    setSessionFilter(value)
    setCurrentPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const toggleDateExpanded = (date: string) => {
    setExpandedDates((prev) => {
      const next = new Set(prev)
      if (next.has(date)) {
        next.delete(date)
      } else {
        next.add(date)
      }
      return next
    })
  }

  if (entries.length === 0) {
    return (
      <Card className="rounded-xl shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Clock className="mb-4 size-12 text-muted-foreground/40" />
          <h3 className="text-lg font-semibold">No entries yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Start logging your OJT hours and they&apos;ll appear here.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by task or date..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="min-h-[44px] pl-9"
          />
        </div>
        <Select value={sessionFilter} onValueChange={handleFilterChange}>
          <SelectTrigger className="min-h-[44px] w-full sm:w-[160px]">
            <SelectValue placeholder="Session type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sessions</SelectItem>
            <SelectItem value="Morning">Morning</SelectItem>
            <SelectItem value="Afternoon">Afternoon</SelectItem>
            <SelectItem value="Overtime">Overtime</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      {(sessionFilter !== "all" || searchQuery) && (
        <p className="text-sm text-muted-foreground">
          Showing {filteredEntries.length} of {entries.length} entries
        </p>
      )}

      {filteredEntries.length === 0 ? (
        <Card className="rounded-xl shadow-sm">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No entries match your filters.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop table view */}
          <div className="hidden md:block">
            <Card className="rounded-xl shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[140px]">Date</TableHead>
                    <TableHead>Session</TableHead>
                    <TableHead>Time In</TableHead>
                    <TableHead>Time Out</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead className="max-w-[200px]">Task</TableHead>
                    <TableHead className="w-[60px] text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedDates.map((date) => {
                    const dateEntries = groupedEntries.get(date)!
                    const dailyMinutes = dateEntries.reduce(
                      (sum, e) => sum + e.total_minutes,
                      0
                    )

                    return dateEntries.map((entry, idx) => (
                      <TableRow key={entry.id} className="group">
                        {/* Show date only on first row of each group */}
                        <TableCell className="font-medium">
                          {idx === 0 ? (
                            <div>
                              <p>
                                {format(
                                  new Date(entry.date_logged + "T00:00:00"),
                                  "MMM d, yyyy"
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatMinutes(dailyMinutes)} total
                              </p>
                            </div>
                          ) : null}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              SESSION_BADGE_VARIANT[
                                entry.session_type as SessionType
                              ] ?? "outline"
                            }
                          >
                            {entry.session_type}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatTime(entry.time_in)}</TableCell>
                        <TableCell>{formatTime(entry.time_out)}</TableCell>
                        <TableCell className="font-medium">
                          {formatMinutes(entry.total_minutes)}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate text-muted-foreground">
                          {entry.task_description || "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <DeleteEntryButton entryId={entry.id} />
                        </TableCell>
                      </TableRow>
                    ))
                  })}
                </TableBody>
              </Table>
            </Card>
          </div>

          {/* Mobile card view */}
          <div className="space-y-3 md:hidden">
            {paginatedDates.map((date) => {
              const dateEntries = groupedEntries.get(date)!
              const dailyMinutes = dateEntries.reduce(
                (sum, e) => sum + e.total_minutes,
                0
              )
              const isExpanded =
                expandedDates.has(date) || dateEntries.length === 1

              return (
                <Card key={date} className="rounded-xl shadow-sm">
                  {/* Date header (clickable to expand/collapse if multiple entries) */}
                  <button
                    type="button"
                    className="flex w-full items-center justify-between p-4"
                    onClick={() => toggleDateExpanded(date)}
                    disabled={dateEntries.length === 1}
                  >
                    <div className="text-left">
                      <p className="font-semibold">
                        {format(
                          new Date(date + "T00:00:00"),
                          "EEEE, MMM d, yyyy"
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {dateEntries.length} session
                        {dateEntries.length > 1 ? "s" : ""} ·{" "}
                        {formatMinutes(dailyMinutes)}
                      </p>
                    </div>
                    {dateEntries.length > 1 &&
                      (isExpanded ? (
                        <ChevronUp className="size-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="size-4 text-muted-foreground" />
                      ))}
                  </button>

                  {/* Entries */}
                  {isExpanded && (
                    <CardContent className="space-y-3 pt-0">
                      {dateEntries.map((entry) => (
                        <div
                          key={entry.id}
                          className="group flex items-start justify-between rounded-lg border p-3"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  SESSION_BADGE_VARIANT[
                                    entry.session_type as SessionType
                                  ] ?? "outline"
                                }
                              >
                                {entry.session_type}
                              </Badge>
                              <span className="text-sm font-medium">
                                {formatMinutes(entry.total_minutes)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {formatTime(entry.time_in)} –{" "}
                              {formatTime(entry.time_out)}
                            </p>
                            {entry.task_description && (
                              <p className="text-xs text-muted-foreground/80 line-clamp-2">
                                {entry.task_description}
                              </p>
                            )}
                          </div>
                          <DeleteEntryButton entryId={entry.id} />
                        </div>
                      ))}
                    </CardContent>
                  )}
                </Card>
              )
            })}
          </div>

          {/* Pagination */}
          {allDates.length > itemsPerPage && (
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Show</span>
                <Select
                  value={String(itemsPerPage)}
                  onValueChange={(val) => {
                    setItemsPerPage(Number(val))
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="h-9 w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ITEMS_PER_PAGE_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={String(opt)}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">per page</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.max(1, p - 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
