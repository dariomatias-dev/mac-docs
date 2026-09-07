import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ReadingProgress } from "../reading-progress";

let pending: FrameRequestCallback[] = [];

function flushFrames() {
  act(() => {
    const callbacks = pending;
    pending = [];
    for (const cb of callbacks) cb(0);
  });
}

function stubScroll({
  scrollHeight,
  clientHeight,
  scrollY,
}: {
  scrollHeight: number;
  clientHeight: number;
  scrollY: number;
}) {
  vi.spyOn(document.documentElement, "scrollHeight", "get").mockReturnValue(scrollHeight);
  vi.spyOn(document.documentElement, "clientHeight", "get").mockReturnValue(clientHeight);
  vi.spyOn(window, "scrollY", "get").mockReturnValue(scrollY);
}

// The bar is the inner div nested inside the fixed wrapper; RTL's own
// container is itself a div, so a plain "div > div" selector would also
// match the wrapper (a div whose parent, the container, is also a div).
function getBar(container: HTMLElement) {
  return container.querySelector<HTMLElement>('[aria-hidden="true"] > div')!;
}

describe("ReadingProgress", () => {
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

  afterEach(() => vi.unstubAllGlobals());

  it("starts at zero width before the first frame runs", () => {
    stubScroll({ scrollHeight: 2000, clientHeight: 800, scrollY: 0 });
    const { container } = render(<ReadingProgress />);
    expect(getBar(container).style.transform).toBe("scaleX(0)");
  });

  it("scales to the fraction of the page scrolled", () => {
    stubScroll({ scrollHeight: 2000, clientHeight: 800, scrollY: 600 });
    const { container } = render(<ReadingProgress />);
    flushFrames();

    // max scrollable = 2000 - 800 = 1200; 600 / 1200 = 0.5
    expect(getBar(container).style.transform).toBe("scaleX(0.5)");
  });

  it("clamps at a full bar once scrolled to the bottom", () => {
    stubScroll({ scrollHeight: 2000, clientHeight: 800, scrollY: 5000 });
    const { container } = render(<ReadingProgress />);
    flushFrames();

    expect(getBar(container).style.transform).toBe("scaleX(1)");
  });

  it("shows no progress when the page doesn't scroll at all", () => {
    stubScroll({ scrollHeight: 800, clientHeight: 800, scrollY: 0 });
    const { container } = render(<ReadingProgress />);
    flushFrames();

    expect(getBar(container).style.transform).toBe("scaleX(0)");
  });
});
