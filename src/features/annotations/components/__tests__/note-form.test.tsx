import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { NoteForm } from "../note-form";

describe("NoteForm", () => {
  it("renders the placeholder, an empty counter and a disabled submit button", () => {
    render(
      <NoteForm
        variant="new"
        placeholder="Escreva..."
        submitLabel="Adicionar"
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByPlaceholderText("Escreva...")).toHaveValue("");
    expect(screen.getByText("0/500")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Adicionar" })).toBeDisabled();
  });

  it("pre-fills from initialValue and enables submit", () => {
    render(<NoteForm variant="edit" initialValue="nota" submitLabel="Salvar" onSubmit={vi.fn()} />);

    expect(screen.getByDisplayValue("nota")).toBeInTheDocument();
    expect(screen.getByText("4/500")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeEnabled();
  });

  it("caps the textarea's maxLength at 500", () => {
    render(<NoteForm variant="new" submitLabel="Adicionar" onSubmit={vi.fn()} />);
    expect(screen.getByRole("textbox")).toHaveAttribute("maxlength", "500");
  });

  it("disables submit for whitespace-only input", async () => {
    render(<NoteForm variant="new" submitLabel="Adicionar" onSubmit={vi.fn()} />);
    await userEvent.type(screen.getByRole("textbox"), "   ");
    expect(screen.getByRole("button", { name: "Adicionar" })).toBeDisabled();
  });

  it("submits the trimmed note and clears the textarea", async () => {
    const onSubmit = vi.fn();
    render(<NoteForm variant="new" submitLabel="Adicionar" onSubmit={onSubmit} />);

    const textarea = screen.getByRole("textbox");
    await userEvent.type(textarea, "  minha nota  ");
    await userEvent.click(screen.getByRole("button", { name: "Adicionar" }));

    expect(onSubmit).toHaveBeenCalledWith("minha nota");
    expect(textarea).toHaveValue("");
  });

  it("does not submit on Ctrl+Enter when the note is only whitespace", async () => {
    const onSubmit = vi.fn();
    render(<NoteForm variant="new" submitLabel="Adicionar" onSubmit={onSubmit} />);

    await userEvent.type(screen.getByRole("textbox"), "   {Control>}{Enter}{/Control}");

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits on Ctrl+Enter", async () => {
    const onSubmit = vi.fn();
    render(<NoteForm variant="new" submitLabel="Adicionar" onSubmit={onSubmit} />);

    await userEvent.type(screen.getByRole("textbox"), "atalho{Control>}{Enter}{/Control}");

    expect(onSubmit).toHaveBeenCalledWith("atalho");
  });

  it("calls onCancel on Escape", async () => {
    const onCancel = vi.fn();
    render(<NoteForm variant="edit" submitLabel="Salvar" onSubmit={vi.fn()} onCancel={onCancel} />);

    await userEvent.type(screen.getByRole("textbox"), "{Escape}");

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("focuses the textarea and places the cursor at the end when focusOnMount is set", () => {
    render(
      <NoteForm
        variant="edit"
        initialValue="nota existente"
        submitLabel="Salvar"
        onSubmit={vi.fn()}
        focusOnMount
      />,
    );

    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    expect(textarea).toHaveFocus();
    expect(textarea.selectionStart).toBe("nota existente".length);
    expect(textarea.selectionEnd).toBe("nota existente".length);
  });

  it("only renders a Cancelar button when onCancel is provided", () => {
    const { rerender } = render(
      <NoteForm variant="new" submitLabel="Adicionar" onSubmit={vi.fn()} />,
    );
    expect(screen.queryByRole("button", { name: "Cancelar" })).not.toBeInTheDocument();

    rerender(
      <NoteForm variant="new" submitLabel="Adicionar" onSubmit={vi.fn()} onCancel={vi.fn()} />,
    );
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
  });
});
