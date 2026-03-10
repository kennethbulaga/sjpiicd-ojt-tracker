// Note 1: Zustand is a lightweight state management library (~1KB). Unlike
// Redux, it doesn't require providers, reducers, or action creators.
// You define your state and actions in a single "create" call, and any
// component can subscribe to specific slices of state.
import { create } from "zustand"

// Note 2: The interface defines the store's shape — both state (data) and
// actions (functions that modify data). Combining them in one type is
// a Zustand convention that provides full type safety when using the store.
interface UIState {
  // Note 3: This flag controls the mobile sidebar/drawer visibility.
  // It's in a global store (not local useState) because multiple components
  // need to read/modify it: the hamburger button opens it, the sidebar
  // component reads it, and clicking outside or navigating closes it.
  isSidebarOpen: boolean
  toggleSidebar: () => void
  closeSidebar: () => void
}

// Note 4: create<UIState>() returns a hook (useUIStore) that components
// use to subscribe to state. Zustand only re-renders components when the
// specific state they subscribed to changes — not the entire store.
// Usage: const isOpen = useUIStore((state) => state.isSidebarOpen)
export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  // Note 5: toggleSidebar uses a function form of set() to access the
  // previous state. This is necessary when the new state depends on the
  // old state (toggling). Using set({ isSidebarOpen: true }) directly
  // would always set it to true, not toggle it.
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  // Note 6: closeSidebar uses the direct object form because it always
  // sets the same value regardless of previous state. This is called
  // when the user navigates to a new page or clicks the overlay backdrop.
  closeSidebar: () => set({ isSidebarOpen: false }),
}))
