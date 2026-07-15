import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AnnotationsPanel } from "../annotations-panel";

const baseProps = {
  open: true,
  onClose: () => {},
  slug: "test-page",
  onAdd: () => {},
  onUpdate: () => {},
  onRemove: () => {},
  onRestore: () => {},
  onImport: () => {},
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

  it("keeps both pending undos when two annotations are removed within the undo window", async () => {
    const onRestore = vi.fn();
    const a = { id: "1", note: "nota A", createdAt: Date.now() };
    const b = { id: "2", note: "nota B", createdAt: Date.now() };
    render(<AnnotationsPanel {...baseProps} annotations={[a, b]} onRestore={onRestore} />);

    const removeButtonFor = (note: string) =>
      screen.getByText(note).closest("li")!.querySelector('[aria-label="Remover anotação"]')!;

    await userEvent.click(removeButtonFor("nota A"));
    await userEvent.click(removeButtonFor("nota B"));

    const undoButtons = screen.getAllByRole("button", { name: "Desfazer" });
    expect(undoButtons).toHaveLength(2);

    await userEvent.click(undoButtons[0]);
    expect(onRestore).toHaveBeenCalledTimes(1);
    expect(screen.getAllByRole("button", { name: "Desfazer" })).toHaveLength(1);
  });

  it("shows an 'editado' label with the update date once an annotation has been edited", () => {
    const annotation = { id: "1", note: "nota", createdAt: Date.now(), updatedAt: Date.now() };
    render(<AnnotationsPanel {...baseProps} annotations={[annotation]} />);
    expect(screen.getByText(/editado em/i)).toBeInTheDocument();
  });

  it("filters annotations by note text", async () => {
    const a = { id: "1", note: "sobre gatos", createdAt: Date.now() };
    const b = { id: "2", note: "sobre cachorros", createdAt: Date.now() };
    render(<AnnotationsPanel {...baseProps} annotations={[a, b]} />);

    await userEvent.type(screen.getByPlaceholderText(/buscar anotações/i), "gatos");

    expect(screen.getByText("sobre gatos")).toBeInTheDocument();
    expect(screen.queryByText("sobre cachorros")).not.toBeInTheDocument();
  });

  it("shows a no-results message when the search matches nothing", async () => {
    const annotation = { id: "1", note: "sobre gatos", createdAt: Date.now() };
    render(<AnnotationsPanel {...baseProps} annotations={[annotation]} />);

    await userEvent.type(screen.getByPlaceholderText(/buscar anotações/i), "elefantes");

    expect(screen.getByText(/nenhuma anotação corresponde à busca/i)).toBeInTheDocument();
  });

  it("toggles sort order between newest and oldest first", async () => {
    const older = { id: "1", note: "mais antiga", createdAt: 1000 };
    const newer = { id: "2", note: "mais recente", createdAt: 2000 };
    render(<AnnotationsPanel {...baseProps} annotations={[older, newer]} />);

    const notesInOrder = () => screen.getAllByRole("listitem").map((li) => li.textContent);
    expect(notesInOrder()[0]).toContain("mais recente");

    await userEvent.click(
      screen.getByRole("button", { name: /ordenar por mais antigas primeiro/i }),
    );

    expect(notesInOrder()[0]).toContain("mais antiga");
  });

  it("disables export when there are no annotations", () => {
    render(<AnnotationsPanel {...baseProps} annotations={[]} />);
    expect(screen.getByRole("button", { name: /exportar anotações/i })).toBeDisabled();
  });

  it("downloads a JSON file of the annotations on export", async () => {
    const annotation = { id: "1", note: "nota original", createdAt: Date.now() };
    URL.createObjectURL = vi.fn(() => "blob:mock");
    URL.revokeObjectURL = vi.fn();
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

    render(<AnnotationsPanel {...baseProps} annotations={[annotation]} />);
    await userEvent.click(screen.getByRole("button", { name: /exportar anotações/i }));

    expect(clickSpy).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock");
    clickSpy.mockRestore();
  });

  it("imports notes from a selected JSON file", async () => {
    const onImport = vi.fn();
    render(<AnnotationsPanel {...baseProps} annotations={[]} onImport={onImport} />);

    const file = new File([JSON.stringify([{ note: "imported note" }])], "notes.json", {
      type: "application/json",
    });
    const input = screen.getByLabelText(/selecionar arquivo de anotações/i) as HTMLInputElement;
    await userEvent.upload(input, file);

    expect(onImport).toHaveBeenCalledWith([{ note: "imported note" }]);
  });
});
