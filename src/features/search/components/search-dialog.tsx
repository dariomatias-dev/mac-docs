"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import Fuse, { type FuseResultMatch } from "fuse.js";
import { Clock, CornerDownLeft, FileText, Search, X } from "lucide-react";

import {
  SEARCH_OPEN_EVENT,
  type RecentItem,
  type SearchItem,
  clearRecents,
  loadRecents,
  pushRecent,
} from "../lib/search-shared";

type Range = readonly [number, number];

type Display = SearchItem & {
  titleRanges: readonly Range[];
  textRanges: readonly Range[];
};

const RECENTS_SECTION = "Buscas recentes";

// Split text into plain/marked nodes from Fuse match indices (inclusive ranges).
function highlight(text: string, ranges: readonly Range[], markClass: string) {
  if (!ranges.length) return text;
  const sorted = [...ranges].sort((a, b) => a[0] - b[0]);
  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  sorted.forEach(([start, end], i) => {
    if (start < cursor) return;
    if (start > cursor) nodes.push(text.slice(cursor, start));
    nodes.push(
      <mark key={i} className={markClass}>
        {text.slice(start, end + 1)}
      </mark>,
    );
    cursor = end + 1;
  });
  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}

function findMatch(matches: readonly FuseResultMatch[] | undefined, key: string): readonly Range[] {
  return (matches?.find((m) => m.key === key)?.indices as readonly Range[] | undefined) ?? [];
}

function Snippet({ text, ranges }: { text: string; ranges: readonly Range[] }) {
  if (!ranges.length) return null;
  const [start, end] = ranges[0];
  const from = Math.max(0, start - 40);
  const to = Math.min(text.length, end + 90);
  const windowRanges = ranges
    .filter(([s]) => s >= from && s <= to)
    .map(([s, e]) => [s - from, e - from] as Range);
  return (
    <span className="text-muted mt-0.5 line-clamp-1 text-xs">
      {from > 0 && "…"}
      {highlight(
        text.slice(from, to),
        windowRanges,
        "bg-accent-soft text-accent rounded px-0.5 font-medium",
      )}
      {to < text.length && "…"}
    </span>
  );
}

export function SearchDialog({ items }: { items: SearchItem[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [recents, setRecents] = useState<RecentItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: [
          { name: "title", weight: 3 },
          { name: "section", weight: 1 },
          { name: "text", weight: 1 },
        ],
        includeMatches: true,
        ignoreLocation: true,
        threshold: 0.4,
        minMatchCharLength: 2,
      }),
    [items],
  );

  const displayed = useMemo<Display[]>(() => {
    const q = query.trim();

    if (!q) {
      if (recents.length) {
        return recents.map((r) => ({
          ...r,
          text: "",
          section: RECENTS_SECTION,
          titleRanges: [],
          textRanges: [],
        }));
      }
      return items.slice(0, 8).map((item) => ({ ...item, titleRanges: [], textRanges: [] }));
    }

    return fuse.search(q, { limit: 12 }).map(({ item, matches }) => ({
      ...item,
      titleRanges: findMatch(matches, "title"),
      textRanges: findMatch(matches, "text"),
    }));
  }, [fuse, items, query, recents]);

  const showingRecents = !query.trim() && recents.length > 0;

  const groups = useMemo(() => {
    const map = new Map<string, Display[]>();
    for (const item of displayed) {
      if (!map.has(item.section)) map.set(item.section, []);
      map.get(item.section)!.push(item);
    }
    return [...map.entries()];
  }, [displayed]);

  const openDialog = useCallback(() => {
    setOpen(true);
    setQuery("");
    setActiveIndex(0);
    setRecents(loadRecents());
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

  function go(item: Display) {
    setRecents(pushRecent({ title: item.title, href: item.href, section: item.section }));
    setOpen(false);
    router.push(item.href);
  }

  function onQueryChange(value: string) {
    setQuery(value);
    setActiveIndex(0);
  }

  function onInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, displayed.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && displayed[activeIndex]) {
      go(displayed[activeIndex]);
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
                {displayed.length === 0 && (
                  <p className="text-muted px-3 py-6 text-center text-sm">Nenhum resultado.</p>
                )}
                {groups.map(([section, sectionItems]) => (
                  <div key={section} className="mb-2 last:mb-0">
                    <div className="flex items-center justify-between px-2.5 py-1.5">
                      <p className="text-muted text-[11px] font-semibold tracking-wide uppercase">
                        {section}
                      </p>
                      {showingRecents && section === RECENTS_SECTION && (
                        <button
                          type="button"
                          onClick={() => setRecents(clearRecents())}
                          className="text-muted hover:text-foreground cursor-pointer text-[11px] font-medium transition-colors"
                        >
                          Limpar
                        </button>
                      )}
                    </div>
                    <ul>
                      {sectionItems.map((item) => {
                        const i = displayed.indexOf(item);
                        const active = i === activeIndex;
                        const RowIcon = showingRecents ? Clock : FileText;
                        return (
                          <li key={item.href}>
                            <button
                              type="button"
                              onClick={() => go(item)}
                              onMouseEnter={() => setActiveIndex(i)}
                              className={`flex w-full cursor-pointer items-start gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                                active ? "bg-accent text-accent-foreground" : "text-foreground"
                              }`}
                            >
                              <RowIcon
                                className={`mt-0.5 h-4 w-4 shrink-0 ${active ? "" : "text-muted"}`}
                              />
                              <span className="flex min-w-0 flex-1 flex-col">
                                <span className="truncate font-medium">
                                  {highlight(
                                    item.title,
                                    item.titleRanges,
                                    "bg-transparent font-semibold underline decoration-2 underline-offset-2",
                                  )}
                                </span>
                                {!active && <Snippet text={item.text} ranges={item.textRanges} />}
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
