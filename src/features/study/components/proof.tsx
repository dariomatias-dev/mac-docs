import type { ReactNode } from "react";

export function Proof({ children }: { children: ReactNode }) {
  return (
    <div className="katex-left no-math-copy border-accent/40 bg-surface/60 rounded-r-control my-4 border-l-2 py-1 pr-4 pl-5 [&_p]:my-3">
      {children}
    </div>
  );
}
