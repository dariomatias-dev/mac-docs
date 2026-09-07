import { renderHook } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it } from "vitest";

import { ActiveMobileSheetProvider, useMobileSheet } from "../active-mobile-sheet-provider";

function setup() {
  return renderHook(
    () => ({ nav: useMobileSheet("nav"), annotations: useMobileSheet("annotations") }),
    { wrapper: ActiveMobileSheetProvider },
  );
}

describe("ActiveMobileSheetProvider", () => {
  it("throws when used outside the provider", () => {
    expect(() => renderHook(() => useMobileSheet("nav"))).toThrow(
      "useMobileSheet must be used within ActiveMobileSheetProvider",
    );
  });

  it("starts with no sheet open", () => {
    const { result } = setup();
    expect(result.current.nav.isOpen).toBe(false);
    expect(result.current.annotations.isOpen).toBe(false);
  });

  it("opening one sheet closes the other, since only one can be open at a time", () => {
    const { result } = setup();

    act(() => result.current.nav.openSheet());
    expect(result.current.nav.isOpen).toBe(true);

    act(() => result.current.annotations.openSheet());
    expect(result.current.nav.isOpen).toBe(false);
    expect(result.current.annotations.isOpen).toBe(true);
  });

  it("closing a sheet that isn't the active one is a no-op", () => {
    const { result } = setup();

    act(() => result.current.nav.openSheet());
    act(() => result.current.annotations.close());

    expect(result.current.nav.isOpen).toBe(true);
  });

  it("toggle opens a closed sheet and closes an open one", () => {
    const { result } = setup();

    act(() => result.current.nav.toggle());
    expect(result.current.nav.isOpen).toBe(true);

    act(() => result.current.nav.toggle());
    expect(result.current.nav.isOpen).toBe(false);
  });

  it("locks body scroll while the nav sheet is open, and restores it on close", () => {
    const { result } = setup();
    expect(document.body.style.overflow).not.toBe("hidden");

    act(() => result.current.nav.openSheet());
    expect(document.body.style.overflow).toBe("hidden");

    act(() => result.current.nav.close());
    expect(document.body.style.overflow).not.toBe("hidden");
  });

  it("does not lock body scroll for the annotations sheet", () => {
    const { result } = setup();
    act(() => result.current.annotations.openSheet());
    expect(document.body.style.overflow).not.toBe("hidden");
  });
});
