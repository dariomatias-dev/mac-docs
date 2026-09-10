import { describe, expect, it, vi } from "vitest";

import type { SearchItem } from "@/features/search";

const stubIndex: SearchItem[] = [{ title: "Matrizes", href: "/docs/x", section: "X", text: "" }];

vi.mock("@/features/search", () => ({ getSearchIndex: () => stubIndex }));

import { GET } from "../route";

describe("GET /search-index.json", () => {
  it("responds with the search index as JSON", async () => {
    const response = GET();

    expect(response.headers.get("content-type")).toContain("application/json");
    await expect(response.json()).resolves.toEqual(stubIndex);
  });
});
