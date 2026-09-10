import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SITE_NAME } from "@/shared/lib/site";

const { imageResponseMock } = vi.hoisted(() => ({ imageResponseMock: vi.fn() }));
vi.mock("next/og", () => ({
  ImageResponse: class {
    constructor(...args: unknown[]) {
      imageResponseMock(...args);
    }
  },
}));

import { GET } from "../route";

import type { ReactElement } from "react";

function request(params: Record<string, string>) {
  const url = `https://example.com/og?${new URLSearchParams(params)}`;
  return { nextUrl: new URL(url) } as unknown as Parameters<typeof GET>[0];
}

function renderLastCall() {
  const [jsx, options] = imageResponseMock.mock.calls.at(-1)!;
  render(jsx as ReactElement);
  return options as { width: number; height: number };
}

describe("GET /og", () => {
  it("falls back to the site name when no title is given", () => {
    GET(request({}));
    const size = renderLastCall();

    expect(screen.getAllByText(SITE_NAME).length).toBeGreaterThan(0);
    expect(size).toEqual({ width: 1200, height: 630 });
  });

  it("uses the given title and description", () => {
    GET(request({ title: "Matrizes", description: "Operações com matrizes" }));
    renderLastCall();

    expect(screen.getByText("Matrizes")).toBeInTheDocument();
    expect(screen.getByText("Operações com matrizes")).toBeInTheDocument();
  });

  it("truncates an overly long title and description", () => {
    GET(request({ title: "a".repeat(200), description: "b".repeat(300) }));
    renderLastCall();

    expect(screen.getByText("a".repeat(120))).toBeInTheDocument();
    expect(screen.getByText("b".repeat(200))).toBeInTheDocument();
  });
});
