import { expect, test } from "@playwright/test";

const DOC = "/docs/matematica-discreta/matrizes/operacoes";

test("navigates through the sidebar", async ({ page }) => {
  await page.goto(DOC);
  await page.getByRole("link", { name: "Matrizes booleanas", exact: true }).click();
  await expect(page).toHaveURL(/matrizes-booleanas$/);
  await expect(page.getByRole("heading", { level: 1, name: "Matrizes booleanas" })).toBeVisible();
});

test("shows a breadcrumb trail with links back to the course and section", async ({ page }) => {
  await page.goto(DOC);
  const breadcrumb = page.getByRole("navigation", { name: "Breadcrumb" });
  await expect(breadcrumb).toBeVisible();
  // The course itself isn't a link (there's no course landing page to send
  // it to), only the group crumb below it is.
  await expect(breadcrumb.getByText("Matemática Discreta")).toBeVisible();

  await breadcrumb.getByRole("link", { name: "Matrizes" }).click();
  await expect(page).toHaveURL(/\/docs\/matematica-discreta\/matrizes$/);
});

test("links to the previous and next page in reading order", async ({ page }) => {
  await page.goto(DOC);
  const nextLink = page.getByRole("link", { name: /^Próximo/ });
  await expect(nextLink).toBeVisible();

  await nextLink.click();
  await expect(page.getByRole("link", { name: /^Anterior/ })).toBeVisible();
});

test("collapsing the sidebar persists across a reload", async ({ page }) => {
  await page.goto(DOC);

  await page.getByRole("button", { name: "Recolher barra lateral" }).click();
  await expect(page.getByRole("button", { name: "Abrir barra lateral" })).toBeVisible();

  await page.reload();
  await expect(page.getByRole("button", { name: "Abrir barra lateral" })).toBeVisible();
});

test.describe("mobile table of contents", () => {
  // The mobile TOC is hidden at Tailwind's xl breakpoint (1280px), which is
  // exactly the default desktop viewport width, so this needs its own
  // narrower viewport regardless of which project runs it.
  test.use({ viewport: { width: 600, height: 900 } });

  test("expands to reveal in-page section links", async ({ page }) => {
    await page.goto(DOC);
    const toggle = page.getByRole("button", { name: "Neste artigo" });
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("a[href^='#']").first()).toBeVisible();
  });
});

test("the edit-page link points at the file on GitHub", async ({ page }) => {
  await page.goto(DOC);
  const link = page.getByRole("link", { name: /editar esta página no github/i });
  await expect(link).toHaveAttribute(
    "href",
    /github\.com\/.+\/edit\/.+content\/matematica-discreta\/matrizes\/operacoes\.mdx$/,
  );
  await expect(link).toHaveAttribute("target", "_blank");
});
