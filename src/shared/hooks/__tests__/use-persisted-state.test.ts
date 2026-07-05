import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { usePersistedState } from "../use-persisted-state";

describe("usePersistedState", () => {
  beforeEach(() => localStorage.clear());

  it("returns the initial value when nothing is stored", () => {
    const { result } = renderHook(() => usePersistedState("k", 0));
    expect(result.current[0]).toBe(0);
  });

  it("hydrates from localStorage on mount", () => {
    localStorage.setItem("k", JSON.stringify(42));
    const { result } = renderHook(() => usePersistedState("k", 0));
    expect(result.current[0]).toBe(42);
  });

  it("persists updates back to localStorage", () => {
    const { result } = renderHook(() => usePersistedState("k", 0));
    act(() => result.current[1](7));
    expect(result.current[0]).toBe(7);
    expect(JSON.parse(localStorage.getItem("k")!)).toBe(7);
  });
});
