import { useCallback } from "react";

import { usePersistedState } from "@/shared/hooks/use-persisted-state";

import type { Annotation } from "../annotations.types";

export const MAX_NOTE_LENGTH = 500;

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    try {
      return crypto.randomUUID();
    } catch {}
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function useAnnotations(slug: string) {
  const [annotations, setAnnotations] = usePersistedState<Annotation[]>(`annotations:${slug}`, [], {
    syncAcrossTabs: true,
  });

  const add = useCallback(
    (note: string) => {
      const trimmed = note.trim().slice(0, MAX_NOTE_LENGTH);
      if (!trimmed) return;
      const entry: Annotation = { id: createId(), note: trimmed, createdAt: Date.now() };
      setAnnotations((prev) => [...prev, entry]);
    },
    [setAnnotations],
  );

  const update = useCallback(
    (id: string, note: string) => {
      const trimmed = note.trim().slice(0, MAX_NOTE_LENGTH);
      if (!trimmed) return;
      setAnnotations((prev) =>
        prev.map((a) => (a.id === id ? { ...a, note: trimmed, updatedAt: Date.now() } : a)),
      );
    },
    [setAnnotations],
  );

  const remove = useCallback(
    (id: string) => {
      setAnnotations((prev) => prev.filter((a) => a.id !== id));
    },
    [setAnnotations],
  );

  const restore = useCallback(
    (annotation: Annotation) => {
      setAnnotations((prev) =>
        prev.some((a) => a.id === annotation.id) ? prev : [...prev, annotation],
      );
    },
    [setAnnotations],
  );

  const importNotes = useCallback(
    (notes: unknown[]) => {
      const entries: Annotation[] = notes
        .filter(
          (n): n is { note: string; createdAt?: number; updatedAt?: number } =>
            typeof n === "object" &&
            n !== null &&
            typeof (n as { note?: unknown }).note === "string" &&
            (n as { note: string }).note.trim().length > 0,
        )
        .map((n) => ({
          id: createId(),
          note: n.note.trim().slice(0, MAX_NOTE_LENGTH),
          createdAt: typeof n.createdAt === "number" ? n.createdAt : Date.now(),
          ...(typeof n.updatedAt === "number" ? { updatedAt: n.updatedAt } : {}),
        }));
      if (entries.length === 0) return;
      setAnnotations((prev) => [...prev, ...entries]);
    },
    [setAnnotations],
  );

  return { annotations, add, update, remove, restore, importNotes } as const;
}
