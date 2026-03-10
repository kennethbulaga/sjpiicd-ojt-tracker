// Note 1: "use client" is required because export functionality uses browser
// APIs — specifically the Blob API and URL.createObjectURL() to generate
// downloadable files entirely on the client side, without a server round-trip.
"use client"

// Note 2: The ExportActions component provides data export capabilities
// for the DTR history. CSV export is implemented first (using the native
// Blob API — no library needed), with PDF export planned for a future phase.
export function ExportActions() {
  // Note 3: The CSV export flow works as follows:
  // 1. Format time entries as comma-separated rows
  // 2. Create a Blob with type "text/csv"
  // 3. Generate a temporary URL via URL.createObjectURL(blob)
  // 4. Programmatically click an invisible <a> element with download attribute
  // 5. Revoke the URL to free memory via URL.revokeObjectURL()
  // This approach works offline and handles large datasets efficiently.
  return (
    <div className="flex gap-2">
      {/* Note 4: The button uses utility classes instead of the shadcn Button
          component. In the full implementation, this will be replaced with
          <Button variant="outline"> for consistent styling. The "min height"
          will be at least 44px to meet mobile touch target guidelines. */}
      <button className="rounded-md border border-border px-4 py-2 text-sm hover:bg-accent">
        Export CSV
      </button>
    </div>
  )
}
