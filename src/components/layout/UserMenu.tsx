// Note 1: "use client" is required because this component uses event handlers
// (dropdown click interactions) and calls a Server Action (signOut) via a form
// submission, both of which require client-side JavaScript.
"use client"

// Note 2: Lucide icons for the dropdown menu items. LogOut is the standard
// icon for sign-out actions across most SaaS dashboards.
import { LogOut, User } from "lucide-react"

// Note 3: shadcn DropdownMenu is built on Radix UI's Dropdown primitive,
// providing accessible keyboard navigation (arrow keys, Escape to close),
// focus management, and ARIA attributes out of the box.
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

// Note 4: The signOut Server Action is imported from the actions module.
// When invoked from a Client Component, Next.js automatically handles the
// RPC (Remote Procedure Call) — it sends a POST request to the server,
// executes the function, and processes the redirect.
import { signOut } from "@/actions/auth"
import { toast } from "sonner"

// Note 5: Props interface defines the user data this component needs.
// By accepting simple props (not fetching data itself), this Client Component
// stays lean — the parent Server Component handles the data fetching.
interface UserMenuProps {
  userEmail: string
  userName: string
  userAvatar?: string
}

export function UserMenu({ userEmail, userName, userAvatar }: UserMenuProps) {
  // Note 6: Extract initials from the user's name for the avatar fallback.
  // "John Doe" → "JD", "Alice" → "A". If no name is available, fall back to
  // the first character of the email address.
  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : userEmail[0]?.toUpperCase() ?? "U"

  return (
    <DropdownMenu>
      {/* Note 7: DropdownMenuTrigger wraps the element that opens the menu.
          "asChild" tells Radix to use the child element as the trigger instead
          of wrapping it in another element — this avoids invalid DOM nesting
          (e.g., <button> inside <button>). */}
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative size-9 rounded-full"
        >
          {/* Note 8: Avatar component provides a circular image container with
              a fallback. AvatarImage loads the Google profile picture if available.
              AvatarFallback shows initials if the image fails to load or while
              it's loading — this prevents a blank space during image loading. */}
          <Avatar className="size-9">
            <AvatarImage src={userAvatar} alt={userName || userEmail} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      {/* Note 9: DropdownMenuContent uses "align='end'" to anchor the menu
          to the right edge of the trigger button, preventing it from
          overflowing off the right side of the screen. "forceMount" is NOT
          used here — the menu only renders when open (better performance). */}
      <DropdownMenuContent className="w-56" align="end" forceMount>
        {/* Note 10: DropdownMenuLabel displays the user's identity.
            "font-normal" overrides the default bold label styling for a
            cleaner look with the name displayed in bold below. */}
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName || "Student"}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Note 11: The Profile menu item links to the settings page where
            users can update their program, company, and target hours. */}
        <DropdownMenuItem asChild>
          <a href="/settings" className="flex items-center gap-2 cursor-pointer">
            <User className="size-4" />
            <span>Profile</span>
          </a>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Note 12: Sign out uses a <form> with the signOut Server Action.
            Using a form action (instead of onClick + fetch) enables progressive
            enhancement — the sign-out would still work even if JavaScript
            failed to load. The "w-full" ensures the form takes full width
            so the entire menu item is clickable. */}
        <DropdownMenuItem asChild>
          <form action={signOut} className="w-full" onSubmit={() => toast.success("Successfully logged out. See you later!")}>
            <button
              type="submit"
              className="flex w-full items-center gap-2 cursor-pointer"
            >
              <LogOut className="size-4" />
              <span>Sign out</span>
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
