// Note 1: "use client" is required because next-themes' ThemeProvider uses
// React Context under the hood, which requires client-side JavaScript to
// manage and distribute the theme state across the component tree.
"use client"

// Note 2: We re-export next-themes' ThemeProvider under a custom wrapper file.
// This pattern is recommended because:
// 1. Next.js App Router requires Context Providers to be Client Components
// 2. Root layout (layout.tsx) is a Server Component and can't use "use client"
// 3. By wrapping ThemeProvider in a Client Component file, we keep the root
//    layout as a Server Component (better performance) while still providing
//    theme context to the entire app.
import { ThemeProvider as NextThemesProvider } from "next-themes"

// Note 3: We spread all props to NextThemesProvider, allowing the root layout
// to configure it (attribute, defaultTheme, enableSystem, etc.) without this
// file needing to know the configuration details.
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
