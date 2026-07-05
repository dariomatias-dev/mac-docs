"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { CornerDownLeft, FileText, Search, X } from "lucide-react";

import { SEARCH_OPEN_EVENT, type SearchItem } from "../lib/search-shared";

type Result = SearchItem & { bodyIdx: number };

function Snippet({ text, query, idx }: { text: string; query: string; idx: number }) {
  if (idx < 0 || !query) return null;
  const start = Math.max(0, idx - 40);
  const end = Math.min(text.length, idx + query.length + 90);
  return (
    <span className="text-muted mt-0.5 line-clamp-1 text-xs">
      {start > 0 && "…"}
      {text.slice(start, idx)}
      <mark className="bg-accent-soft text-accent rounded px-0.5 font-medium">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length, end)}
      {end < text.length && "…"}
    </span>
  );
}

export function SearchDialog({ items }: { items: SearchItem[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items.slice(0, 8).map((item) => ({ ...item, bodyIdx: -1 }));

    const scored = items
      .map((item) => {
        const inTitle = item.title.toLowerCase().includes(q);
        const inSection = item.section.toLowerCase().includes(q);
        const bodyIdx = item.text.toLowerCase().indexOf(q);
        if (!inTitle && !inSection && bodyIdx === -1) return null;
        const score = inTitle ? 0 : inSection ? 1 : 2;
        return { item, score, bodyIdx };
      })
      .filter((r): r is { item: SearchItem; score: number; bodyIdx: number } => r !== null)
      .sort((a, b) => a.score - b.score);

    return scored.slice(0, 12).map((r) => ({ ...r.item, bodyIdx: r.bodyIdx }));
  }, [items, query]);

  const groups = useMemo(() => {
    const map = new Map<string, Result[]>();
    for (const item of results) {
      if (!map.has(item.section)) map.set(item.section, []);
      map.get(item.section)!.push(item);
    }
    return [...map.entries()];
  }, [results]);

  const openDialog = useCallback(() => {
    setOpen(true);
    setQuery("");
    setActiveIndex(0);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) setOpen(false);
        else openDialog();
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, openDialog]);

  useEffect(() => {
    window.addEventListener(SEARCH_OPEN_EVENT, openDialog);
    return () => window.removeEventListener(SEARCH_OPEN_EVENT, openDialog);
  }, [openDialog]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  function onQueryChange(value: string) {
    setQuery(value);
    setActiveIndex(0);
  }

  function onInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[activeIndex]) {
      go(results[activeIndex].href);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        className="bg-surface-2 text-muted hover:bg-surface-2/70 flex w-full max-w-md cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 transition-colors"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="flex-1 text-left text-[0.8125rem] font-semibold">Buscar</span>
        <kbd className="border-border bg-background text-muted hidden shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] font-medium sm:inline">
          Ctrl K
        </kbd>
      </button>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 pt-24 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <div
              className="border-border bg-background flex max-h-[70vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border shadow-2xl ring-1 ring-black/5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="border-border border-b p-3">
                <div className="bg-surface-2 text-muted flex w-full items-center gap-2 rounded-full px-5 py-2.5">
                  <Search className="h-4 w-4 shrink-0" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                    onKeyDown={onInputKeyDown}
                    placeholder="Buscar na documentação…"
                    className="text-foreground placeholder:text-muted w-full bg-transparent text-[0.8125rem] font-semibold outline-none placeholder:font-semibold focus-visible:outline-none"
                  />
                  {query ? (
                    <button
                      type="button"
                      onClick={() => {
                        onQueryChange("");
                        inputRef.current?.focus();
                      }}
                      aria-label="Limpar busca"
                      className="hover:bg-background hover:text-foreground flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-md transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <kbd className="border-border bg-background text-muted hidden shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] font-medium sm:inline">
                      Esc
                    </kbd>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2">
                {results.length === 0 && (
                  <p className="text-muted px-3 py-6 text-center text-sm">Nenhum resultado.</p>
                )}
                {groups.map(([section, sectionItems]) => (
                  <div key={section} className="mb-2 last:mb-0">
                    <p className="text-muted px-2.5 py-1.5 text-[11px] font-semibold tracking-wide uppercase">
                      {section}
                    </p>
                    <ul>
                      {sectionItems.map((item) => {
                        const i = results.indexOf(item);
                        const active = i === activeIndex;
                        return (
                          <li key={item.href}>
                            <button
                              type="button"
                              onClick={() => go(item.href)}
                              onMouseEnter={() => setActiveIndex(i)}
                              className={`flex w-full cursor-pointer items-start gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                                active ? "bg-accent text-accent-foreground" : "text-foreground"
                              }`}
                            >
                              <FileText
                                className={`mt-0.5 h-4 w-4 shrink-0 ${active ? "" : "text-muted"}`}
                              />
                              <span className="flex min-w-0 flex-1 flex-col">
                                <span className="truncate font-medium">{item.title}</span>
                                {!active && (
                                  <Snippet
                                    text={item.text}
                                    query={query.trim().toLowerCase()}
                                    idx={item.bodyIdx}
                                  />
                                )}
                              </span>
                              {active && <CornerDownLeft className="mt-0.5 h-3.5 w-3.5 shrink-0" />}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="border-border bg-surface text-muted flex items-center gap-4 border-t px-4 py-2.5 text-xs">
                <span className="flex items-center gap-1.5">
                  <kbd className="border-border bg-background rounded-md border px-1.5 py-0.5">
                    ↵
                  </kbd>
                  Selecionar
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="border-border bg-background rounded-md border px-1.5 py-0.5">
                    ↑↓
                  </kbd>
                  Navegar
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="border-border bg-background rounded-md border px-1.5 py-0.5">
                    Esc
                  </kbd>
                  Fechar
                </span>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
