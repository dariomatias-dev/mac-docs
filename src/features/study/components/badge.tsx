import type { ReactNode } from "react";

// Small metadata tag meant to sit inline next to a heading (e.g. a
// question's point value or source), without repeating the heading text.
export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="text-muted border-border ml-3 rounded-full border px-2.5 py-1 align-middle text-xs font-normal normal-case">
      {children}
    </span>
  );
}
