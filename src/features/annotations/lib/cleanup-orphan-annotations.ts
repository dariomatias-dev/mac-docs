import { SEARCH_INDEX_URL, type SearchItem } from "@/features/search/lib/search-shared";

const KEY_PREFIX = "annotations:";
const SESSION_FLAG = "macdocs:annotations-cleanup-done";

function slugFromHref(href: string): string {
  return href.replace(/^\/docs\//, "").replace(/\/$/, "");
}

/**
 * Removes `annotations:<slug>` localStorage entries for pages that no
 * longer exist (renamed/deleted docs), so notes don't pile up forever.
 * Runs at most once per browser session. Never touches `currentSlug` (the
 * page being viewed) and bails out entirely if the fetched index looks
 * empty/broken, since a stale or failed fetch must not wipe real notes.
 */
export async function cleanupOrphanAnnotations(currentSlug: string): Promise<void> {
  if (typeof window === "undefined") return;
  if (window.sessionStorage.getItem(SESSION_FLAG)) return;
  window.sessionStorage.setItem(SESSION_FLAG, "1");

  try {
    const res = await fetch(SEARCH_INDEX_URL);
    if (!res.ok) return;
    const index = (await res.json()) as SearchItem[];
    if (index.length === 0) return;
    const validSlugs = new Set(index.map((item) => slugFromHref(item.href)));

    for (const key of Object.keys(window.localStorage)) {
      if (!key.startsWith(KEY_PREFIX)) continue;
      const slug = key.slice(KEY_PREFIX.length);
      if (slug === currentSlug) continue;
      if (!validSlugs.has(slug)) window.localStorage.removeItem(key);
    }
  } catch (err) {
    console.error("cleanupOrphanAnnotations: failed", err);
  }
}
