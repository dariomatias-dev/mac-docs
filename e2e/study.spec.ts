import { expect, test } from "@playwright/test";

test("reveals an exercise's answer on click", async ({ page }) => {
  await page.goto("/docs/matematica-discreta/matrizes/matriz-inversa");
  const toggle = page.getByRole("button", { name: "Ver resposta" }).first();
  await toggle.click();
  await expect(page.getByRole("button", { name: "Ocultar resposta" }).first()).toBeVisible();
});

test("reveals a proof's resolution on click", async ({ page }) => {
  await page.goto("/docs/matematica-discreta/tecnicas-de-demonstracao/recursao");
  const toggle = page.getByRole("button", { name: "Ver resolução" }).first();
  await toggle.click();
  await expect(page.getByRole("button", { name: "Ocultar resolução" }).first()).toBeVisible();
});

test("the matrix calculator recomputes as matrices are edited", async ({ page }) => {
  await page.goto("/docs/matematica-discreta/matrizes/operacoes");
  await expect(page.getByRole("button", { name: "Adicionar matriz" })).toBeVisible();

  const before = await page.locator(".font-mono.text-xs").first().textContent();
  await page.getByRole("spinbutton", { name: "Elemento linha 1, coluna 1" }).first().fill("50");
  await expect(page.locator(".font-mono.text-xs").first()).not.toHaveText(before ?? "");
});

test("the set calculator switches operations", async ({ page }) => {
  await page.goto("/docs/matematica-discreta/conjuntos/operacoes-com-conjuntos");
  await expect(page.getByText("{ 1, 2, 3, 4, 5, 6 }")).toBeVisible();

  await page.getByRole("button", { name: "A ∩ B" }).click();
  await expect(page.getByText("{ 3, 4 }")).toBeVisible();
});

test("step-by-step reveals steps one at a time and can restart", async ({ page }) => {
  await page.goto("/docs/matematica-discreta/matrizes/matriz-inversa");
  const nextStep = page.getByRole("button", { name: "Próximo passo" }).first();
  await expect(nextStep).toBeVisible();

  await nextStep.click();
  await expect(page.getByRole("button", { name: "Recomeçar" }).first()).toBeVisible();
});
