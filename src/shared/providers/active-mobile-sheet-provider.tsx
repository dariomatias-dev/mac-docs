"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type MobileSheetId = "nav" | "annotations";

type ActiveMobileSheetContextValue = {
  activeSheet: MobileSheetId | null;
  open: (id: MobileSheetId) => void;
  close: (id: MobileSheetId) => void;
  toggle: (id: MobileSheetId) => void;
};

const ActiveMobileSheetContext = createContext<ActiveMobileSheetContextValue | null>(null);

// Only one mobile sheet (nav or annotations) can be open at a time: both are
// near-fullscreen on small screens, so stacking them is confusing rather than useful.
export function ActiveMobileSheetProvider({ children }: { children: ReactNode }) {
  const [activeSheet, setActiveSheet] = useState<MobileSheetId | null>(null);

  const open = useCallback((id: MobileSheetId) => setActiveSheet(id), []);
  const close = useCallback(
    (id: MobileSheetId) => setActiveSheet((current) => (current === id ? null : current)),
    [],
  );
  const toggle = useCallback(
    (id: MobileSheetId) => setActiveSheet((current) => (current === id ? null : id)),
    [],
  );

  useEffect(() => {
    if (!activeSheet) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [activeSheet]);

  const value = useMemo(
    () => ({ activeSheet, open, close, toggle }),
    [activeSheet, open, close, toggle],
  );

  return (
    <ActiveMobileSheetContext.Provider value={value}>{children}</ActiveMobileSheetContext.Provider>
  );
}

export function useMobileSheet(id: MobileSheetId) {
  const ctx = useContext(ActiveMobileSheetContext);
  if (!ctx) throw new Error("useMobileSheet must be used within ActiveMobileSheetProvider");
  const { activeSheet, open, close, toggle } = ctx;

  return {
    isOpen: activeSheet === id,
    openSheet: () => open(id),
    close: () => close(id),
    toggle: () => toggle(id),
  };
}
