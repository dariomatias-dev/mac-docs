import { describe, expect, it } from "vitest";

import { READING_LINE, activeHeadingId } from "../active-heading";

const headings = [
  { id: "q1", top: -400 },
  { id: "q2", top: 50 },
  { id: "q3", top: 300 },
];

describe("activeHeadingId", () => {
  it("picks the last heading that has crossed the reading line", () => {
    expect(activeHeadingId(headings, { viewportBottom: 800, documentBottom: 5000 })).toBe("q2");
  });

  it("falls back to the first heading when none have crossed yet", () => {
    expect(
      activeHeadingId(
        [
          { id: "q1", top: 400 },
          { id: "q2", top: 800 },
        ],
        { viewportBottom: 800, documentBottom: 5000 },
      ),
    ).toBe("q1");
  });

  it("picks the last heading at the document bottom even if it is still below the reading line", () => {
    expect(
      activeHeadingId(
        [
          { id: "q1", top: -200 },
          { id: "q2", top: READING_LINE + 80 },
        ],
        { viewportBottom: 1799, documentBottom: 1800 },
      ),
    ).toBe("q2");
  });

  it("returns null when there are no headings", () => {
    expect(activeHeadingId([], { viewportBottom: 800, documentBottom: 1000 })).toBeNull();
  });
});
