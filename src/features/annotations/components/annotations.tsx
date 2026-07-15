"use client";

import { StickyNote } from "lucide-react";
import { useEffect } from "react";

import { useMobileSheet } from "@/shared/providers/active-mobile-sheet-provider";

import { cleanupOrphanAnnotations } from "../lib/cleanup-orphan-annotations";
import { useAnnotations } from "../lib/use-annotations";
import { AnnotationsPanel } from "./annotations-panel";

export function Annotations({ slug }: { slug: string }) {
  const { annotations, add, update, remove, restore, importNotes } = useAnnotations(slug);
  const { isOpen: open, openSheet, close } = useMobileSheet("annotations");

  useEffect(() => {
    void cleanupOrphanAnnotations();
  }, []);

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={openSheet}
          aria-label="Abrir anotações"
          aria-expanded={open}
          className="bg-accent text-accent-foreground hover:bg-accent-dark fixed right-6 bottom-6 z-40 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
        >
          <StickyNote className="h-5 w-5" />
          {annotations.length > 0 && (
            <span className="bg-background text-foreground border-border absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full border px-1 text-[10px] font-semibold">
              {annotations.length}
            </span>
          )}
        </button>
      )}

      <AnnotationsPanel
        open={open}
        onClose={close}
        slug={slug}
        annotations={annotations}
        onAdd={add}
        onUpdate={update}
        onRemove={remove}
        onRestore={restore}
        onImport={importNotes}
      />
    </>
  );
}
