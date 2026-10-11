"use client";

import { ChevronDown, CircleCheck, ListOrdered } from "lucide-react";

import { useDisclosure } from "@/shared/hooks/use-disclosure";

import type { ReactNode } from "react";

const KINDS = {
  answer: { noun: "resposta", Icon: CircleCheck, panel: "bg-accent-soft" },
  resolution: { noun: "resolução", Icon: ListOrdered, panel: "bg-surface" },
} as const;

/**
 * Expandable row that hides an answer or a worked resolution until the
 * student asks for it. Stacked one after another they read as a small
 * accordion under the exercise.
 */
export function Reveal({
  kind,
  open: controlledOpen,
  onToggle,
  children,
}: {
  kind: keyof typeof KINDS;
  /** Controlled mode, for parents that need to close it (e.g. on a new question). */
  open?: boolean;
  onToggle?: () => void;
  children: ReactNode;
}) {
  const disclosure = useDisclosure();
  const open = controlledOpen ?? disclosure.open;
  const toggle = onToggle ?? disclosure.toggle;
  const { noun, Icon, panel } = KINDS[kind];

  return (
    <div
      className="not-prose group/reveal border-border bg-background rounded-control mt-3 overflow-hidden border print:hidden"
      data-open={open ? "" : undefined}
    >
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="text-muted-2 hover:bg-surface hover:text-foreground flex w-full cursor-pointer items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium transition-colors"
      >
        <Icon className="text-accent h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="flex-1">{open ? `Ocultar ${noun}` : `Ver ${noun}`}</span>
        <ChevronDown
          className="text-muted h-4 w-4 shrink-0 transition-transform duration-200 group-data-open/reveal:rotate-180"
          aria-hidden="true"
        />
      </button>

      <div
        inert={!open}
        className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-data-open/reveal:grid-rows-[1fr]"
      >
        <div className="min-h-0 overflow-hidden">
          <div className={`border-border border-t px-4 py-4 ${panel}`}>{children}</div>
        </div>
      </div>
    </div>
  );
}
