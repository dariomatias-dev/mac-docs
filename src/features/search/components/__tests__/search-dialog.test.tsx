import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { pushMock, fetchSearchIndexMock } = vi.hoisted(() => ({
  pushMock: vi.fn(),
  fetchSearchIndexMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: pushMock }) }));
vi.mock("../../lib/search-shared", async (importOriginal) => {
  const actual = await importOriginal<typeof SearchShared>();
  return { ...actual, fetchSearchIndex: fetchSearchIndexMock };
});

import { SEARCH_OPEN_EVENT } from "../../lib/search-shared";
import { SearchDialog } from "../search-dialog";

import type * as SearchShared from "../../lib/search-shared";

const INDEX = [
  { title: "Matrizes", href: "/docs/matrizes", section: "Curso", text: "Operações com matrizes" },
  { title: "Conjuntos", href: "/docs/conjuntos", section: "Curso", text: "Teoria dos conjuntos" },
];

async function openDialog() {
  await userEvent.click(screen.getByRole("button", { name: /buscar/i }));
  await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());
}

describe("SearchDialog", () => {
  beforeEach(() => {
    localStorage.clear();
    pushMock.mockClear();
    fetchSearchIndexMock.mockReset().mockResolvedValue(INDEX);
  });

  it("is closed until the trigger button is clicked", () => {
    render(<SearchDialog />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens on click and loads the index, listing every page while the query is empty", async () => {
    render(<SearchDialog />);
    await openDialog();

    expect(await screen.findByRole("button", { name: /matrizes/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /conjuntos/i })).toBeInTheDocument();
  });

  it("opens on Ctrl+K and closes on a second Ctrl+K", async () => {
    render(<SearchDialog />);

    await userEvent.keyboard("{Control>}k{/Control}");
    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    await userEvent.keyboard("{Control>}k{/Control}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens in response to the search-open event dispatched elsewhere", async () => {
    render(<SearchDialog />);
    window.dispatchEvent(new Event(SEARCH_OPEN_EVENT));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("closes on Escape", async () => {
    render(<SearchDialog />);
    await openDialog();

    await userEvent.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes when clicking the backdrop", async () => {
    render(<SearchDialog />);
    await openDialog();

    const backdrop = document.querySelector('button[aria-hidden="true"].absolute.inset-0');
    await userEvent.click(backdrop!);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("filters results as the user types", async () => {
    render(<SearchDialog />);
    await openDialog();
    await screen.findByRole("button", { name: /matrizes/i });

    await userEvent.type(screen.getByPlaceholderText(/buscar na documentação/i), "conjuntos");

    expect(await screen.findByRole("button", { name: /conjuntos/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^matrizes/i })).not.toBeInTheDocument();
  });

  it("shows a no-results message for a query that matches nothing", async () => {
    render(<SearchDialog />);
    await openDialog();
    await screen.findByRole("button", { name: /matrizes/i });

    await userEvent.type(screen.getByPlaceholderText(/buscar na documentação/i), "xyzxyzxyz");

    expect(await screen.findByText("Nenhum resultado.")).toBeInTheDocument();
  });

  it("clears the query with the clear button and refocuses the input", async () => {
    render(<SearchDialog />);
    await openDialog();
    const input = screen.getByPlaceholderText(/buscar na documentação/i);
    await userEvent.type(input, "conjuntos");

    await userEvent.click(screen.getByRole("button", { name: "Limpar busca" }));

    expect(input).toHaveValue("");
    expect(input).toHaveFocus();
  });

  it("navigates down with ArrowDown and selects with Enter", async () => {
    render(<SearchDialog />);
    await openDialog();
    await screen.findByRole("button", { name: /matrizes/i });
    const input = screen.getByPlaceholderText(/buscar na documentação/i);

    await userEvent.type(input, "{ArrowDown}");
    await userEvent.type(input, "{Enter}");

    expect(pushMock).toHaveBeenCalledWith("/docs/conjuntos");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("navigates back up with ArrowUp", async () => {
    render(<SearchDialog />);
    await openDialog();
    await screen.findByRole("button", { name: /matrizes/i });
    const input = screen.getByPlaceholderText(/buscar na documentação/i);

    await userEvent.type(input, "{ArrowDown}"); // Matrizes -> Conjuntos
    await userEvent.type(input, "{ArrowUp}"); // Conjuntos -> back to Matrizes
    await userEvent.type(input, "{Enter}");

    expect(pushMock).toHaveBeenCalledWith("/docs/matrizes");
  });

  it("wraps ArrowUp from the first result to the last", async () => {
    render(<SearchDialog />);
    await openDialog();
    await screen.findByRole("button", { name: /matrizes/i });
    const input = screen.getByPlaceholderText(/buscar na documentação/i);

    await userEvent.type(input, "{ArrowUp}"); // Matrizes (0) wraps to Conjuntos (last)
    await userEvent.type(input, "{Enter}");

    expect(pushMock).toHaveBeenCalledWith("/docs/conjuntos");
  });

  it("selecting a result records it as a recent search for next time", async () => {
    render(<SearchDialog />);
    await openDialog();
    await userEvent.click(await screen.findByRole("button", { name: /matrizes/i }));

    await openDialog();

    expect(screen.getByText("Buscas recentes")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /matrizes/i })).toBeInTheDocument();
  });

  it("clears recent searches on demand", async () => {
    render(<SearchDialog />);
    await openDialog();
    await userEvent.click(await screen.findByRole("button", { name: /matrizes/i }));
    await openDialog();
    expect(screen.getByText("Buscas recentes")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Limpar" }));

    expect(screen.queryByText("Buscas recentes")).not.toBeInTheDocument();
  });

  it("does not offer a retry-breaking failure: a failed index load still lets the dialog open", async () => {
    fetchSearchIndexMock.mockRejectedValueOnce(new Error("network down"));

    render(<SearchDialog />);
    await openDialog();

    expect(await screen.findByText("Nenhum resultado.")).toBeInTheDocument();
  });
});
