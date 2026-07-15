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

  it("does not clobber a stored value with the initial value on mount", () => {
    localStorage.setItem("k", JSON.stringify(42));
    renderHook(() => usePersistedState("k", 0));
    expect(JSON.parse(localStorage.getItem("k")!)).toBe(42);
  });

  it("does not leak stale state into a new key when the key changes on a mounted instance", () => {
    localStorage.setItem("page-a", JSON.stringify(["noteA"]));
    const { result, rerender } = renderHook(({ key }) => usePersistedState(key, [] as string[]), {
      initialProps: { key: "page-a" },
    });
    expect(result.current[0]).toEqual(["noteA"]);

    rerender({ key: "page-b" });

    expect(result.current[0]).toEqual([]);
    expect(JSON.parse(localStorage.getItem("page-b")!)).toEqual([]);
    expect(JSON.parse(localStorage.getItem("page-a")!)).toEqual(["noteA"]);
  });

  it("syncs state when a storage event fires for the same key", () => {
    const { result } = renderHook(() => usePersistedState("k", 0));

    act(() => {
      window.dispatchEvent(new StorageEvent("storage", { key: "k", newValue: JSON.stringify(9) }));
    });

    expect(result.current[0]).toBe(9);
  });

  it("ignores storage events for a different key", () => {
    const { result } = renderHook(() => usePersistedState("k", 0));
    act(() => result.current[1](5));

    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", { key: "other", newValue: JSON.stringify(9) }),
      );
    });

    expect(result.current[0]).toBe(5);
  });

  it("falls back to the initial value when a storage event clears the key", () => {
    const { result } = renderHook(() => usePersistedState("k", 0));
    act(() => result.current[1](5));

    act(() => {
      window.dispatchEvent(new StorageEvent("storage", { key: "k", newValue: null }));
    });

    expect(result.current[0]).toBe(0);
  });
});
