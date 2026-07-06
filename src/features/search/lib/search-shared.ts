export const SEARCH_OPEN_EVENT = "macdocs:search-open";

/** Static JSON artifact holding the search index, fetched lazily on first open. */
export const SEARCH_INDEX_URL = "/search-index.json";

export type SearchItem = {
  title: string;
  href: string;
  section: string;
  text: string;
};

export type RecentItem = Pick<SearchItem, "title" | "href" | "section">;

const RECENTS_KEY = "macdocs:recent-searches";
const RECENTS_MAX = 6;

export function loadRecents(): RecentItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENTS_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (r): r is RecentItem =>
        typeof r?.title === "string" &&
        typeof r?.href === "string" &&
        typeof r?.section === "string",
    );
  } catch {
    return [];
  }
}

export function pushRecent(item: RecentItem): RecentItem[] {
  const next = [item, ...loadRecents().filter((r) => r.href !== item.href)].slice(0, RECENTS_MAX);
  try {
    window.localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
  } catch {
    // ignore storage failures (private mode, quota)
  }
  return next;
}

export function clearRecents(): RecentItem[] {
  try {
    window.localStorage.removeItem(RECENTS_KEY);
  } catch {
    // ignore
  }
  return [];
}
