import { Calculator } from "lucide-react";

import { Panel } from "./panel";

import type { ReactNode } from "react";

export function CalculatorCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Panel icon={Calculator} title={title}>
      {children}
    </Panel>
  );
}

export function OperatorPicker<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          aria-pressed={value === o.id}
          className={`rounded-control cursor-pointer border px-3 py-1.5 text-xs font-medium transition-colors ${
            value === o.id
              ? "border-accent bg-accent/15 text-accent"
              : "border-border text-muted hover:border-accent hover:text-foreground"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
