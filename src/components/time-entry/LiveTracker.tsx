// Note 1: "use client" is required because the LiveTracker uses browser APIs
// (setInterval for the timer, Date.now() for timestamps) and manages
// interactive state (running/stopped) that only exists in the browser.
"use client"

// Note 2: The LiveTracker provides a start/stop timer for real-time hour
// tracking. It serves as an alternative to the QuickLogForm — students can
// press "Time In" when they arrive and "Time Out" when they leave. The
// elapsed time is calculated using date-fns differenceInMinutes and
// submitted as a time entry via the createTimeEntry Server Action.
export function LiveTracker() {
  // Note 3: The full implementation will use:
  // - useState for tracking isRunning state and startTime
  // - useEffect with setInterval for updating the elapsed time display
  // - date-fns format() for displaying HH:mm:ss elapsed time
  // - The createTimeEntry Server Action for saving the completed entry
  return (
    <div>
      {/* Note 4: The UI will include:
          - A large "Time In" / "Time Out" toggle button (min 44px touch target)
          - Real-time elapsed time display (HH:MM:SS format)
          - Visual indicator for running/stopped state
          - Auto-submit when "Time Out" is pressed */}
      <p className="text-muted-foreground">Live Tracker placeholder</p>
    </div>
  )
}
