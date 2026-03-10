// Note 1: This component renders the Daily Time Record (DTR) as a data table.
// It receives pre-fetched entries from a Server Component parent and renders
// them using shadcn's Table component. No "use client" is needed because
// the basic rendering doesn't require browser APIs — making it a Server
// Component that renders faster without JavaScript hydration.

// Note 2: The interface defines the shape of each time entry for the table.
// In production, this will be replaced with the TimeEntry type from
// src/types/database.ts (or auto-generated Supabase types). Keeping a
// local interface during development prevents blocking on database setup.
interface DTRTableProps {
  entries: Array<{
    id: string
    date_logged: string
    time_in: string
    time_out: string
    total_minutes: number
    session_type: string
    task_description: string | null
  }>
}

export function DTRTable({ entries }: DTRTableProps) {
  return (
    <div>
      {/* Note 3: The full implementation will use shadcn's Table component
          (<Table>, <TableHeader>, <TableBody>, <TableRow>, <TableCell>)
          which provides accessible, styled table markup with proper ARIA
          attributes. Features planned:
          - Group rows by date_logged for visual organization
          - Default sort by date descending (most recent first)
          - Client-side pagination with configurable page size
          - total_minutes formatted as "Xh Ym" for readability */}
      <p className="text-muted-foreground">
        {entries.length} entries placeholder
      </p>
    </div>
  )
}
