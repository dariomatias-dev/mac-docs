import { useEffect } from "react";

// Runs `callback` once (deferred to the next frame) and again on every
// scroll/resize, throttled to one call per animation frame.
export function useRafScroll(callback: () => void, deps: readonly unknown[]) {
  useEffect(() => {
    let frame = 0;

    function tick() {
      frame = 0;
      callback();
    }

    function onScroll() {
      if (frame) return;
      frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
