import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useCopy } from "../use-copy";

describe("useCopy", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("defaults to not copied", () => {
    const { result } = renderHook(() => useCopy());
    expect(result.current.copied).toBe(false);
  });

  it("sets copied to true after a successful copy, then resets it", async () => {
    const { result } = renderHook(() => useCopy());

    await act(async () => {
      await result.current.copy("hello");
    });
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("hello");
    expect(result.current.copied).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(result.current.copied).toBe(false);
  });

  it("leaves copied false when the clipboard write rejects", async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
    });
    const { result } = renderHook(() => useCopy());

    await act(async () => {
      await result.current.copy("hello");
    });
    expect(result.current.copied).toBe(false);
  });
});
