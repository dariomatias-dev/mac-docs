"use client";

import type { ReactNode } from "react";

import { ChevronRight } from "lucide-react";

import { useDisclosure } from "@/shared/hooks/use-disclosure";

export function Collapsible({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const { open, toggle } = useDisclosure(defaultOpen);

  return (
    <div className="not-prose border-border my-6 overflow-hidden rounded-xl border">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="bg-surface text-foreground hover:text-accent flex w-full cursor-pointer items-center gap-2 px-5 py-3 text-left text-sm font-semibold transition-colors"
      >
        <ChevronRight
          className={`text-muted h-4 w-4 shrink-0 transition-transform duration-300 ${
            open ? "rotate-90" : ""
          }`}
        />
        {title}
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="prose prose-sm dark:prose-invert text-foreground max-w-none px-5 py-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
