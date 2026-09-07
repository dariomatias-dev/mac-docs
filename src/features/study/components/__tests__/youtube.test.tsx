import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { YouTube } from "../youtube";

describe("YouTube", () => {
  it("embeds a bare video id as-is", () => {
    render(<YouTube id="dQw4w9WgXcQ" />);
    expect(screen.getByTitle("Vídeo do YouTube")).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    );
  });

  it("extracts the id from a youtube.com/watch url", () => {
    render(<YouTube id="https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10s" />);
    expect(screen.getByTitle("Vídeo do YouTube")).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    );
  });

  it("extracts the id from a youtu.be short url", () => {
    render(<YouTube id="https://youtu.be/dQw4w9WgXcQ" />);
    expect(screen.getByTitle("Vídeo do YouTube")).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    );
  });

  it("extracts the id from an already-embedded url", () => {
    render(<YouTube id="https://www.youtube.com/embed/dQw4w9WgXcQ" />);
    expect(screen.getByTitle("Vídeo do YouTube")).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    );
  });

  it("uses a custom title for both the iframe and the caption", () => {
    render(<YouTube id="dQw4w9WgXcQ" title="Demonstração" />);
    expect(screen.getByTitle("Demonstração")).toBeInTheDocument();
    expect(screen.getByText("Demonstração")).toBeInTheDocument();
  });
});
