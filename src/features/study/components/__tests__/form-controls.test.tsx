import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Dropdown } from "../form-controls";

const options = [
  { value: "a", label: "Opção A" },
  { value: "b", label: "Opção B" },
];

describe("Dropdown", () => {
  it("closes when clicking outside the dropdown", async () => {
    render(
      <div>
        <Dropdown ariaLabel="Escolha" options={options} value="a" onChange={vi.fn()} />
        <button>fora</button>
      </div>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Escolha" }));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "fora" }));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("closes on Escape", async () => {
    render(<Dropdown ariaLabel="Escolha" options={options} value="a" onChange={vi.fn()} />);

    await userEvent.click(screen.getByRole("button", { name: "Escolha" }));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("calls onChange and closes when an option is picked", async () => {
    const onChange = vi.fn();
    render(<Dropdown ariaLabel="Escolha" options={options} value="a" onChange={onChange} />);

    await userEvent.click(screen.getByRole("button", { name: "Escolha" }));
    await userEvent.click(screen.getByRole("option", { name: "Opção B" }));

    expect(onChange).toHaveBeenCalledWith("b");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("labels the trigger via a visible label instead of ariaLabel when given one", () => {
    render(<Dropdown label="Tipo" options={options} value="a" onChange={vi.fn()} />);

    expect(screen.getByText("Tipo")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tipo" })).toHaveTextContent("Opção A");
  });

  it("shows the placeholder when the current value matches no option", () => {
    render(
      <Dropdown
        ariaLabel="Escolha"
        options={options}
        value="c"
        onChange={vi.fn()}
        placeholder="Selecione uma opção"
      />,
    );

    expect(screen.getByText("Selecione uma opção")).toBeInTheDocument();
  });
});
