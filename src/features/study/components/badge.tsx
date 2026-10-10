import type { ReactNode } from "react";

// Small metadata tag meant to sit inline next to a heading (e.g. a
// question's point value or source), without repeating the heading text.
export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="text-muted border-border rounded-chip ml-3 border px-2 py-0.5 align-middle text-xs font-normal tracking-normal normal-case">
      {children}
    </span>
  );
}
