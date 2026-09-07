import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { usePersistedState } from "../use-persisted-state";

describe("usePersistedState", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

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

  it("falls back to the initial value and logs when the stored value is malformed JSON", () => {
    localStorage.setItem("k", "{not json");
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { result } = renderHook(() => usePersistedState("k", 0));

    expect(result.current[0]).toBe(0);
    expect(errorSpy).toHaveBeenCalled();
  });

  it("logs but does not throw when localStorage.setItem fails", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });

    const { result } = renderHook(() => usePersistedState("k", 0));
    expect(() => act(() => result.current[1](7))).not.toThrow();

    expect(result.current[0]).toBe(7);
    expect(errorSpy).toHaveBeenCalled();
  });

  it("does not sync across tabs by default", () => {
    const { result } = renderHook(() => usePersistedState("k", 0));

    act(() => {
      window.dispatchEvent(new StorageEvent("storage", { key: "k", newValue: JSON.stringify(9) }));
    });

    expect(result.current[0]).toBe(0);
  });

  it("syncs state when a storage event fires for the same key with syncAcrossTabs", () => {
    const { result } = renderHook(() => usePersistedState("k", 0, { syncAcrossTabs: true }));

    act(() => {
      window.dispatchEvent(new StorageEvent("storage", { key: "k", newValue: JSON.stringify(9) }));
    });

    expect(result.current[0]).toBe(9);
  });

  it("ignores storage events for a different key", () => {
    const { result } = renderHook(() => usePersistedState("k", 0, { syncAcrossTabs: true }));
    act(() => result.current[1](5));

    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", { key: "other", newValue: JSON.stringify(9) }),
      );
    });

    expect(result.current[0]).toBe(5);
  });

  it("falls back to the initial value when a storage event clears the key", () => {
    const { result } = renderHook(() => usePersistedState("k", 0, { syncAcrossTabs: true }));
    act(() => result.current[1](5));

    act(() => {
      window.dispatchEvent(new StorageEvent("storage", { key: "k", newValue: null }));
    });

    expect(result.current[0]).toBe(0);
  });

  it("logs and ignores a storage event carrying malformed JSON", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { result } = renderHook(() => usePersistedState("k", 0, { syncAcrossTabs: true }));
    act(() => result.current[1](5));

    act(() => {
      window.dispatchEvent(new StorageEvent("storage", { key: "k", newValue: "{not json" }));
    });

    expect(result.current[0]).toBe(5);
    expect(errorSpy).toHaveBeenCalled();
  });
});
