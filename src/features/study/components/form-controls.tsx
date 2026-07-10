"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

// Only theme/behavior classes live here (colors, border, focus state) — every
// call site fully owns sizing (padding, text size, rounding, width) via
// className, so there's no Tailwind class-precedence fight between this base
// and per-use overrides.
const CONTROL_BASE =
  "border-border bg-background text-foreground focus:border-accent border outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-40";

export function TextField({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${CONTROL_BASE} ${className}`} />;
}

export type DropdownOption = { value: string; label: ReactNode };

const DROPDOWN_SIZES = {
  sm: {
    button: "rounded px-2 py-1 text-xs gap-1",
    panel: "rounded-lg p-1",
    item: "rounded px-2.5 py-1.5 text-xs",
    chevron: 13,
  },
  md: {
    button: "rounded-lg px-3.5 py-2 text-sm gap-2",
    panel: "rounded-xl p-1.5",
    item: "rounded-lg px-3 py-2 text-sm",
    chevron: 16,
  },
} as const;

export function Dropdown({
  label,
  ariaLabel,
  options,
  value,
  onChange,
  placeholder = "Selecionar",
  size = "md",
  className,
  buttonClassName,
}: {
  label?: string;
  ariaLabel?: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  size?: "sm" | "md";
  className?: string;
  buttonClassName?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const labelId = useId();

  const selected = options.find((o) => o.value === value);
  const s = DROPDOWN_SIZES[size];

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (v: string) => {
    onChange(v);
    setIsOpen(false);
  };

  return (
    <div className={cn("space-y-1", className)} ref={containerRef}>
      {label && (
        <p id={labelId} className="text-muted text-xs font-medium tracking-wide uppercase">
          {label}
        </p>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={label ? labelId : undefined}
          aria-label={label ? undefined : ariaLabel}
          className={cn(
            "border-border bg-background text-foreground flex w-full cursor-pointer items-center justify-between border font-medium transition-colors outline-none",
            s.button,
            isOpen ? "border-accent" : "hover:border-accent/60",
            buttonClassName,
          )}
        >
          <span className={selected ? "text-foreground" : "text-muted"}>
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown
            size={s.chevron}
            className={cn(
              "text-muted shrink-0 transition-transform duration-200",
              isOpen && "text-accent rotate-180",
            )}
          />
        </button>

        {isOpen && (
          <div
            role="listbox"
            className={cn(
              "border-border bg-background absolute top-full left-0 z-50 mt-1.5 min-w-full overflow-hidden border shadow-lg",
              s.panel,
            )}
          >
            <div className="max-h-56 overflow-y-auto">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={opt.value === value}
                  onClick={() => handleSelect(opt.value)}
                  className={cn(
                    "flex w-full cursor-pointer items-center justify-between gap-2 text-left font-medium whitespace-nowrap transition-colors",
                    s.item,
                    opt.value === value
                      ? "bg-accent-soft text-accent"
                      : "text-foreground hover:bg-surface",
                  )}
                >
                  {opt.label}
                  {opt.value === value && <Check size={14} strokeWidth={3} className="shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
