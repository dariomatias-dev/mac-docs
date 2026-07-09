"use client";

import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";

import { usePersistedState } from "@/shared/hooks/use-persisted-state";

type SidebarGroupsContextValue = {
  isOpen: (href: string, defaultOpen: boolean) => boolean;
  setGroupOpen: (href: string, value: boolean) => void;
  seedGroupOpen: (href: string, defaultOpen: boolean) => void;
};

const SidebarGroupsContext = createContext<SidebarGroupsContextValue | null>(null);

export function SidebarGroupsProvider({ children }: { children: ReactNode }) {
  const [openMap, setOpenMap] = usePersistedState<Record<string, boolean>>("sidebar-groups", {});

  const isOpen = useCallback(
    (href: string, defaultOpen: boolean) => (href in openMap ? openMap[href] : defaultOpen),
    [openMap],
  );

  const setGroupOpen = useCallback(
    (href: string, value: boolean) => {
      setOpenMap((prev) => ({ ...prev, [href]: value }));
    },
    [setOpenMap],
  );

  const seedGroupOpen = useCallback(
    (href: string, defaultOpen: boolean) => {
      setOpenMap((prev) => (href in prev ? prev : { ...prev, [href]: defaultOpen }));
    },
    [setOpenMap],
  );

  const value = useMemo(
    () => ({ isOpen, setGroupOpen, seedGroupOpen }),
    [isOpen, setGroupOpen, seedGroupOpen],
  );

  return <SidebarGroupsContext.Provider value={value}>{children}</SidebarGroupsContext.Provider>;
}

export function useSidebarGroups() {
  const ctx = useContext(SidebarGroupsContext);
  if (!ctx) throw new Error("useSidebarGroups must be used within SidebarGroupsProvider");
  return ctx;
}
