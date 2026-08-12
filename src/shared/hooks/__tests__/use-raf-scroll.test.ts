import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useRafScroll } from "../use-raf-scroll";

let pending: FrameRequestCallback[] = [];

function flushFrames() {
  const callbacks = pending;
  pending = [];
  for (const cb of callbacks) cb(0);
}

describe("useRafScroll", () => {
  beforeEach(() => {
    pending = [];
    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn((cb: FrameRequestCallback) => {
        pending.push(cb);
        return pending.length;
      }),
    );
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("calls the callback once on mount, after the frame runs", () => {
    const callback = vi.fn();
    renderHook(() => useRafScroll(callback, []));
    expect(callback).not.toHaveBeenCalled();

    flushFrames();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("calls the callback again on scroll", () => {
    const callback = vi.fn();
    renderHook(() => useRafScroll(callback, []));
    flushFrames();
    callback.mockClear();

    window.dispatchEvent(new Event("scroll"));
    flushFrames();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("calls the callback again on resize", () => {
    const callback = vi.fn();
    renderHook(() => useRafScroll(callback, []));
    flushFrames();
    callback.mockClear();

    window.dispatchEvent(new Event("resize"));
    flushFrames();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("throttles multiple scroll events to a single frame", () => {
    const callback = vi.fn();
    renderHook(() => useRafScroll(callback, []));
    flushFrames();
    callback.mockClear();

    window.dispatchEvent(new Event("scroll"));
    window.dispatchEvent(new Event("scroll"));
    window.dispatchEvent(new Event("scroll"));
    flushFrames();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("removes listeners on unmount", () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() => useRafScroll(callback, []));
    flushFrames();
    callback.mockClear();

    unmount();
    window.dispatchEvent(new Event("scroll"));
    flushFrames();
    expect(callback).not.toHaveBeenCalled();
  });
});
