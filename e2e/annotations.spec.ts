import { expect, test } from "@playwright/test";

const DOC = "/docs/matematica-discreta/matrizes/operacoes";

test("creates a note and sees it reflected in the floating button's count", async ({ page }) => {
  await page.goto(DOC);
  await page.getByRole("button", { name: "Abrir anotações" }).click();

  await page.getByPlaceholder("Escreva uma anotação sobre esta página...").fill("primeira nota");
  await page.getByRole("button", { name: "Adicionar", exact: true }).click();

  await expect(page.getByText("primeira nota")).toBeVisible();
  await page.getByRole("button", { name: "Fechar anotações" }).click();
  await expect(page.getByRole("button", { name: "Abrir anotações" })).toContainText("1");
});

test("edits a note", async ({ page }) => {
  await page.goto(DOC);
  await page.getByRole("button", { name: "Abrir anotações" }).click();
  await page.getByPlaceholder("Escreva uma anotação sobre esta página...").fill("nota original");
  await page.getByRole("button", { name: "Adicionar", exact: true }).click();

  await page.getByRole("button", { name: "Editar anotação" }).click();
  // The edit textarea has no placeholder of its own; it autofocuses instead
  // (NoteForm's focusOnMount), so target whichever textarea currently has
  // focus rather than guessing at a selector.
  const editField = page.locator("textarea:focus");
  await editField.fill("nota editada");
  await page.getByRole("button", { name: "Salvar" }).click();

  await expect(page.getByText("nota editada")).toBeVisible();
  await expect(page.getByText("nota original")).not.toBeVisible();
});

test("filters notes by search and sorts them", async ({ page }) => {
  await page.goto(DOC);
  await page.getByRole("button", { name: "Abrir anotações" }).click();
  const field = page.getByPlaceholder("Escreva uma anotação sobre esta página...");
  const add = page.getByRole("button", { name: "Adicionar", exact: true });

  await field.fill("sobre gatos");
  await add.click();
  await field.fill("sobre cachorros");
  await add.click();

  await page.getByPlaceholder("Buscar anotações...").fill("gatos");
  await expect(page.getByText("sobre gatos")).toBeVisible();
  await expect(page.getByText("sobre cachorros")).not.toBeVisible();

  await page.getByPlaceholder("Buscar anotações...").fill("");
  await page.getByRole("button", { name: /ordenar por mais antigas primeiro/i }).click();
  // Scope to the annotations panel: the sidebar is also an <aside> with its
  // own list items, but only the panel marks itself aria-hidden="false".
  const notes = page.locator('aside[aria-hidden="false"]').getByRole("listitem");
  await expect(notes.first()).toContainText("sobre gatos");
});

test("removes a note with an undo option", async ({ page }) => {
  await page.goto(DOC);
  await page.getByRole("button", { name: "Abrir anotações" }).click();
  await page.getByPlaceholder("Escreva uma anotação sobre esta página...").fill("nota removível");
  await page.getByRole("button", { name: "Adicionar", exact: true }).click();

  await page.getByRole("button", { name: "Remover anotação" }).click();
  await expect(page.getByText("nota removível")).not.toBeVisible();
  await expect(page.getByText(/anotação removida/i)).toBeVisible();

  await page.getByRole("button", { name: "Desfazer" }).click();
  await expect(page.getByText("nota removível")).toBeVisible();
});

test("persists notes across a reload", async ({ page }) => {
  await page.goto(DOC);
  await page.getByRole("button", { name: "Abrir anotações" }).click();
  await page.getByPlaceholder("Escreva uma anotação sobre esta página...").fill("nota persistente");
  await page.getByRole("button", { name: "Adicionar", exact: true }).click();

  await page.reload();
  await page.getByRole("button", { name: "Abrir anotações" }).click();
  await expect(page.getByText("nota persistente")).toBeVisible();
});

test("exports notes as a downloaded JSON file", async ({ page }) => {
  await page.goto(DOC);
  await page.getByRole("button", { name: "Abrir anotações" }).click();
  await page.getByPlaceholder("Escreva uma anotação sobre esta página...").fill("nota exportada");
  await page.getByRole("button", { name: "Adicionar", exact: true }).click();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Exportar anotações" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^annotations-.*\.json$/);
});
