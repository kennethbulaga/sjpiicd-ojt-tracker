// Note 1: "use client" marks this as a client-side hook. Custom hooks that
// use React state (useState), effects (useEffect), or other hooks must
// be in Client Components. The "use" prefix is a React naming convention
// that signals "this is a hook" — React enforces the Rules of Hooks
// (only call hooks at the top level) based on this naming pattern.
"use client"

// Note 2: This custom hook will manage client-side state for time entries.
// In the full implementation, it will handle:
// - Fetching entries from Supabase using the browser client
// - Optimistic updates (showing the new entry instantly before server confirms)
// - Client-side filtering (by date range, session type)
// - Client-side sorting (by date, by hours)
// - Error/loading state management
export function useTimeEntries() {
  // Note 3: The return signature defines the hook's public API.
  // Returning an object (not an array) lets consumers destructure only
  // the values they need: const { entries } = useTimeEntries()
  // This is preferred over returning a tuple [entries, isLoading, error]
  // when there are more than 2-3 return values.
  return {
    entries: [],
    isLoading: false,
    error: null,
  }
}
