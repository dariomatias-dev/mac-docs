"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { FileX2, NotebookPen, Pencil, StickyNote, Trash2 } from "lucide-react";

import { fetchSearchIndex } from "@/features/search/lib/search-shared";

import type { Annotation } from "../annotations.types";
import { ANNOTATIONS_KEY_PREFIX, slugFromHref } from "../lib/slug-from-href";
import { ConfirmButton } from "./confirm-button";
import { NoteForm } from "./note-form";

type Group = {
  slug: string;
  annotations: Annotation[];
  page?: { title: string; href: string; section: string };
};

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function readGroups(): Omit<Group, "page">[] {
  const groups: Omit<Group, "page">[] = [];
  for (const key of Object.keys(window.localStorage)) {
    if (!key.startsWith(ANNOTATIONS_KEY_PREFIX)) continue;
    try {
      const raw = window.localStorage.getItem(key);
      const parsed = raw ? (JSON.parse(raw) as Annotation[]) : [];
      if (!Array.isArray(parsed) || parsed.length === 0) continue;
      groups.push({ slug: key.slice(ANNOTATIONS_KEY_PREFIX.length), annotations: parsed });
    } catch {
      // ignore malformed entries
    }
  }
  return groups;
}

function writeGroupNotes(slug: string, notes: Annotation[]) {
  const key = `${ANNOTATIONS_KEY_PREFIX}${slug}`;
  if (notes.length > 0) {
    window.localStorage.setItem(key, JSON.stringify(notes));
  } else {
    window.localStorage.removeItem(key);
  }
}

function NoteItem({
  annotation,
  onUpdate,
  onRemove,
}: {
  annotation: Annotation;
  onUpdate: (note: string) => void;
  onRemove: () => void;
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <li className="border-accent/50 bg-accent-soft rounded-[10px] border p-3">
        <NoteForm
          variant="edit"
          initialValue={annotation.note}
          autoFocus
          submitLabel="Salvar"
          onSubmit={(note) => {
            onUpdate(note);
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
        />
      </li>
    );
  }

  return (
    <li className="border-border bg-background group rounded-[10px] border p-3">
      <p className="text-foreground text-sm wrap-break-word whitespace-pre-wrap">
        {annotation.note}
      </p>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-muted-2 text-[0.7rem]">
          {annotation.updatedAt
            ? `editado em ${formatDate(annotation.updatedAt)}`
            : formatDate(annotation.createdAt)}
        </span>
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label="Editar anotação"
            className="text-muted-2 hover:bg-surface hover:text-accent cursor-pointer rounded-md p-1.5 transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <ConfirmButton icon={Trash2} label="Remover anotação" onConfirm={onRemove} />
        </div>
      </div>
    </li>
  );
}

function GroupCard({
  group,
  onUpdateNote,
  onRemoveNote,
  onRemoveGroup,
}: {
  group: Group;
  onUpdateNote: (id: string, note: string) => void;
  onRemoveNote: (id: string) => void;
  onRemoveGroup: () => void;
}) {
  return (
    <div className="border-border bg-surface/50 rounded-[10px] border p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          {group.page ? (
            <>
              <Link
                href={group.page.href}
                className="text-foreground hover:text-accent font-semibold transition-colors"
              >
                {group.page.title}
              </Link>
              <p className="text-muted-2 text-xs">{group.page.section}</p>
            </>
          ) : (
            <>
              <p className="text-foreground flex items-center gap-1.5 font-semibold">
                <FileX2 className="text-muted-2 h-4 w-4 shrink-0" />
                Página removida
              </p>
              <p className="text-muted-2 font-mono text-xs">{group.slug || "(início)"}</p>
            </>
          )}
        </div>
        <ConfirmButton
          icon={Trash2}
          label="Remover todas as anotações desta página"
          onConfirm={onRemoveGroup}
        />
      </div>

      <ul className="space-y-2">
        {group.annotations.map((a) => (
          <NoteItem
            key={a.id}
            annotation={a}
            onUpdate={(note) => onUpdateNote(a.id, note)}
            onRemove={() => onRemoveNote(a.id)}
          />
        ))}
      </ul>
    </div>
  );
}

export function AnnotationsListPage() {
  const [groups, setGroups] = useState<Group[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const raw = readGroups();
      let index: { title: string; href: string; section: string }[] = [];
      try {
        index = await fetchSearchIndex();
      } catch {
        // if the index fails to load, everything just renders as "removed"
      }
      const pageBySlug = new Map(index.map((item) => [slugFromHref(item.href), item]));

      if (cancelled) return;
      setGroups(
        raw
          .map((g) => ({ ...g, page: pageBySlug.get(g.slug) }))
          .sort((a, b) => {
            if (!!a.page !== !!b.page) return a.page ? -1 : 1;
            return (a.page?.title ?? a.slug).localeCompare(b.page?.title ?? b.slug);
          }),
      );
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleRemoveGroup(slug: string) {
    writeGroupNotes(slug, []);
    setGroups((prev) => (prev ? prev.filter((g) => g.slug !== slug) : prev));
  }

  function updateGroupNotes(slug: string, updater: (notes: Annotation[]) => Annotation[]) {
    setGroups((prev) => {
      if (!prev) return prev;
      const next: Group[] = [];
      for (const g of prev) {
        if (g.slug !== slug) {
          next.push(g);
          continue;
        }
        const notes = updater(g.annotations);
        writeGroupNotes(slug, notes);
        if (notes.length > 0) next.push({ ...g, annotations: notes });
      }
      return next;
    });
  }

  function handleRemoveNote(slug: string, id: string) {
    updateGroupNotes(slug, (notes) => notes.filter((a) => a.id !== id));
  }

  function handleUpdateNote(slug: string, id: string, note: string) {
    updateGroupNotes(slug, (notes) =>
      notes.map((a) => (a.id === id ? { ...a, note, updatedAt: Date.now() } : a)),
    );
  }

  const total = groups?.reduce((sum, g) => sum + g.annotations.length, 0) ?? 0;

  return (
    <main className="flex-1">
      <section className="mx-auto max-w-4xl px-6 pt-16 pb-4">
        <h1 className="from-accent-dark via-accent mb-1 bg-linear-to-br to-[#58c4dc] bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
          Anotações
        </h1>
        <p className="text-muted mt-3 max-w-2xl text-base leading-relaxed sm:text-lg">
          Todas as suas anotações, de todas as páginas, guardadas neste navegador.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-24">
        {groups === null ? (
          <p className="text-muted-2 text-sm">Carregando...</p>
        ) : total === 0 ? (
          <div className="text-muted-2 mt-10 flex flex-col items-center gap-3 text-center text-sm">
            <span className="bg-accent-soft flex h-14 w-14 items-center justify-center rounded-full">
              <StickyNote className="text-accent h-6 w-6" />
            </span>
            <p className="max-w-[32ch] leading-relaxed">
              Nenhuma anotação ainda. Abra qualquer página de conteúdo e use o botão de anotações no
              canto da tela.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-muted-2 flex items-center gap-1.5 text-sm">
              <NotebookPen className="h-3.5 w-3.5" />
              {total} {total === 1 ? "anotação" : "anotações"} em {groups.length}{" "}
              {groups.length === 1 ? "página" : "páginas"}
            </p>
            {groups.map((g) => (
              <GroupCard
                key={g.slug}
                group={g}
                onUpdateNote={(id, note) => handleUpdateNote(g.slug, id, note)}
                onRemoveNote={(id) => handleRemoveNote(g.slug, id)}
                onRemoveGroup={() => handleRemoveGroup(g.slug)}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
