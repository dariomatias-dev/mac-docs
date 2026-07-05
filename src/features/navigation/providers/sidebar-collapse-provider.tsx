"use client";

import { createContext, useContext, type ReactNode } from "react";

import { usePersistedState } from "@/shared/hooks/use-persisted-state";

type SidebarCollapseContextValue = {
  collapsed: boolean;
  toggle: () => void;
  setCollapsed: (value: boolean) => void;
};

const SidebarCollapseContext = createContext<SidebarCollapseContextValue | null>(null);

export function SidebarCollapseProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = usePersistedState("sidebar-collapsed", false);

  return (
    <SidebarCollapseContext.Provider
      value={{ collapsed, toggle: () => setCollapsed((v) => !v), setCollapsed }}
    >
      {children}
    </SidebarCollapseContext.Provider>
  );
}

export function useSidebarCollapse() {
  const ctx = useContext(SidebarCollapseContext);
  if (!ctx) throw new Error("useSidebarCollapse must be used within SidebarCollapseProvider");
  return ctx;
}
