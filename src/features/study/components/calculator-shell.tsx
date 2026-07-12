import type { ReactNode } from "react";

export function CalculatorCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="not-prose border-border my-7 overflow-hidden rounded-xl border">
      <div className="border-border bg-surface border-b px-5 py-3">
        <p className="text-accent text-[0.8rem] font-bold tracking-[0.08em] uppercase">{title}</p>
      </div>
      {children}
    </div>
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
          className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
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
