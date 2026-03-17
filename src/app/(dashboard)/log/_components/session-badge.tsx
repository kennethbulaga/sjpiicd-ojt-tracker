import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

import type { SessionType } from "./shared"

const sessionBadgeClassNames = cva("font-medium", {
  variants: {
    session: {
      Morning: "",
      Afternoon: "badge-afternoon",
      Overtime: "",
    },
    size: {
      compact: "text-[10px] px-1.5 py-0",
      default: "text-[10px] sm:text-xs px-1.5 py-0 sm:px-2.5 sm:py-0.5",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

const sessionBadgeVariant: Record<SessionType, "default" | "secondary" | "outline"> = {
  Morning: "default",
  Afternoon: "secondary",
  Overtime: "outline",
}

interface SessionBadgeProps extends VariantProps<typeof sessionBadgeClassNames> {
  session: SessionType
  className?: string
}

export function SessionBadge({ session, size, className }: SessionBadgeProps) {
  return (
    <Badge
      variant={sessionBadgeVariant[session]}
      className={cn(sessionBadgeClassNames({ session, size }), className)}
    >
      {session}
    </Badge>
  )
}
