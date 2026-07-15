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

    await cleanupOrphanAnnotations("some/other-page");

    expect(localStorage.getItem("annotations:foo/bar")).not.toBeNull();
    expect(localStorage.getItem("annotations:deleted/page")).toBeNull();
  });

  it("never removes the currently viewed page's annotations, even if it's missing from the index", async () => {
    localStorage.setItem("annotations:foo/bar", JSON.stringify([]));
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => [{ href: "/docs/other" }] }),
    );

    await cleanupOrphanAnnotations("foo/bar");

    expect(localStorage.getItem("annotations:foo/bar")).not.toBeNull();
  });

  it("leaves unrelated localStorage keys untouched", async () => {
    localStorage.setItem("macdocs:recent-searches", JSON.stringify([]));
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => [{ href: "/docs/x" }] }),
    );

    await cleanupOrphanAnnotations("x");

    expect(localStorage.getItem("macdocs:recent-searches")).not.toBeNull();
  });

  it("only runs once per session", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => [{ href: "/docs/x" }] });
    vi.stubGlobal("fetch", fetchMock);

    await cleanupOrphanAnnotations("x");
    await cleanupOrphanAnnotations("x");

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("does nothing when the fetch fails", async () => {
    localStorage.setItem("annotations:foo/bar", JSON.stringify([]));
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

    await cleanupOrphanAnnotations("some/other-page");

    expect(localStorage.getItem("annotations:foo/bar")).not.toBeNull();
  });

  it("does nothing when the index comes back empty (stale/broken fetch guard)", async () => {
    localStorage.setItem("annotations:foo/bar", JSON.stringify([]));
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => [] }));

    await cleanupOrphanAnnotations("some/other-page");

    expect(localStorage.getItem("annotations:foo/bar")).not.toBeNull();
  });
});
