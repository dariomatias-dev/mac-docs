"use client";

import { Download, NotebookPen, Pencil, StickyNote, Trash2, Upload, X } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";

import { MAX_NOTE_LENGTH } from "../lib/use-annotations";
import type { Annotation } from "../annotations.types";

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

const NOTE_TEXTAREA_STYLES = {
  new: "border-border bg-background text-foreground focus:border-accent focus:ring-accent/20 w-full resize-none overflow-y-auto rounded-lg border p-3 text-sm transition-colors outline-none focus:ring-2",
  edit: "text-foreground placeholder:text-muted-2 w-full resize-none overflow-y-auto bg-transparent text-sm outline-none",
};

const TEXTAREA_MAX_HEIGHT_PX = 240;

// Shared textarea + save/cancel behavior for both the "new note" form and an
// annotation's edit mode, so keyboard shortcuts and submit logic live once.
function NoteForm({
  variant,
  initialValue = "",
  placeholder,
  autoFocus,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  variant: keyof typeof NOTE_TEXTAREA_STYLES;
  initialValue?: string;
  placeholder?: string;
  autoFocus?: boolean;
  submitLabel: string;
  onSubmit: (note: string) => void;
  onCancel?: () => void;
}) {
  const [value, setValue] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!autoFocus) return;
    const el = textareaRef.current;
    if (!el) return;
    el.focus();
    el.setSelectionRange(el.value.length, el.value.length);
  }, [autoFocus]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, TEXTAREA_MAX_HEIGHT_PX)}px`;
  }, [value]);

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setValue("");
  };

  return (
    <div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value.slice(0, MAX_NOTE_LENGTH))}
        onKeyDown={(e) => {
          if (e.key === "Escape") onCancel?.();
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
        }}
        placeholder={placeholder}
        rows={3}
        maxLength={MAX_NOTE_LENGTH}
        className={NOTE_TEXTAREA_STYLES[variant]}
      />
      <div className="mt-2 flex items-center justify-between gap-3">
        <span className="text-muted-2 text-[0.7rem] tabular-nums">
          {value.length}/{MAX_NOTE_LENGTH}
        </span>
        <div className="flex justify-end gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-muted-2 hover:text-foreground cursor-pointer text-xs"
            >
              Cancelar
            </button>
          )}
          <button
            type="button"
            onClick={submit}
            disabled={!value.trim()}
            className="text-accent cursor-pointer text-xs font-medium hover:underline disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:no-underline"
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

const AnnotationItem = memo(function AnnotationItem({
  annotation,
  onUpdate,
  onRemove,
}: {
  annotation: Annotation;
  onUpdate: (id: string, note: string) => void;
  onRemove: (annotation: Annotation) => void;
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <li className="border-accent/50 bg-accent-soft rounded-lg border p-3">
        <NoteForm
          variant="edit"
          initialValue={annotation.note}
          autoFocus
          submitLabel="Salvar"
          onSubmit={(note) => {
            onUpdate(annotation.id, note);
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
        />
      </li>
    );
  }

  return (
    <li className="border-border bg-surface/50 hover:border-accent/40 group rounded-lg border p-3 transition-colors">
      <p className="text-foreground text-sm wrap-break-word whitespace-pre-wrap">
        {annotation.note}
      </p>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-muted-2 text-[0.7rem]">{formatDate(annotation.createdAt)}</span>
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label="Editar anotação"
            className="text-muted-2 hover:bg-surface hover:text-accent cursor-pointer rounded-md p-1.5 transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onRemove(annotation)}
            aria-label="Remover anotação"
            className="text-muted-2 hover:bg-surface cursor-pointer rounded-md p-1.5 transition-colors hover:text-red-500"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </li>
  );
});

const UNDO_TIMEOUT_MS = 5000;

export function AnnotationsPanel({
  open,
  onClose,
  slug,
  annotations,
  onAdd,
  onUpdate,
  onRemove,
  onRestore,
  onImport,
}: {
  open: boolean;
  onClose: () => void;
  slug: string;
  annotations: Annotation[];
  onAdd: (note: string) => void;
  onUpdate: (id: string, note: string) => void;
  onRemove: (id: string) => void;
  onRestore: (annotation: Annotation) => void;
  onImport: (notes: unknown[]) => void;
}) {
  const [pendingUndos, setPendingUndos] = useState<Annotation[]>([]);
  const undoTimeoutsRef = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timeouts = undoTimeoutsRef.current;
    return () => {
      for (const timeout of timeouts.values()) clearTimeout(timeout);
    };
  }, []);

  function handleRemove(annotation: Annotation) {
    onRemove(annotation.id);
    setPendingUndos((prev) => [...prev, annotation]);
    const timeout = setTimeout(() => {
      setPendingUndos((prev) => prev.filter((a) => a.id !== annotation.id));
      undoTimeoutsRef.current.delete(annotation.id);
    }, UNDO_TIMEOUT_MS);
    undoTimeoutsRef.current.set(annotation.id, timeout);
  }

  function handleUndo(annotation: Annotation) {
    onRestore(annotation);
    setPendingUndos((prev) => prev.filter((a) => a.id !== annotation.id));
    const timeout = undoTimeoutsRef.current.get(annotation.id);
    if (timeout) clearTimeout(timeout);
    undoTimeoutsRef.current.delete(annotation.id);
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify(annotations, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `annotations-${slug.replaceAll("/", "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleImportFile(file: File) {
    try {
      const parsed = JSON.parse(await file.text());
      if (!Array.isArray(parsed)) throw new Error("expected an array");
      onImport(parsed);
    } catch (err) {
      console.error("Failed to import annotations", err);
    }
  }

  return (
    <>
      <aside
        aria-hidden={!open}
        inert={!open}
        className={`border-border bg-background fixed top-16 right-0 bottom-0 z-70 flex w-full max-w-md flex-col border-l shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="border-border flex shrink-0 items-center justify-between border-b px-5 py-3.5">
          <p className="text-accent flex items-center gap-2 text-[0.8rem] font-bold tracking-[0.08em] uppercase">
            <NotebookPen className="h-4 w-4" />
            Anotações da página
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleExport}
              disabled={annotations.length === 0}
              aria-label="Exportar anotações"
              title="Exportar anotações"
              className="text-muted-2 hover:bg-surface hover:text-foreground cursor-pointer rounded-md p-1 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Download className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Importar anotações"
              title="Importar anotações"
              className="text-muted-2 hover:bg-surface hover:text-foreground cursor-pointer rounded-md p-1 transition-colors"
            >
              <Upload className="h-4 w-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              aria-label="Selecionar arquivo de anotações"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleImportFile(file);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar anotações"
              className="text-muted-2 hover:bg-surface hover:text-foreground cursor-pointer rounded-md p-1 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <NoteForm
            variant="new"
            placeholder="Escreva uma anotação sobre esta página..."
            submitLabel="Adicionar"
            onSubmit={onAdd}
          />

          {annotations.length === 0 ? (
            <div className="text-muted-2 mt-10 flex flex-col items-center gap-2 text-center text-sm">
              <StickyNote className="h-8 w-8 opacity-40" />
              Nenhuma anotação ainda nesta página.
            </div>
          ) : (
            <ul className="mt-4 space-y-2.5">
              {annotations
                .slice()
                .reverse()
                .map((a) => (
                  <AnnotationItem
                    key={a.id}
                    annotation={a}
                    onUpdate={onUpdate}
                    onRemove={handleRemove}
                  />
                ))}
            </ul>
          )}
        </div>

        {pendingUndos.length > 0 && (
          <div className="border-border bg-surface divide-border flex shrink-0 flex-col divide-y border-t text-sm">
            {pendingUndos.map((annotation) => (
              <div
                key={annotation.id}
                className="flex items-center justify-between gap-3 px-5 py-3"
              >
                <span className="text-muted-2">Anotação removida.</span>
                <button
                  type="button"
                  onClick={() => handleUndo(annotation)}
                  className="text-accent cursor-pointer font-medium hover:underline"
                >
                  Desfazer
                </button>
              </div>
            ))}
          </div>
        )}
      </aside>

      <div
        aria-hidden="true"
        className={`bg-border fixed inset-x-0 top-16 z-80 h-px transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  );
}
