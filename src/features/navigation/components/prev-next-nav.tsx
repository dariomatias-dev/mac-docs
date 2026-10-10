import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

import type { SidebarPage } from "../navigation.types";

type NeighborPage = SidebarPage & { /** Module the page belongs to, if any. */ module?: string };

export function PrevNextNav({
  prev,
  next,
}: {
  prev: NeighborPage | null;
  next: NeighborPage | null;
}) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Páginas vizinhas"
      className={`grid gap-3 ${prev && next ? "sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]" : ""}`}
    >
      {prev && (
        <Link
          href={prev.href}
          className="group border-border bg-background hover:border-border-strong hover:bg-surface rounded-card flex min-w-0 flex-col gap-1 border px-5 py-4 transition-colors"
        >
          <span className="text-muted flex items-center gap-1.5 text-xs font-medium">
            <ArrowLeft
              className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            <span>Anterior</span>
          </span>
          <span className="text-foreground leading-snug font-semibold">{prev.title}</span>
          {prev.module && <span className="text-muted text-xs">{prev.module}</span>}
        </Link>
      )}
      {next && (
        <Link
          href={next.href}
          className={`group border-accent/30 bg-accent-soft hover:border-accent/60 rounded-card flex min-w-0 items-center gap-4 border px-5 py-4 transition-colors ${
            prev ? "" : "sm:col-span-full"
          }`}
        >
          <span className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="text-accent text-xs font-semibold">
              <span>Próximo</span>
            </span>
            <span className="text-foreground text-lg leading-snug font-semibold tracking-[-0.015em]">
              {next.title}
            </span>
            {next.module && <span className="text-muted text-xs">{next.module}</span>}
          </span>
          <span
            aria-hidden="true"
            className="bg-accent text-accent-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-transform group-hover:translate-x-0.5"
          >
            <ArrowRight className="h-4.5 w-4.5" />
          </span>
        </Link>
      )}
    </nav>
  );
}
