// Note 1: "not-found.tsx" at the app root is a special Next.js file that
// renders when no route matches the requested URL. It replaces the default
// Next.js 404 page with a custom branded experience.
import Link from "next/link"

// Note 2: The Next.js <Link> component provides client-side navigation.
// Unlike a regular <a> tag, <Link> prefetches the target page in the
// background (on hover or when visible in viewport), making navigation
// feel instant. It also preserves the single-page application experience
// by not doing a full page reload.
export default function NotFound() {
  return (
    // Note 3: "min-h-dvh" ensures the 404 page fills the full viewport,
    // centering the message both vertically and horizontally. This creates
    // a clean, focused experience rather than a cramped error message
    // at the top of an otherwise empty page.
    <div className="flex min-h-dvh flex-col items-center justify-center text-center">
      {/* Note 4: "text-primary" uses the SJPIICD accent color (Deep Blue/Navy)
          defined in globals.css. This maintains brand consistency even on
          error pages — a detail that reflects professional design standards. */}
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Page not found. The page you are looking for does not exist.
      </p>
      {/* Note 5: The link uses semantic color classes (bg-primary,
          text-primary-foreground) for automatic theme adaptation.
          "rounded-md" applies the medium border radius token.
          The padding values (px-6 py-3) create a comfortable touch target
          that meets the 44px minimum height recommended by mobile UX guidelines. */}
      <Link
        href="/dashboard"
        className="mt-6 rounded-md bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90"
      >
        Go to Dashboard
      </Link>
    </div>
  )
}
