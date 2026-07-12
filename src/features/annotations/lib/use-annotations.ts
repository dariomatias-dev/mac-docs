import { useCallback } from "react";

import { usePersistedState } from "@/shared/hooks/use-persisted-state";

import type { Annotation } from "../annotations.types";

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    try {
      return crypto.randomUUID();
    } catch {}
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function useAnnotations(slug: string) {
  const [annotations, setAnnotations] = usePersistedState<Annotation[]>(`annotations:${slug}`, []);

  const add = useCallback(
    (note: string) => {
      const trimmed = note.trim();
      if (!trimmed) return;
      const entry: Annotation = { id: createId(), note: trimmed, createdAt: Date.now() };
      setAnnotations((prev) => [...prev, entry]);
    },
    [setAnnotations],
  );

  const update = useCallback(
    (id: string, note: string) => {
      const trimmed = note.trim();
      if (!trimmed) return;
      setAnnotations((prev) => prev.map((a) => (a.id === id ? { ...a, note: trimmed } : a)));
    },
    [setAnnotations],
  );

  const remove = useCallback(
    (id: string) => {
      setAnnotations((prev) => prev.filter((a) => a.id !== id));
    },
    [setAnnotations],
  );

  return { annotations, add, update, remove } as const;
}
