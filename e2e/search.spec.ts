import { expect, test } from "@playwright/test";

test("opens search with the keyboard and finds a page", async ({ page }) => {
  await page.goto("/");
  await page.locator("body").press("Control+k");
  const input = page.getByPlaceholder("Buscar na documentação…");
  await expect(input).toBeVisible();
  await input.fill("conjuntos");
  await page.getByRole("button").filter({ hasText: "Conjuntos" }).first().click();
  await expect(page).toHaveURL(/\/docs\//);
});

test("navigates results with the keyboard and opens the highlighted one", async ({ page }) => {
  await page.goto("/");
  await page.locator("body").press("Control+k");
  const input = page.getByPlaceholder("Buscar na documentação…");
  await input.fill("matrizes");

  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");

  await expect(page).toHaveURL(/\/docs\//);
  await expect(input).not.toBeVisible();
});

test("closes on Escape without navigating", async ({ page }) => {
  await page.goto("/");
  await page.locator("body").press("Control+k");
  const input = page.getByPlaceholder("Buscar na documentação…");
  await expect(input).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(input).not.toBeVisible();
  await expect(page).toHaveURL("/");
});

test("shows a no-results message for a query that matches nothing", async ({ page }) => {
  await page.goto("/");
  await page.locator("body").press("Control+k");
  await page.getByPlaceholder("Buscar na documentação…").fill("xyzxyzxyz-inexistente");

  await expect(page.getByText(/nenhum resultado/i)).toBeVisible();
});

test("clearing the query with the clear button restores the full list", async ({ page }) => {
  await page.goto("/");
  await page.locator("body").press("Control+k");
  const input = page.getByPlaceholder("Buscar na documentação…");
  await input.fill("xyzxyzxyz-inexistente");
  await expect(page.getByText(/nenhum resultado/i)).toBeVisible();

  await page.getByRole("button", { name: "Limpar busca" }).click();
  await expect(input).toHaveValue("");
  await expect(page.getByText(/nenhum resultado/i)).not.toBeVisible();
});
