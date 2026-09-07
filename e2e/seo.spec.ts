import { expect, test } from "@playwright/test";

test("sitemap.xml lists documentation pages with the expected content type", async ({
  request,
}) => {
  const res = await request.get("/sitemap.xml");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("xml");

  const body = await res.text();
  expect(body).toContain("<urlset");
  expect(body).toContain("/docs/matematica-discreta/matrizes/operacoes");
});

test("robots.txt allows crawling and points at the sitemap", async ({ request }) => {
  const res = await request.get("/robots.txt");
  expect(res.status()).toBe(200);

  const body = await res.text();
  expect(body).toContain("Allow: /");
  // The sitemap URL is built from SITE_URL (the production origin), not the
  // request's own host, so it won't match the local test server's baseURL.
  expect(body).toMatch(/Sitemap: https?:\/\/\S+\/sitemap\.xml/);
});

test("search-index.json returns the full search index", async ({ request }) => {
  const res = await request.get("/search-index.json");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("application/json");

  const index = await res.json();
  expect(Array.isArray(index)).toBe(true);
  expect(index.length).toBeGreaterThan(0);
  expect(index[0]).toHaveProperty("href");
});

test("the og route renders a social preview image", async ({ request }) => {
  const res = await request.get("/og");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("image/");
});
