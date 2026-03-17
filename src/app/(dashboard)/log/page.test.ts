import { describe, expect, it } from "vitest"

import LogPage, { metadata } from "./page"

describe("log page module", () => {
  it("exports expected metadata title", () => {
    expect(metadata.title).toBe("Log Hours — JP Track")
  })

  it("exports a page component function", () => {
    expect(typeof LogPage).toBe("function")
  })
})
