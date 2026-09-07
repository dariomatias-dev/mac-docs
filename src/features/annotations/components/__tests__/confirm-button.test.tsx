import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Trash2 } from "lucide-react";
import { describe, expect, it, vi } from "vitest";

import { ConfirmButton } from "../confirm-button";

describe("ConfirmButton", () => {
  it("renders an icon button labeled for accessibility, not yet confirming", () => {
    render(<ConfirmButton icon={Trash2} label="Remover anotação" onConfirm={() => {}} />);
    expect(screen.getByRole("button", { name: "Remover anotação" })).toBeInTheDocument();
    expect(screen.queryByText("Remover?")).not.toBeInTheDocument();
  });

  it("arms on first click without calling onConfirm yet", async () => {
    const onConfirm = vi.fn();
    render(<ConfirmButton icon={Trash2} label="Remover anotação" onConfirm={onConfirm} />);

    await userEvent.click(screen.getByRole("button", { name: "Remover anotação" }));

    expect(screen.getByRole("button", { name: "Remover" })).toBeInTheDocument();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("calls onConfirm only after the second click confirms", async () => {
    const onConfirm = vi.fn();
    render(<ConfirmButton icon={Trash2} label="Remover anotação" onConfirm={onConfirm} />);

    await userEvent.click(screen.getByRole("button", { name: "Remover anotação" }));
    await userEvent.click(screen.getByRole("button", { name: "Remover" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("backs out without confirming when Cancelar is clicked", async () => {
    const onConfirm = vi.fn();
    render(<ConfirmButton icon={Trash2} label="Remover anotação" onConfirm={onConfirm} />);

    await userEvent.click(screen.getByRole("button", { name: "Remover anotação" }));
    await userEvent.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(onConfirm).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Remover anotação" })).toBeInTheDocument();
  });
});
