"use client";

import { ChevronRight } from "lucide-react";

import { useDisclosure } from "@/shared/hooks/use-disclosure";

import type { ReactNode } from "react";

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
    <div className="not-prose border-border bg-background shadow-soft rounded-card my-8 overflow-hidden border">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="text-foreground hover:bg-surface flex w-full cursor-pointer items-center gap-2.5 px-5 py-3 text-left text-sm font-semibold transition-colors"
      >
        <ChevronRight
          className={`text-accent h-4 w-4 shrink-0 transition-transform duration-300 ${
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
          <div className="prose dark:prose-invert text-foreground max-w-none px-5 py-4 [&>:first-child]:mt-0 [&>:last-child]:mb-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
