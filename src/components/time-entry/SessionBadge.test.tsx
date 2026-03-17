import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { SessionBadge } from "@/app/(dashboard)/log/_components/session-badge"

describe("SessionBadge", () => {
  it("applies afternoon accent styling", () => {
    render(<SessionBadge session="Afternoon" />)

    expect(screen.getByText("Afternoon")).toHaveClass("badge-afternoon")
  })

  it("applies compact size classes when requested", () => {
    render(<SessionBadge session="Morning" size="compact" />)

    expect(screen.getByText("Morning")).toHaveClass("text-[10px]", "px-1.5")
  })
})
