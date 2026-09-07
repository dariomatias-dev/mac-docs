import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SEARCH_OPEN_EVENT } from "../../lib/search-shared";
import { SearchButton } from "../search-button";

describe("SearchButton", () => {
  it("dispatches the search-open event on click", async () => {
    const listener = vi.fn();
    window.addEventListener(SEARCH_OPEN_EVENT, listener);

    render(<SearchButton />);
    await userEvent.click(screen.getByRole("button", { name: /buscar/i }));

    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener(SEARCH_OPEN_EVENT, listener);
  });
});
