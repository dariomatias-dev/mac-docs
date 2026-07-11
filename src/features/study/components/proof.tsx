import type { ReactNode } from "react";

export function Proof({ children }: { children: ReactNode }) {
  return (
    <div className="katex-left no-math-copy border-border ml-4 border-l-2 pl-4 [&_p]:my-3">
      {children}
    </div>
  );
}
