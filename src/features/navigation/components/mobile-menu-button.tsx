"use client";

import { Menu, X } from "lucide-react";

import { useSidebarMobile } from "../providers/sidebar-mobile-provider";

export function MobileMenuButton() {
  const { open, toggle } = useSidebarMobile();

  return (
    <button
      type="button"
      aria-label={open ? "Fechar menu" : "Abrir menu"}
      onClick={toggle}
      className="border-border text-muted hover:bg-surface hover:text-foreground flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border transition-colors md:hidden"
    >
      {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
    </button>
  );
}
