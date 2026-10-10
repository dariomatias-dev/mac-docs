"use client";

import { ArrowRight, CalendarClock } from "lucide-react";
import Link from "next/link";

import { useNextClassIndex } from "../hooks/use-next-class-index";
import { formatClassDate, formatShortClassDate } from "../lib/format";
import { CLASS_SCHEDULE, todayLocalDateString } from "../lib/schedule";

const PLAN_HREF = "/docs/matematica-discreta/plano-de-disciplina";
const LATER_COUNT = 3;

/** Brand-colored panel with the next class and the few after it. */
export function UpcomingClasses() {
  const index = useNextClassIndex();
  const next = index === undefined || index < 0 ? null : CLASS_SCHEDULE[index];
  const later =
    next && index !== undefined ? CLASS_SCHEDULE.slice(index + 1, index + 1 + LATER_COUNT) : [];

  return (
    <div className="rounded-card relative isolate flex h-full min-h-80 flex-col overflow-hidden bg-linear-to-br from-[#0a7194] to-[#064a62] p-7 text-white sm:p-9">
      <div
        aria-hidden="true"
        className="absolute -top-28 -right-20 -z-10 h-80 w-80 rounded-full bg-[radial-gradient(closest-side,rgb(92_204_228/0.35),transparent)]"
      />
      <p className="flex items-center gap-2 text-sm font-medium text-white/90">
        <CalendarClock className="h-4 w-4" aria-hidden="true" />
        Próxima aula
      </p>

      {index === undefined && (
        <div aria-hidden="true" className="mt-5 animate-pulse space-y-3">
          <div className="rounded-chip h-9 w-3/4 bg-white/15" />
          <div className="rounded-chip h-5 w-1/2 bg-white/15" />
        </div>
      )}

      {index === -1 && (
        <p className="mt-5 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
          Semestre encerrado, sem próximas aulas.
        </p>
      )}

      {next && (
        <>
          <p className="mt-5 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
            {next.date === todayLocalDateString() ? "Hoje" : formatClassDate(next.date)}
          </p>
          <p className="mt-2 text-lg text-white/90">{next.topic}</p>

          {later.length > 0 && (
            <ul className="mt-8 space-y-2.5 border-t border-white/20 pt-5 text-sm">
              {later.map((session) => (
                <li key={session.date} className="flex gap-4">
                  <span className="w-20 shrink-0 whitespace-nowrap text-white/90 tabular-nums">
                    {formatShortClassDate(session.date)}
                  </span>
                  <span>{session.topic}</span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <Link
        href={PLAN_HREF}
        className="mt-auto inline-flex w-fit items-center gap-1.5 pt-8 text-sm font-semibold text-white underline-offset-4 hover:underline"
      >
        Ver o cronograma completo
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  );
}
