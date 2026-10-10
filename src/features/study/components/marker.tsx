import type { ReactNode } from "react";

// Inline numbered/lettered badge for exercise items (e.g. <Marker>1</Marker>,
// <Marker>a)</Marker>, <Marker>IV</Marker>): children can be any label, not
// just digits, so callers can use letters, roman numerals, or punctuation.
export function Marker({ children }: { children: ReactNode }) {
  return (
    <span className="bg-accent-soft text-accent rounded-chip mr-2 inline-flex h-6 min-w-6 shrink-0 -translate-y-px items-center justify-center px-1.5 align-middle text-xs font-semibold">
      {children}
    </span>
  );
}
