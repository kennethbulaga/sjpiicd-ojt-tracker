// Note 1: This Server Component page renders the DTR (Daily Time Record) history
// at the "/history" route. It displays all logged OJT time entries in a table
// format with sorting, filtering, and export capabilities.

// Note 2: Because this is a Server Component, the time_entries query runs on
// the server. The fetched data is serialized and sent to the client as HTML.
// This means the database credentials never leave the server, and the initial
// page load includes all the data — no loading spinner for the first render.
export default function HistoryPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl font-bold">DTR History</h1>
      {/* Note 3: Two components will be placed here:
          - DTRTable: Renders time entries using shadcn's Table component,
            grouped by date_logged, with pagination and descending sort.
          - ExportActions: Client Component with CSV export (via Blob API)
            and future PDF export support. */}
    </div>
  )
}
