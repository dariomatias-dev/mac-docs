import { CopyMarkdownButton } from "./copy-markdown-button";

import type { ReactNode } from "react";

// Number, source and points live in the `## Questão N` heading above
// (via <Badge>); this is just the bordered container for the content,
// so nothing gets said twice.
export function Question({
  copyMarkdown,
  children,
}: {
  /** Injected at compile time by the content feature's remark-exercise-markdown. */
  copyMarkdown?: string;
  children: ReactNode;
}) {
  return (
    <div className="not-prose border-border bg-background shadow-soft rounded-card my-8 border">
      <div className="p-5 sm:p-6">
        {copyMarkdown && (
          <div className="-mt-2 -mr-2 mb-1 flex justify-end sm:-mt-3 sm:-mr-3">
            <CopyMarkdownButton markdown={copyMarkdown} noun="questão" />
          </div>
        )}
        <div className="prose dark:prose-invert text-foreground max-w-none [&>:first-child]:mt-0 [&>:last-child]:mb-0">
          {children}
        </div>
      </div>
    </div>
  );
}
