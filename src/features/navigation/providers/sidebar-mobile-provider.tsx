"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type SidebarMobileContextValue = {
  open: boolean;
  toggle: () => void;
  close: () => void;
};

const SidebarMobileContext = createContext<SidebarMobileContextValue | null>(null);

export function SidebarMobileProvider({ children }: { children: ReactNode }) {
  // Plain useState on purpose, unlike the sibling collapse/groups providers:
  // this is a transient mobile-menu-open flag, not a preference. Persisting
  // it would reopen the menu on every reload.
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  return (
    <SidebarMobileContext.Provider
      value={{ open, toggle: () => setOpen((v) => !v), close: () => setOpen(false) }}
    >
      {children}
    </SidebarMobileContext.Provider>
  );
}

export function useSidebarMobile() {
  const ctx = useContext(SidebarMobileContext);
  if (!ctx) throw new Error("useSidebarMobile must be used within SidebarMobileProvider");
  return ctx;
}
