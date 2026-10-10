import {
  BookMarked,
  Lightbulb,
  Link2,
  PencilLine,
  SlidersHorizontal,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";

import type { ReactNode } from "react";

export type CalloutType =
  "tip" | "caution" | "definition" | "example" | "simulation" | "connection";

const STYLES: Record<CalloutType, { box: string; text: string; Icon: LucideIcon; label: string }> =
  {
    tip: {
      box: "border-emerald-600/25 bg-emerald-500/[0.06] dark:border-emerald-400/25 dark:bg-emerald-400/[0.07]",
      text: "text-emerald-700 dark:text-emerald-300",
      Icon: Lightbulb,
      label: "Dica",
    },
    caution: {
      box: "border-amber-600/30 bg-amber-500/[0.07] dark:border-amber-400/25 dark:bg-amber-400/[0.07]",
      text: "text-amber-800 dark:text-amber-300",
      Icon: TriangleAlert,
      label: "Cuidado",
    },
    definition: {
      box: "border-accent/25 bg-accent-soft",
      text: "text-accent",
      Icon: BookMarked,
      label: "Definição",
    },
    example: {
      box: "border-violet-600/20 bg-violet-500/[0.05] dark:border-violet-400/25 dark:bg-violet-400/[0.07]",
      text: "text-violet-700 dark:text-violet-300",
      Icon: PencilLine,
      label: "Exemplo",
    },
    simulation: {
      box: "border-cyan-700/25 bg-cyan-500/[0.06] dark:border-cyan-400/25 dark:bg-cyan-400/[0.07]",
      text: "text-cyan-800 dark:text-cyan-300",
      Icon: SlidersHorizontal,
      label: "Simulação",
    },
    connection: {
      box: "border-border-strong bg-surface",
      text: "text-muted-2",
      Icon: Link2,
      label: "Conexão",
    },
  };

/** Labelled, tinted frame around a definition, tip, example… */
export function Callout({
  type = "tip",
  title,
  children,
}: {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}) {
  const { box, text, Icon, label } = STYLES[type];

  return (
    <div className={`not-prose rounded-card my-8 flex gap-3.5 border px-4 py-4 sm:px-5 ${box}`}>
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${text}`} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-semibold ${text}`}>{title ?? label}</p>
        <div className="prose dark:prose-invert text-foreground mt-1.5 max-w-none text-[0.9375rem] leading-[1.7] *:first:mt-0 *:last:mb-0">
          {children}
        </div>
      </div>
    </div>
  );
}
