"use client";

import { CalendarClock, Check, ClipboardCheck } from "lucide-react";
import { useSyncExternalStore } from "react";

import { formatClassDate } from "../lib/format";
import { getNextClassIndex, todayLocalDateString } from "../lib/schedule";

export type TimelineSession = { date: string; topic: string; emphasized: boolean };

function subscribe() {
  return () => {};
}

// undefined until hydration: the answer depends on the visitor's clock.
function getServerSnapshot() {
  return undefined;
}

function toDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function monthLabel(isoDate: string) {
  const label = toDate(isoDate).toLocaleDateString("pt-BR", { month: "long" });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function rowDate(isoDate: string) {
  const date = toDate(isoDate);
  const weekday = date.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");
  return `${weekday}, ${isoDate.slice(8, 10)}/${isoDate.slice(5, 7)}`;
}

function shortDate(isoDate: string) {
  return toDate(isoDate).toLocaleDateString("pt-BR", { day: "numeric", month: "short" });
}

type RowState = "past" | "next" | "future" | "unknown";

function StateDot({ state, className = "" }: { state: RowState; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-3.75 w-3.75 shrink-0 items-center justify-center rounded-full border-2 ${
        state === "next"
          ? "border-accent bg-accent ring-accent/25 ring-4"
          : state === "past"
            ? "border-border-strong bg-border-strong text-background"
            : "border-border-strong bg-background"
      } ${className}`}
    >
      {state === "past" && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
    </span>
  );
}

function stateOf(index: number, nextIndex: number | undefined): RowState {
  if (nextIndex === undefined) return "unknown";
  if (nextIndex === -1 || index < nextIndex) return "past";
  return index === nextIndex ? "next" : "future";
}

export function ClassTimeline({ sessions }: { sessions: TimelineSession[] }) {
  const nextIndex = useSyncExternalStore(
    subscribe,
    () => getNextClassIndex(sessions),
    getServerSnapshot,
  );
  const next = nextIndex === undefined || nextIndex < 0 ? null : sessions[nextIndex];
  const done = nextIndex === undefined ? null : nextIndex === -1 ? sessions.length : nextIndex;
  const exams = sessions.filter((session) => session.emphasized);

  const months: { label: string; items: { session: TimelineSession; index: number }[] }[] = [];
  sessions.forEach((session, index) => {
    const key = session.date.slice(0, 7);
    const last = months[months.length - 1];
    if (last && last.items[0].session.date.startsWith(key)) last.items.push({ session, index });
    else months.push({ label: monthLabel(session.date), items: [{ session, index }] });
  });

  return (
    <div className="not-prose my-8">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-card relative isolate overflow-hidden bg-linear-to-br from-[#0a7194] to-[#064a62] p-5 text-white sm:col-span-1">
          <p className="flex items-center gap-2 text-xs font-medium text-white/90">
            <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
            Próxima aula
          </p>
          {nextIndex === undefined && (
            <div
              aria-hidden="true"
              className="rounded-chip mt-2 h-6 w-3/4 animate-pulse bg-white/15"
            />
          )}
          {nextIndex === -1 && <p className="mt-2 font-semibold">Semestre encerrado</p>}
          {next && (
            <>
              <p className="mt-2 text-lg leading-snug font-semibold tracking-[-0.02em]">
                {next.date === todayLocalDateString() ? "Hoje" : formatClassDate(next.date)}
              </p>
              <p className="mt-1 line-clamp-2 text-sm text-white/90">{next.topic}</p>
            </>
          )}
        </div>
        <div className="border-border bg-background rounded-card border p-5">
          <p className="text-muted text-xs font-medium">Encontros realizados</p>
          {done === null ? (
            <div
              aria-hidden="true"
              className="bg-surface-2 rounded-chip mt-2 h-6 w-1/2 animate-pulse"
            />
          ) : (
            <p className="text-foreground mt-2 text-lg font-semibold tracking-[-0.02em]">
              {done} de {sessions.length}
            </p>
          )}
        </div>
        <div className="border-border bg-background rounded-card border p-5">
          <p className="text-muted text-xs font-medium">Avaliações</p>
          <p className="text-foreground mt-2 text-lg font-semibold tracking-[-0.02em]">
            {exams.map((exam) => shortDate(exam.date)).join(", ")}
          </p>
        </div>
      </div>

      <div className="border-border bg-background rounded-card mt-4 border">
        <div className="border-border flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b px-5 py-3.5">
          <p className="text-foreground text-sm font-semibold">Cronograma das aulas</p>
          <ul
            aria-label="Legenda"
            className="text-muted flex flex-wrap items-center gap-x-4 gap-y-1 text-xs"
          >
            <li className="flex items-center gap-1.5">
              <StateDot state="past" />
              Realizada
            </li>
            <li className="flex items-center gap-1.5">
              <StateDot state="next" className="scale-90" />
              Próxima
            </li>
            <li className="flex items-center gap-1.5">
              <StateDot state="future" />A seguir
            </li>
          </ul>
        </div>

        <div className="space-y-6 px-3 py-5 sm:px-5">
          {months.map((month) => (
            <section key={month.label} aria-label={month.label}>
              <h3 className="text-muted px-1 text-xs font-semibold tracking-[0.08em] uppercase">
                {month.label}
                <span className="ml-2 font-normal tracking-normal normal-case">
                  {month.items.length} {month.items.length === 1 ? "aula" : "aulas"}
                </span>
              </h3>
              <ol className="before:bg-border relative mt-2 space-y-1 before:absolute before:top-3 before:bottom-3 before:left-1.75 before:w-px">
                {month.items.map(({ session, index }) => {
                  const state = stateOf(index, nextIndex);
                  return (
                    <li key={session.date} className="relative pl-8">
                      <StateDot
                        state={state}
                        className="absolute top-1/2 left-0 -translate-y-1/2"
                      />
                      <div
                        aria-current={state === "next" ? "step" : undefined}
                        className={`rounded-control flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:gap-6 ${
                          state === "next"
                            ? "bg-accent text-accent-foreground shadow-lift"
                            : state === "past"
                              ? "text-muted"
                              : "text-foreground"
                        }`}
                      >
                        <time
                          dateTime={session.date}
                          className={`w-24 shrink-0 text-sm tabular-nums ${
                            state === "next" ? "font-semibold" : "text-muted font-medium"
                          }`}
                        >
                          {rowDate(session.date)}
                        </time>
                        <span className="min-w-0 flex-1 leading-snug">{session.topic}</span>
                        <span className="flex shrink-0 flex-wrap gap-1.5">
                          {session.emphasized && (
                            <span
                              className={`rounded-chip inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold ${
                                state === "next"
                                  ? "border border-current/50"
                                  : "bg-amber-500/10 text-amber-800 dark:text-amber-300"
                              }`}
                            >
                              <ClipboardCheck className="h-3 w-3" aria-hidden="true" />
                              Avaliação
                            </span>
                          )}
                          {state === "next" && (
                            <span className="rounded-chip inline-flex items-center border border-current/50 px-2 py-0.5 text-xs font-semibold">
                              Próxima aula
                            </span>
                          )}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
