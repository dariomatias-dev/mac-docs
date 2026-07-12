import type { ReactNode } from "react";

// Number, source and points live in the `## Questão N` heading above
// (via <Badge>); this is just the bordered container for the content,
// so nothing gets said twice.
export function Question({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose border-border my-7 rounded-lg border">
      <div className="px-6 py-5">
        <div className="prose prose-sm dark:prose-invert text-foreground max-w-none">
          {children}
        </div>
      </div>
    </div>
  );
}
