import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Bordered block with a titled header, shared by every interactive study
 * component (exercises, quizzes, step-by-step, calculators) so they read as
 * one family next to the prose. `action` sits on the header's right edge.
 */
export function Panel({
  icon: Icon,
  title,
  action,
  children,
}: {
  icon: LucideIcon;
  title: ReactNode;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="not-prose border-border bg-background shadow-soft rounded-card my-8 overflow-hidden border">
      <div className="border-border bg-surface flex min-h-11 items-center justify-between gap-3 border-b px-4 py-2 sm:px-5">
        <p className="text-foreground flex items-center gap-2.5 text-[0.8125rem] font-semibold">
          <span className="bg-accent-soft text-accent rounded-chip flex h-6 w-6 shrink-0 items-center justify-center">
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          {title}
        </p>
        {action}
      </div>
      {children}
    </div>
  );
}
