import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { fetchSearchIndexMock } = vi.hoisted(() => ({ fetchSearchIndexMock: vi.fn() }));
vi.mock("@/features/search/lib/search-shared", () => ({
  fetchSearchIndex: fetchSearchIndexMock,
}));

import { AnnotationsListPage } from "../annotations-list-page";

const KEY_PREFIX = "annotations:";

function seed(slug: string, notes: { id: string; note: string; createdAt: number }[]) {
  localStorage.setItem(`${KEY_PREFIX}${slug}`, JSON.stringify(notes));
}

describe("AnnotationsListPage", () => {
  beforeEach(() => {
    localStorage.clear();
    fetchSearchIndexMock.mockResolvedValue([]);
  });

  it("shows the empty state when there are no stored annotations", async () => {
    render(<AnnotationsListPage />);
    expect(await screen.findByText(/nenhuma anotação ainda/i)).toBeInTheDocument();
  });

  it("ignores malformed and empty localStorage entries", async () => {
    localStorage.setItem(`${KEY_PREFIX}broken`, "{not json");
    localStorage.setItem(`${KEY_PREFIX}empty-array`, "[]");
    localStorage.setItem("unrelated-key", "[1,2,3]");

    render(<AnnotationsListPage />);

    expect(await screen.findByText(/nenhuma anotação ainda/i)).toBeInTheDocument();
  });

  it("counts annotations and pages, with correct singular/plural forms", async () => {
    seed("a", [{ id: "1", note: "nota a", createdAt: Date.now() }]);
    seed("b", [
      { id: "2", note: "nota b1", createdAt: Date.now() },
      { id: "3", note: "nota b2", createdAt: Date.now() },
    ]);
    fetchSearchIndexMock.mockResolvedValue([
      { title: "Página A", href: "/docs/a", section: "Curso" },
      { title: "Página B", href: "/docs/b", section: "Curso" },
    ]);

    render(<AnnotationsListPage />);

    expect(await screen.findByText("3 anotações em 2 páginas")).toBeInTheDocument();
  });

  it("shows the singular form for exactly one annotation on one page", async () => {
    seed("a", [{ id: "1", note: "nota a", createdAt: Date.now() }]);
    fetchSearchIndexMock.mockResolvedValue([
      { title: "Página A", href: "/docs/a", section: "Curso" },
    ]);

    render(<AnnotationsListPage />);

    expect(await screen.findByText("1 anotação em 1 página")).toBeInTheDocument();
  });

  it("resolves a stored slug against the search index to show the page title and a link", async () => {
    seed("a", [{ id: "1", note: "nota a", createdAt: Date.now() }]);
    fetchSearchIndexMock.mockResolvedValue([
      { title: "Página A", href: "/docs/a", section: "Curso" },
    ]);

    render(<AnnotationsListPage />);

    const link = await screen.findByRole("link", { name: "Página A" });
    expect(link).toHaveAttribute("href", "/docs/a");
    expect(screen.getByText("Curso")).toBeInTheDocument();
  });

  it("shows a page as removed when its slug isn't in the search index", async () => {
    seed("gone", [{ id: "1", note: "nota", createdAt: Date.now() }]);

    render(<AnnotationsListPage />);

    expect(await screen.findByText("Página removida")).toBeInTheDocument();
    expect(screen.getByText("gone")).toBeInTheDocument();
  });

  it("still renders when the search index fails to load, as all-removed", async () => {
    seed("a", [{ id: "1", note: "nota", createdAt: Date.now() }]);
    fetchSearchIndexMock.mockRejectedValue(new Error("network down"));

    render(<AnnotationsListPage />);

    expect(await screen.findByText("Página removida")).toBeInTheDocument();
  });

  it("lists matched pages before removed pages, alphabetically among themselves", async () => {
    seed("z-page", [{ id: "1", note: "n1", createdAt: Date.now() }]);
    seed("gone", [{ id: "2", note: "n2", createdAt: Date.now() }]);
    seed("a-page", [{ id: "3", note: "n3", createdAt: Date.now() }]);
    fetchSearchIndexMock.mockResolvedValue([
      { title: "Zeta", href: "/docs/z-page", section: "Curso" },
      { title: "Alfa", href: "/docs/a-page", section: "Curso" },
    ]);

    render(<AnnotationsListPage />);
    await screen.findByText("Página removida");

    const headings = screen.getAllByRole("link").map((el) => el.textContent);
    expect(headings).toEqual(["Alfa", "Zeta"]);
  });

  it("edits a note and persists the change to localStorage", async () => {
    seed("a", [{ id: "1", note: "nota original", createdAt: Date.now() }]);
    fetchSearchIndexMock.mockResolvedValue([
      { title: "Página A", href: "/docs/a", section: "Curso" },
    ]);

    render(<AnnotationsListPage />);
    await screen.findByText("nota original");

    await userEvent.click(screen.getByRole("button", { name: "Editar anotação" }));
    const textarea = screen.getByDisplayValue("nota original");
    await userEvent.clear(textarea);
    await userEvent.type(textarea, "nota editada");
    await userEvent.click(screen.getByRole("button", { name: "Salvar" }));

    expect(screen.getByText("nota editada")).toBeInTheDocument();
    const stored = JSON.parse(localStorage.getItem(`${KEY_PREFIX}a`)!);
    expect(stored[0].note).toBe("nota editada");
    expect(stored[0].updatedAt).toBeTypeOf("number");
  });

  it("cancels editing a note without saving the change", async () => {
    seed("a", [{ id: "1", note: "nota original", createdAt: Date.now() }]);
    fetchSearchIndexMock.mockResolvedValue([
      { title: "Página A", href: "/docs/a", section: "Curso" },
    ]);

    render(<AnnotationsListPage />);
    await screen.findByText("nota original");

    await userEvent.click(screen.getByRole("button", { name: "Editar anotação" }));
    const textarea = screen.getByDisplayValue("nota original");
    await userEvent.clear(textarea);
    await userEvent.type(textarea, "rascunho descartado");
    await userEvent.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(screen.getByText("nota original")).toBeInTheDocument();
    expect(screen.queryByText("rascunho descartado")).not.toBeInTheDocument();
    const stored = JSON.parse(localStorage.getItem(`${KEY_PREFIX}a`)!);
    expect(stored[0].note).toBe("nota original");
  });

  it("leaves other pages' notes untouched when editing one page's note", async () => {
    seed("a", [{ id: "1", note: "nota a", createdAt: Date.now() }]);
    seed("b", [{ id: "2", note: "nota b", createdAt: Date.now() }]);
    fetchSearchIndexMock.mockResolvedValue([
      { title: "Página A", href: "/docs/a", section: "Curso" },
      { title: "Página B", href: "/docs/b", section: "Curso" },
    ]);

    render(<AnnotationsListPage />);
    await screen.findByText("nota a");

    const groupA = screen.getByText("Página A").closest("div")!.parentElement!.parentElement!;
    await userEvent.click(within(groupA).getByRole("button", { name: "Editar anotação" }));
    const textarea = within(groupA).getByDisplayValue("nota a");
    await userEvent.clear(textarea);
    await userEvent.type(textarea, "nota a editada");
    await userEvent.click(within(groupA).getByRole("button", { name: "Salvar" }));

    expect(await screen.findByText("nota a editada")).toBeInTheDocument();
    expect(screen.getByText("nota b")).toBeInTheDocument();
    const storedB = JSON.parse(localStorage.getItem(`${KEY_PREFIX}b`)!);
    expect(storedB).toEqual([{ id: "2", note: "nota b", createdAt: expect.any(Number) }]);
  });

  it("removes a single note, deleting the localStorage entry once the group empties", async () => {
    seed("a", [{ id: "1", note: "única nota", createdAt: Date.now() }]);
    fetchSearchIndexMock.mockResolvedValue([
      { title: "Página A", href: "/docs/a", section: "Curso" },
    ]);

    render(<AnnotationsListPage />);
    await screen.findByText("única nota");

    await userEvent.click(screen.getByRole("button", { name: "Remover anotação" }));
    await userEvent.click(screen.getByRole("button", { name: "Remover" }));

    expect(await screen.findByText(/nenhuma anotação ainda/i)).toBeInTheDocument();
    expect(localStorage.getItem(`${KEY_PREFIX}a`)).toBeNull();
  });

  it("keeps sibling notes when removing just one from a group with several", async () => {
    seed("a", [
      { id: "1", note: "primeira", createdAt: Date.now() },
      { id: "2", note: "segunda", createdAt: Date.now() },
    ]);
    fetchSearchIndexMock.mockResolvedValue([
      { title: "Página A", href: "/docs/a", section: "Curso" },
    ]);

    render(<AnnotationsListPage />);
    await screen.findByText("primeira");

    const [firstRemoveButton] = screen.getAllByRole("button", { name: "Remover anotação" });
    await userEvent.click(firstRemoveButton);
    await userEvent.click(screen.getByRole("button", { name: "Remover" }));

    await waitFor(() => expect(screen.queryByText("primeira")).not.toBeInTheDocument());
    expect(screen.getByText("segunda")).toBeInTheDocument();
    const stored = JSON.parse(localStorage.getItem(`${KEY_PREFIX}a`)!);
    expect(stored).toHaveLength(1);
    expect(stored[0].note).toBe("segunda");
  });

  it("removes an entire page's group at once", async () => {
    seed("a", [{ id: "1", note: "nota a", createdAt: Date.now() }]);
    seed("b", [{ id: "2", note: "nota b", createdAt: Date.now() }]);
    fetchSearchIndexMock.mockResolvedValue([
      { title: "Página A", href: "/docs/a", section: "Curso" },
      { title: "Página B", href: "/docs/b", section: "Curso" },
    ]);

    render(<AnnotationsListPage />);
    await screen.findByText("nota a");

    const groupA = screen.getByText("Página A").closest("div")!.parentElement!.parentElement!;
    await userEvent.click(
      within(groupA).getByRole("button", { name: "Remover todas as anotações desta página" }),
    );
    await userEvent.click(within(groupA).getByRole("button", { name: "Remover" }));

    await waitFor(() => expect(screen.queryByText("Página A")).not.toBeInTheDocument());
    expect(screen.getByText("Página B")).toBeInTheDocument();
    expect(localStorage.getItem(`${KEY_PREFIX}a`)).toBeNull();
    expect(localStorage.getItem(`${KEY_PREFIX}b`)).not.toBeNull();
  });
});
