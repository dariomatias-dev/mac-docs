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
    <section className={`mx-auto max-w-6xl px-6 py-10 ${className}`}>
      <div className="mb-6 flex items-center gap-3">
        <span className="bg-accent-soft text-accent flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-foreground text-xl font-bold tracking-tight">{title}</h2>
          <p className="text-muted text-sm leading-relaxed">{description}</p>
        </div>
      </div>

      {hasItems ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
      ) : (
        <p className="border-border bg-surface text-muted rounded-[10px] border border-dashed p-6 text-center text-sm">
          {emptyMessage}
        </p>
      )}
    </section>
  );
}
