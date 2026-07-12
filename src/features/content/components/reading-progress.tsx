"use client";

import { useState } from "react";

import { useRafScroll } from "@/shared/hooks/use-raf-scroll";

// Thin scroll-progress bar pinned to the header's bottom edge. Tracks how far
// the reader has scrolled through the document (0..1) and drives a scaleX fill.
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useRafScroll(() => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
  }, []);

  return (
    <div className="fixed top-16 right-0 left-0 z-50 h-0.5" aria-hidden="true">
      <div
        className="bg-accent/25 h-full origin-left transition-transform duration-75"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
