import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { cleanupOrphanAnnotations } from "../cleanup-orphan-annotations";

describe("cleanupOrphanAnnotations", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("removes annotations for slugs no longer present in the search index", async () => {
    localStorage.setItem("annotations:foo/bar", JSON.stringify([]));
    localStorage.setItem("annotations:deleted/page", JSON.stringify([]));
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [{ title: "Bar", href: "/docs/foo/bar", section: "Foo", text: "" }],
      }),
    );

    await cleanupOrphanAnnotations();

    expect(localStorage.getItem("annotations:foo/bar")).not.toBeNull();
    expect(localStorage.getItem("annotations:deleted/page")).toBeNull();
  });

  it("leaves unrelated localStorage keys untouched", async () => {
    localStorage.setItem("macdocs:recent-searches", JSON.stringify([]));
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => [] }));

    await cleanupOrphanAnnotations();

    expect(localStorage.getItem("macdocs:recent-searches")).not.toBeNull();
  });

  it("only runs once per session", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => [] });
    vi.stubGlobal("fetch", fetchMock);

    await cleanupOrphanAnnotations();
    await cleanupOrphanAnnotations();

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("does nothing when the fetch fails", async () => {
    localStorage.setItem("annotations:foo/bar", JSON.stringify([]));
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

    await cleanupOrphanAnnotations();

    expect(localStorage.getItem("annotations:foo/bar")).not.toBeNull();
  });
});
