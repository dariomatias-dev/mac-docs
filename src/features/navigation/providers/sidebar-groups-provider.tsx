"use client";

import { createContext, useContext, type ReactNode } from "react";

import { usePersistedState } from "@/shared/hooks/use-persisted-state";

type SidebarGroupsContextValue = {
  isOpen: (href: string, defaultOpen: boolean) => boolean;
  setGroupOpen: (href: string, value: boolean) => void;
  seedGroupOpen: (href: string, defaultOpen: boolean) => void;
};

const SidebarGroupsContext = createContext<SidebarGroupsContextValue | null>(null);

export function SidebarGroupsProvider({ children }: { children: ReactNode }) {
  const [openMap, setOpenMap] = usePersistedState<Record<string, boolean>>("sidebar-groups", {});

  function isOpen(href: string, defaultOpen: boolean) {
    return href in openMap ? openMap[href] : defaultOpen;
  }

  function setGroupOpen(href: string, value: boolean) {
    setOpenMap((prev) => ({ ...prev, [href]: value }));
  }

  function seedGroupOpen(href: string, defaultOpen: boolean) {
    setOpenMap((prev) => (href in prev ? prev : { ...prev, [href]: defaultOpen }));
  }

  return (
    <SidebarGroupsContext.Provider value={{ isOpen, setGroupOpen, seedGroupOpen }}>
      {children}
    </SidebarGroupsContext.Provider>
  );
}

export function useSidebarGroups() {
  const ctx = useContext(SidebarGroupsContext);
  if (!ctx) throw new Error("useSidebarGroups must be used within SidebarGroupsProvider");
  return ctx;
}
