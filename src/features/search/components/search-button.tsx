"use client";

import { Search } from "lucide-react";

import { SEARCH_OPEN_EVENT } from "../lib/search-shared";

export function SearchButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(SEARCH_OPEN_EVENT))}
      aria-label="Buscar"
      className="text-muted-2 hover:bg-surface-2 hover:text-foreground rounded-control flex h-9 w-9 cursor-pointer items-center justify-center transition-colors"
    >
      <Search className="h-4.5 w-4.5" />
    </button>
  );
}
