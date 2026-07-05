import Link from "next/link";

import type { SidebarPage } from "../navigation.types";

export function PrevNextNav({
  prev,
  next,
}: {
  prev: SidebarPage | null;
  next: SidebarPage | null;
}) {
  if (!prev && !next) return null;

  return (
    <div className="border-border mt-10 flex items-stretch gap-3 border-t pt-6">
      {prev && (
        <Link
          href={prev.href}
          className="border-border hover:border-accent/50 hover:bg-surface flex w-[calc(50%-0.375rem)] flex-col gap-1 rounded-xl border px-4 py-3 transition-colors"
        >
          <span className="text-muted text-xs">Anterior</span>
          <span className="text-accent text-sm font-medium">{prev.title}</span>
        </Link>
      )}
      {next && (
        <Link
          href={next.href}
          className="border-border hover:border-accent/50 hover:bg-surface ml-auto flex w-[calc(50%-0.375rem)] flex-col items-end gap-1 rounded-xl border px-4 py-3 text-right transition-colors"
        >
          <span className="text-muted text-xs">Próximo</span>
          <span className="text-accent text-sm font-medium">{next.title}</span>
        </Link>
      )}
    </div>
  );
}
