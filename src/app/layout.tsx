// Note 1: This is the root layout — every page in the application is wrapped
// by this component. It defines the <html> and <body> structure, global fonts,
// the ThemeProvider (for dark mode), and the Toaster (for toast notifications).
// As a Server Component, this file is rendered on the server, which means
// the initial HTML is fully formed before it reaches the browser.
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

// Note 2: ThemeProvider is a Client Component wrapper around next-themes.
// We import it here (a Server Component) to wrap the entire app in theme
// context. This is the "Provider Pattern" for App Router — providers must
// be Client Components, but they can be composed into Server Component layouts.
import { ThemeProvider } from "@/components/providers/ThemeProvider"

// Note 3: Toaster from sonner (shadcn wrapper) provides toast notifications.
// It's placed in the root layout so toasts can be triggered from any page.
import { Toaster } from "@/components/ui/sonner"

// Note 4: next/font/google optimizes font loading by:
// 1. Self-hosting the font files (no Google Fonts CDN request)
// 2. Applying CSS `font-display: swap` for no layout shift
// 3. Generating CSS custom properties (--font-geist-sans) for use in Tailwind
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

// Note 5: The metadata export is a Next.js convention for setting <head> tags.
// This object is statically analyzable, so Next.js can optimize it at build time.
export const metadata: Metadata = {
  title: "JP Track — SJPIICD OJT Hour Tracker",
  description:
    "Track and manage your On-the-Job Training hours for St. John Paul II College of Davao.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // Note 6: suppressHydrationWarning is required by next-themes because it
    // injects a blocking <script> that sets the "class" attribute on <html>
    // before React hydrates. Without this attribute, React would warn about
    // the mismatch between server-rendered HTML (no class) and client HTML
    // (class="dark" or class="light").
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Note 7: ThemeProvider configuration:
            - attribute="class": Adds "dark" class to <html> element, which
              triggers Tailwind's @custom-variant dark defined in globals.css
            - defaultTheme="system": Respects the user's OS preference on
              first visit (light/dark based on system settings)
            - enableSystem: Keeps watching the OS preference for changes
            - disableTransitionOnChange: Prevents a flash of all CSS
              transitions firing when the theme switches */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}

          {/* Note 8: Toaster renders an invisible container that displays
              toast notifications when `toast()` is called from any component.
              Placing it here (after {children}) ensures it renders on top of
              all page content via CSS stacking context. */}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
