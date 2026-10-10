"use client";

import { useState } from "react";

import { useRafScroll } from "@/shared/hooks/use-raf-scroll";

// Thin scroll-progress bar pinned under the mobile docs bar, or to the top of
// the window on desktop, where the docs have no header. Tracks how far
// the reader has scrolled through the document (0..1) and drives a scaleX fill.
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useRafScroll(() => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
  }, []);

  return (
    <div className="fixed inset-x-0 top-14 z-40 h-0.5 md:top-0 print:hidden" aria-hidden="true">
      <div
        className="from-accent to-accent-bright h-full origin-left bg-linear-to-r transition-transform duration-75"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
