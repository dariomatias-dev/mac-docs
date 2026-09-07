import { expect, test } from "@playwright/test";

test("responses carry the expected security headers", async ({ request }) => {
  const res = await request.get("/");
  const headers = res.headers();

  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["strict-transport-security"]).toContain("max-age=");
  expect(headers["permissions-policy"]).toContain("camera=()");

  const csp = headers["content-security-policy"];
  expect(csp).toBeTruthy();
  expect(csp).toContain("default-src 'self'");
  expect(csp).toContain("object-src 'none'");
  expect(csp).toContain("frame-ancestors 'none'");
  // Only youtube-nocookie may be framed in, for the YouTube embed component.
  expect(csp).toContain("frame-src https://www.youtube-nocookie.com");
});

test("the security headers apply to every route, not just the homepage", async ({ request }) => {
  const res = await request.get("/docs/matematica-discreta/matrizes/operacoes");
  expect(res.headers()["content-security-policy"]).toBeTruthy();
  expect(res.headers()["x-frame-options"]).toBe("DENY");
});
