import type { ReactNode } from "react";

// Number, source and points live in the `## Questão N` heading above
// (via <Badge>); this is just the bordered container for the content,
// so nothing gets said twice.
export function Question({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose border-border bg-background shadow-soft rounded-card my-8 border">
      <div className="p-5 sm:p-6">
        <div className="prose dark:prose-invert text-foreground max-w-none [&>:first-child]:mt-0 [&>:last-child]:mb-0">
          {children}
        </div>
      </div>
    </div>
  );
}
