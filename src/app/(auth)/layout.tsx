// Note 1: This is a Next.js Route Group Layout. The parentheses in "(auth)"
// tell the App Router to group these routes WITHOUT adding "/auth" to the URL.
// So "/login" is served directly, not "/auth/login".

// Note 2: This is a React Server Component (RSC) by default. In Next.js App Router,
// every component is a Server Component unless you add "use client" at the top.
// Layouts should stay as Server Components for performance since they don't need
// browser APIs or interactivity — they only define structure.
export default function AuthLayout({
  children,
}: {
  // Note 3: React.ReactNode is the broadest type for anything React can render:
  // JSX elements, strings, numbers, arrays, fragments, null, etc.
  // Using it for "children" is the standard pattern for wrapper/layout components.
  children: React.ReactNode
}) {
  return (
    // Note 4: "min-h-dvh" uses the dynamic viewport height unit (dvh), which is
    // critical for mobile browsers. Unlike "vh", "dvh" accounts for the
    // browser chrome (address bar, bottom bar) that appears/disappears on scroll.
    // This prevents content from being hidden behind mobile browser UI.
    <div className="flex min-h-dvh items-center justify-center bg-background">
      {/* Note 5: "max-w-md" caps the login card at 448px, keeping it readable on
          large screens. "px-4" adds horizontal padding so the card doesn't touch
          screen edges on small devices. This is a mobile-first responsive pattern. */}
      <div className="w-full max-w-md px-4">
        {children}
      </div>
    </div>
  )
}
