import { afterEach, describe, expect, it, vi } from "vitest";

describe("env", () => {
  const original = process.env.NEXT_PUBLIC_SITE_URL;

  afterEach(() => {
    if (original === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
    else process.env.NEXT_PUBLIC_SITE_URL = original;
    vi.resetModules();
  });

  it("falls back to the default site URL when unset", async () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    vi.resetModules();

    const { env } = await import("../env");
    expect(env.NEXT_PUBLIC_SITE_URL).toBe("https://mac-docs.vercel.app");
  });

  it("accepts a valid custom URL", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";
    vi.resetModules();

    const { env } = await import("../env");
    expect(env.NEXT_PUBLIC_SITE_URL).toBe("https://example.com");
  });

  it("throws a clear error when the value isn't a valid URL", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "not-a-url";
    vi.resetModules();

    await expect(import("../env")).rejects.toThrow("Invalid environment variables");
  });
});
