import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useDisclosure } from "../use-disclosure";

describe("useDisclosure", () => {
  it("defaults to closed", () => {
    const { result } = renderHook(() => useDisclosure());
    expect(result.current.open).toBe(false);
  });

  it("honors a default open state", () => {
    const { result } = renderHook(() => useDisclosure(true));
    expect(result.current.open).toBe(true);
  });

  it("toggle flips the open state", () => {
    const { result } = renderHook(() => useDisclosure());

    act(() => result.current.toggle());
    expect(result.current.open).toBe(true);

    act(() => result.current.toggle());
    expect(result.current.open).toBe(false);
  });

  it("setOpen sets the state directly", () => {
    const { result } = renderHook(() => useDisclosure());

    act(() => result.current.setOpen(true));
    expect(result.current.open).toBe(true);
  });
});
