"use client";

import { Search } from "lucide-react";

import { SEARCH_OPEN_EVENT } from "../lib/search-shared";

export function SearchButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(SEARCH_OPEN_EVENT))}
      className="bg-surface-2 text-muted hover:bg-surface-2/70 flex w-full items-center gap-2 rounded-full px-5 py-2.5 transition-colors"
    >
      <Search className="h-4 w-4 shrink-0" />
      <span className="flex-1 text-left text-[0.8125rem] font-semibold">Buscar</span>
    </button>
  );
}
