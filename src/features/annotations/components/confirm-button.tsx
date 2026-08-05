"use client";

import { useState } from "react";
import type { ComponentType } from "react";

// Click once to arm, click "Remover" to confirm or anywhere else (icon again,
// Cancelar) to back out — avoids native window.confirm() popups.
export function ConfirmButton({
  icon: Icon,
  label,
  onConfirm,
  className,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  onConfirm: () => void;
  className?: string;
}) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <span className="flex shrink-0 items-center gap-1.5 text-xs">
        <span className="text-muted-2 hidden sm:inline">Remover?</span>
        <button
          type="button"
          onClick={() => {
            setConfirming(false);
            onConfirm();
          }}
          className="cursor-pointer font-medium text-red-500 hover:underline"
        >
          Remover
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="text-muted-2 hover:text-foreground cursor-pointer hover:underline"
        >
          Cancelar
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      aria-label={label}
      title={label}
      className={
        className ??
        "text-muted-2 hover:bg-surface cursor-pointer rounded-md p-1.5 transition-colors hover:text-red-500"
      }
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}
