import { expect, test } from "@playwright/test";

const DOC = "/docs/matematica-discreta/matrizes/operacoes";

test("renders a documentation page", async ({ page }) => {
  const res = await page.goto(DOC);
  expect(res?.status()).toBe(200);
  await expect(
    page.getByRole("heading", { level: 1, name: "Operações com matrizes" }),
  ).toBeVisible();
});

test("navigates through the sidebar", async ({ page }) => {
  await page.goto(DOC);
  await page.getByRole("link", { name: "Matrizes booleanas", exact: true }).click();
  await expect(page).toHaveURL(/matrizes-booleanas$/);
  await expect(page.getByRole("heading", { level: 1, name: "Matrizes booleanas" })).toBeVisible();
});

test("toggles the color theme", async ({ page }) => {
  await page.goto("/");
  const html = page.locator("html");
  const wasDark = await html.evaluate((el) => el.classList.contains("dark"));
  await page.getByRole("button", { name: "Alternar tema" }).click();
  await expect.poll(() => html.evaluate((el) => el.classList.contains("dark"))).toBe(!wasDark);
});

test("opens search with the keyboard and finds a page", async ({ page }) => {
  await page.goto("/");
  await page.locator("body").press("Control+k");
  const input = page.getByPlaceholder("Buscar na documentação…");
  await expect(input).toBeVisible();
  await input.fill("conjuntos");
  await page.getByRole("button").filter({ hasText: "Conjuntos" }).first().click();
  await expect(page).toHaveURL(/\/docs\//);
});

test("shows the custom 404 page", async ({ page }) => {
  const res = await page.goto("/docs/nao-existe");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Página não encontrada" })).toBeVisible();
});
