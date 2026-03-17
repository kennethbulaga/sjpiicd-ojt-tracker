import { afterEach, describe, expect, it, vi } from "vitest"

import { resolveDateParam } from "./date-param"

describe("resolveDateParam", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it("returns today's date when param is missing", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-03-17T08:00:00.000Z"))

    expect(resolveDateParam()).toBe("2026-03-17")
  })

  it("returns today's date when param is invalid", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-03-17T08:00:00.000Z"))

    expect(resolveDateParam("not-a-date")).toBe("2026-03-17")
  })

  it("returns the original date when param is valid", () => {
    expect(resolveDateParam("2026-03-01")).toBe("2026-03-01")
  })
})
