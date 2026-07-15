import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AnnotationsPanel } from "../annotations-panel";

const baseProps = {
  open: true,
  onClose: () => {},
  onAdd: () => {},
  onUpdate: () => {},
  onRemove: () => {},
  onRestore: () => {},
};

describe("AnnotationsPanel", () => {
  it("shows the empty state when there are no annotations", () => {
    render(<AnnotationsPanel {...baseProps} annotations={[]} />);
    expect(screen.getByText(/nenhuma anotação ainda/i)).toBeInTheDocument();
  });

  it("submits a new note and clears the textarea afterwards", async () => {
    const onAdd = vi.fn();
    render(<AnnotationsPanel {...baseProps} annotations={[]} onAdd={onAdd} />);

    const textarea = screen.getByPlaceholderText(/escreva uma anotação/i);
    await userEvent.type(textarea, "minha nota");
    await userEvent.click(screen.getByRole("button", { name: "Adicionar" }));

    expect(onAdd).toHaveBeenCalledWith("minha nota");
    expect(textarea).toHaveValue("");
  });

  it("disables the add button while the note is blank", async () => {
    render(<AnnotationsPanel {...baseProps} annotations={[]} />);
    const button = screen.getByRole("button", { name: "Adicionar" });
    expect(button).toBeDisabled();

    await userEvent.type(screen.getByPlaceholderText(/escreva uma anotação/i), "   ");
    expect(button).toBeDisabled();
  });

  it("toggles an annotation into edit mode and back on cancel", async () => {
    const annotation = { id: "1", note: "nota original", createdAt: Date.now() };
    render(<AnnotationsPanel {...baseProps} annotations={[annotation]} />);

    expect(screen.getByText("nota original")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /editar anotação/i }));
    const textarea = screen.getByDisplayValue("nota original");
    expect(textarea).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(screen.getByText("nota original")).toBeInTheDocument();
    expect(screen.queryByDisplayValue("nota original")).not.toBeInTheDocument();
  });

  it("saves an edited annotation", async () => {
    const onUpdate = vi.fn();
    const annotation = { id: "1", note: "nota original", createdAt: Date.now() };
    render(<AnnotationsPanel {...baseProps} annotations={[annotation]} onUpdate={onUpdate} />);

    await userEvent.click(screen.getByRole("button", { name: /editar anotação/i }));
    const textarea = screen.getByDisplayValue("nota original");
    await userEvent.clear(textarea);
    await userEvent.type(textarea, "nota editada");
    await userEvent.click(screen.getByRole("button", { name: "Salvar" }));

    expect(onUpdate).toHaveBeenCalledWith("1", "nota editada");
  });

  it("removes an annotation", async () => {
    const onRemove = vi.fn();
    const annotation = { id: "1", note: "nota original", createdAt: Date.now() };
    render(<AnnotationsPanel {...baseProps} annotations={[annotation]} onRemove={onRemove} />);

    await userEvent.click(screen.getByRole("button", { name: /remover anotação/i }));
    expect(onRemove).toHaveBeenCalledWith("1");
  });

  it("offers to undo a removal and restores the annotation on click", async () => {
    const onRestore = vi.fn();
    const annotation = { id: "1", note: "nota original", createdAt: Date.now() };
    render(<AnnotationsPanel {...baseProps} annotations={[annotation]} onRestore={onRestore} />);

    await userEvent.click(screen.getByRole("button", { name: /remover anotação/i }));
    expect(screen.getByText(/anotação removida/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Desfazer" }));
    expect(onRestore).toHaveBeenCalledWith(annotation);
    expect(screen.queryByText(/anotação removida/i)).not.toBeInTheDocument();
  });
});
