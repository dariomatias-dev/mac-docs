import type { ReactNode } from "react";

export type CalloutType =
  "tip" | "caution" | "definition" | "example" | "simulation" | "connection";

const STYLES: Record<
  CalloutType,
  { border: string; bg: string; text: string; dot: string; label: string }
> = {
  tip: {
    border: "border-[rgba(35,165,99,0.25)]",
    bg: "bg-[#e6f9f0] dark:bg-[rgba(35,165,99,0.12)]",
    text: "text-[#23a563]",
    dot: "bg-[#23a563]",
    label: "Dica",
  },
  caution: {
    border: "border-[rgba(217,119,6,0.25)]",
    bg: "bg-[#fff8ed] dark:bg-[rgba(217,119,6,0.12)]",
    text: "text-[#d97706]",
    dot: "bg-[#d97706]",
    label: "Cuidado",
  },
  definition: {
    border: "border-[rgba(20,158,202,0.25)]",
    bg: "bg-[#eaf4fb] dark:bg-[rgba(20,158,202,0.12)]",
    text: "text-[#149eca]",
    dot: "bg-[#149eca]",
    label: "Definição",
  },
  example: {
    border: "border-[rgba(124,87,225,0.25)]",
    bg: "bg-[#f5f0ff] dark:bg-[rgba(124,87,225,0.12)]",
    text: "text-[#7c57e1]",
    dot: "bg-[#7c57e1]",
    label: "Exemplo",
  },
  simulation: {
    border: "border-[rgba(6,182,212,0.25)]",
    bg: "bg-[#e8f9fd] dark:bg-[rgba(6,182,212,0.12)]",
    text: "text-[#06b6d4]",
    dot: "bg-[#06b6d4]",
    label: "Simulação",
  },
  connection: {
    border: "border-border",
    bg: "bg-surface",
    text: "text-muted",
    dot: "bg-muted",
    label: "Conexão",
  },
};

export function Callout({
  type = "tip",
  title,
  children,
}: {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}) {
  const style = STYLES[type];

  return (
    <div
      className={`not-prose my-7 rounded-[10px] border ${style.border} ${style.bg} px-5.5 py-4.5`}
    >
      <p
        className={`mb-2.5 flex items-center gap-2 text-[0.8rem] font-bold tracking-[0.08em] uppercase ${style.text}`}
      >
        {title ?? style.label}
      </p>
      <div className="prose prose-sm dark:prose-invert text-foreground max-w-none">{children}</div>
    </div>
  );
}
