import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import Error from "../error";

describe("Error", () => {
  it("logs the error and offers a retry that calls unstable_retry", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const unstable_retry = vi.fn();
    const error = Object.assign(new globalThis.Error("boom"), { digest: "abc123" });

    render(<Error error={error} unstable_retry={unstable_retry} />);

    expect(consoleError).toHaveBeenCalledWith(error);
    expect(screen.getByText(/Código: abc123/)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(unstable_retry).toHaveBeenCalledTimes(1);

    consoleError.mockRestore();
  });

  it("omits the digest line when the error has none", () => {
    render(<Error error={new globalThis.Error("boom")} unstable_retry={vi.fn()} />);
    expect(screen.queryByText(/Código:/)).not.toBeInTheDocument();
  });
});
