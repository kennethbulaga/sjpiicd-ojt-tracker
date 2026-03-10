// Note 1: The settings page at "/settings" allows students to update their
// profile information (name, program, company) and customize their OJT
// target hours. Profile updates are handled via the updateProfile Server Action.

// Note 2: This Server Component can pre-fetch the user's current profile
// from Supabase, then pass it as defaultValues to a Client Component form.
// This pattern avoids an extra client-side fetch and ensures the form
// renders with data on the first paint.
export default function SettingsPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl font-bold">Settings</h1>
      {/* Note 3: A profile form (Client Component using React Hook Form + Zod)
          and target hours configuration will be placed here. The form will
          use the profileSchema from src/actions/profile.ts for validation. */}
    </div>
  )
}
