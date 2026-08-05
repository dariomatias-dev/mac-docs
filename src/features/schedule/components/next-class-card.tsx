"use client";

import { CalendarClock } from "lucide-react";
import Link from "next/link";
import { useSyncExternalStore } from "react";

import { getNextClass } from "@/features/schedule/lib/schedule";

function formatDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
}

function subscribe() {
  return () => {};
}

// undefined means "not yet known": keeps SSR/client markup identical until hydration,
// since the actual value depends on the visitor's local clock.
function getServerSnapshot() {
  return undefined;
}

export function NextClassCard() {
  const nextClass = useSyncExternalStore(subscribe, getNextClass, getServerSnapshot);

  if (nextClass === undefined) return null;

  return (
    <Link
      href="/docs/matematica-discreta/plano-de-disciplina"
      className="border-border bg-surface hover:border-accent flex items-center gap-3 rounded-full border px-5 py-2.5 text-sm transition-colors"
    >
      <CalendarClock className="text-accent h-4 w-4 shrink-0" />
      {nextClass ? (
        <span className="text-foreground">
          Próxima aula: <strong>{formatDate(nextClass.date)}</strong> —{" "}
          <span className="text-muted">{nextClass.topic}</span>
        </span>
      ) : (
        <span className="text-muted">Semestre encerrado — sem próximas aulas.</span>
      )}
    </Link>
  );
}
