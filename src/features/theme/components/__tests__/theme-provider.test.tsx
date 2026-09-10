import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";

import { ThemeProvider } from "../theme-provider";

beforeAll(() => {
  window.matchMedia ??= (query: string) =>
    ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
    }) as unknown as MediaQueryList;
});

describe("ThemeProvider", () => {
  it("renders its children and forwards props to next-themes", () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <span>content</span>
      </ThemeProvider>,
    );

    expect(screen.getByText("content")).toBeInTheDocument();
  });
});
