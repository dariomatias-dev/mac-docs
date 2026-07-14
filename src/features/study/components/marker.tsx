import type { ReactNode } from "react";

// Inline numbered/lettered badge for exercise items (e.g. <Marker>1</Marker>,
// <Marker>a)</Marker>, <Marker>IV</Marker>) — children can be any label, not
// just digits, so callers can use letters, roman numerals, or punctuation.
export function Marker({ children }: { children: ReactNode }) {
  return (
    <span className="bg-accent-soft text-accent mr-2 inline-flex h-7 min-w-7 shrink-0 translate-y-0.5 items-center justify-center rounded-full px-1.5 align-middle text-sm font-bold">
      {children}
    </span>
  );
}
