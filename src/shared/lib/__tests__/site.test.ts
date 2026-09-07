import { afterEach, describe, expect, it, vi } from "vitest";

describe("site", () => {
  const original = process.env.NEXT_PUBLIC_SITE_URL;

  afterEach(() => {
    if (original === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
    else process.env.NEXT_PUBLIC_SITE_URL = original;
    vi.resetModules();
  });

  it("derives SITE_URL from the environment", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";
    vi.resetModules();

    const { SITE_URL } = await import("../site");
    expect(SITE_URL).toBe("https://example.com");
  });

  it("falls back to the default site URL when unset", async () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    vi.resetModules();

    const { SITE_URL } = await import("../site");
    expect(SITE_URL).toBe("https://mac-docs.vercel.app");
  });

  it("exposes fixed site name and description constants", async () => {
    const { SITE_NAME, SITE_DESCRIPTION } = await import("../site");
    expect(SITE_NAME).toBe("mac-docs");
    expect(SITE_DESCRIPTION).toBe("Documentação interativa de Matemática Aplicada à Computação.");
  });
});
