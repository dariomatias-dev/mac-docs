import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { clearRecents, fetchSearchIndex, loadRecents, pushRecent } from "../search-shared";

describe("fetchSearchIndex", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("returns the parsed JSON index on a successful fetch", async () => {
    const items = [{ title: "Matrizes", href: "/docs/a", section: "Matrizes", text: "..." }];
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(items) }),
    );

    await expect(fetchSearchIndex()).resolves.toEqual(items);
  });

  it("throws with the status code when the response isn't ok", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 404 }));

    await expect(fetchSearchIndex()).rejects.toThrow("Failed to fetch search index: 404");
  });
});

describe("recent searches", () => {
  const item = { title: "Matrizes", href: "/docs/a", section: "Matrizes" };

  beforeEach(() => localStorage.clear());

  it("returns an empty list when nothing is stored", () => {
    expect(loadRecents()).toEqual([]);
  });

  it("pushes an item and reads it back, most recent first", () => {
    pushRecent(item);
    pushRecent({ title: "Conjuntos", href: "/docs/b", section: "Conjuntos" });

    expect(loadRecents()).toEqual([
      { title: "Conjuntos", href: "/docs/b", section: "Conjuntos" },
      item,
    ]);
  });

  it("moves an already-recent item to the front instead of duplicating it", () => {
    pushRecent(item);
    pushRecent({ title: "Conjuntos", href: "/docs/b", section: "Conjuntos" });
    pushRecent(item);

    expect(loadRecents()).toEqual([
      item,
      { title: "Conjuntos", href: "/docs/b", section: "Conjuntos" },
    ]);
  });

  it("caps the list at 6 entries", () => {
    for (let i = 0; i < 8; i++) {
      pushRecent({ title: `Page ${i}`, href: `/docs/${i}`, section: "Sec" });
    }
    const recents = loadRecents();
    expect(recents).toHaveLength(6);
    expect(recents[0].href).toBe("/docs/7");
  });

  it("clears every stored recent", () => {
    pushRecent(item);
    clearRecents();
    expect(loadRecents()).toEqual([]);
  });

  it("ignores malformed JSON in storage", () => {
    localStorage.setItem("macdocs:recent-searches", "{not json");
    expect(loadRecents()).toEqual([]);
  });

  it("ignores a stored value that isn't an array", () => {
    localStorage.setItem("macdocs:recent-searches", JSON.stringify({ not: "an array" }));
    expect(loadRecents()).toEqual([]);
  });

  it("filters out entries missing a required field", () => {
    localStorage.setItem(
      "macdocs:recent-searches",
      JSON.stringify([item, { title: "Incomplete" }]),
    );
    expect(loadRecents()).toEqual([item]);
  });
});
