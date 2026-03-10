// Note 1: In the App Router, a file named "page.tsx" defines a routable page.
// This file at "(auth)/login/page.tsx" maps to the URL "/login".
// The "(auth)" folder is a Route Group — it provides layout grouping without
// affecting the URL path.

// Note 2: This is a Server Component by default. The login page itself doesn't
// need client-side interactivity — the interactive GoogleSignInButton component
// will be a Client Component imported here. This pattern (Server Component page
// composing Client Component children) is the recommended Next.js architecture.
export default function LoginPage() {
  return (
    <div>
      <h1>Login</h1>
      {/* Note 3: The GoogleSignInButton (a Client Component with "use client")
          will be imported and placed here. Keeping the page as a Server Component
          while nesting Client Components inside it is called the
          "Islands of Interactivity" pattern — it minimizes the JavaScript
          shipped to the browser. */}
    </div>
  )
}
