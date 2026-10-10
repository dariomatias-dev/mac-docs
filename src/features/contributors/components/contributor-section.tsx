import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function ContributorSection({
  icon: Icon,
  title,
  description,
  emptyMessage,
  children,
  hasItems,
  className = "",
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  emptyMessage: string;
  children: ReactNode;
  hasItems: boolean;
  className?: string;
}) {
  return (
    <section className={`mx-auto max-w-7xl px-6 py-14 sm:py-16 ${className}`}>
      <div className="flex items-start gap-4">
        <span className="bg-accent-soft text-accent rounded-control flex h-10 w-10 shrink-0 items-center justify-center">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-foreground text-2xl font-semibold tracking-[-0.03em] sm:text-[1.75rem]">
            {title}
          </h2>
          <p className="text-muted mt-1 max-w-[60ch] leading-relaxed">{description}</p>
        </div>
      </div>

      {hasItems ? (
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
      ) : (
        <p className="border-border bg-surface text-muted rounded-card mt-8 border border-dashed p-6 text-center text-sm">
          {emptyMessage}
        </p>
      )}
    </section>
  );
}
