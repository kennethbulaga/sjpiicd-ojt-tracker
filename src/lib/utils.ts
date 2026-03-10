// Note 1: ClassValue is a type from clsx that represents anything that can
// be a CSS class: strings, arrays, objects, null, undefined, false, etc.
// It enables the flexible syntax: cn("base", isActive && "active", { "hidden": !show })
import { type ClassValue, clsx } from "clsx"
// Note 2: tailwind-merge intelligently merges Tailwind classes by resolving
// conflicts. For example, twMerge("px-4 px-6") returns "px-6" (last wins).
// Without it, both classes would apply and the result would depend on CSS
// specificity order (unpredictable in Tailwind's utility-first approach).
import { twMerge } from "tailwind-merge"

// Note 3: cn() is the standard utility in every shadcn/ui project. It
// combines clsx (conditional class joining) with tailwind-merge (conflict
// resolution). Usage example:
//   cn("px-4 py-2", isLarge && "px-8 py-4", className)
// This pattern allows component consumers to override default styles
// by passing their own className prop, which will win over the defaults.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
