"use client";

import { ArrowRight, CalendarClock } from "lucide-react";
import Link from "next/link";

import { useNextClassIndex } from "../hooks/use-next-class-index";
import { formatClassDate } from "../lib/format";
import { CLASS_SCHEDULE, todayLocalDateString } from "../lib/schedule";

const PLAN_HREF = "/docs/matematica-discreta/plano-de-disciplina";

/** One-line "next class" link for the top of the home page. */
export function NextClassBadge() {
  const index = useNextClassIndex();
  const next = index === undefined || index < 0 ? null : CLASS_SCHEDULE[index];

  return (
    <Link
      href={PLAN_HREF}
      className="group border-border bg-background/80 hover:border-accent/50 shadow-soft rounded-card inline-flex max-w-full items-center gap-3 border py-2 pr-4 pl-2 text-left text-sm backdrop-blur-sm transition-colors"
    >
      <span className="bg-accent-soft text-accent rounded-control flex h-8 w-8 shrink-0 items-center justify-center">
        <CalendarClock className="h-4 w-4" aria-hidden="true" />
      </span>
      {index === undefined && (
        // Same footprint as the loaded text, so nothing shifts on hydration;
        // the label keeps the link named while the date is still unknown.
        <span className="text-foreground flex items-center gap-2">
          Próxima aula:
          <span aria-hidden="true" className="bg-surface-2 rounded-chip h-4 w-44 animate-pulse" />
        </span>
      )}
      {index === -1 && <span className="text-muted">Semestre encerrado, sem próximas aulas.</span>}
      {next && (
        <span className="text-foreground min-w-0">
          {next.date === todayLocalDateString() ? (
            <strong>Aula hoje</strong>
          ) : (
            <>
              Próxima aula: <strong>{formatClassDate(next.date)}</strong>
            </>
          )}
          , <span className="text-muted">{next.topic}</span>
        </span>
      )}
      <ArrowRight
        className="text-muted group-hover:text-accent h-4 w-4 shrink-0 transition-[color,translate] group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </Link>
  );
}
