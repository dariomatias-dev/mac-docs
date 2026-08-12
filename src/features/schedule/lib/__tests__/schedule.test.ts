import { afterEach, describe, expect, it, vi } from "vitest";

import { getNextClass } from "../schedule";

const schedule = [
  { date: "2026-01-05", topic: "First" },
  { date: "2026-01-12", topic: "Second" },
  { date: "2026-01-19", topic: "Third" },
];

describe("getNextClass", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns today's session when it hasn't passed yet", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-12T08:00:00"));
    expect(getNextClass(schedule)).toEqual(schedule[1]);
  });

  it("returns the next upcoming session between class dates", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-08T08:00:00"));
    expect(getNextClass(schedule)).toEqual(schedule[1]);
  });

  it("returns null once every session has passed", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-01T08:00:00"));
    expect(getNextClass(schedule)).toBeNull();
  });
});
