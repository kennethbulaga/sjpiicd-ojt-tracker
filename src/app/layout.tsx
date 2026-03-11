// Note 1: This is the root layout — every page in the application is wrapped
// by this component. It defines the <html> and <body> structure, global fonts,
// the ThemeProvider (for dark mode), and the Toaster (for toast notifications).
// As a Server Component, this file is rendered on the server, which means
// the initial HTML is fully formed before it reaches the browser.
import type { Metadata } from "next"
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google"
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
const displayFont = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
})

const bodyFont = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
})

// Note 5: metadataBase resolves relative OG image paths to absolute URLs.
// VERCEL_URL is auto-injected by Vercel at build time (no NEXT_PUBLIC_ needed
// because metadata is evaluated server-side only). Falls back to localhost
// for local development.
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000"

// Note 6: The metadata export is a Next.js convention for setting <head> tags.
// This object is statically analyzable, so Next.js can optimize it at build time.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "JP Track — SJPIICD OJT Hour Tracker",
  description:
    "Track and manage your On-the-Job Training hours for St. John Paul II College of Davao.",

  // Open Graph — used by Facebook, LinkedIn, Discord, and other platforms
  // that render link previews when the URL is shared.
  openGraph: {
    type: "website",
    siteName: "JP Track",
    title: "JP Track — SJPIICD OJT Hour Tracker",
    description:
      "A dedicated tool for efficient internship management. Track hours, monitor progress, and export DTR records.",
    images: [
      {
        url: "/system-open-graph.png",
        width: 1200,
        height: 630,
        alt: "St. John Paul II College of Davao — OJT Tracker System",
      },
    ],
  },

  // Twitter (X) — uses summary_large_image for a prominent image preview.
  twitter: {
    card: "summary_large_image",
    title: "JP Track — SJPIICD OJT Hour Tracker",
    description:
      "A dedicated tool for efficient internship management. Track hours, monitor progress, and export DTR records.",
    images: ["/system-open-graph.png"],
  },
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
        className={`${displayFont.variable} ${bodyFont.variable} antialiased font-body selection:bg-primary selection:text-primary-foreground`}
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
          defaultTheme="dark"
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
