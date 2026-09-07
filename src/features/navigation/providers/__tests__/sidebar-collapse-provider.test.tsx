import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { SidebarCollapseProvider, useSidebarCollapse } from "../sidebar-collapse-provider";

describe("useSidebarCollapse", () => {
  beforeEach(() => localStorage.clear());

  it("throws when used outside the provider", () => {
    expect(() => renderHook(() => useSidebarCollapse())).toThrow(
      "useSidebarCollapse must be used within SidebarCollapseProvider",
    );
  });

  it("starts expanded (not collapsed)", () => {
    const { result } = renderHook(() => useSidebarCollapse(), {
      wrapper: SidebarCollapseProvider,
    });
    expect(result.current.collapsed).toBe(false);
  });

  it("toggles collapsed state back and forth", () => {
    const { result } = renderHook(() => useSidebarCollapse(), {
      wrapper: SidebarCollapseProvider,
    });

    act(() => result.current.toggle());
    expect(result.current.collapsed).toBe(true);

    act(() => result.current.toggle());
    expect(result.current.collapsed).toBe(false);
  });

  it("persists the collapsed state across a fresh mount", () => {
    const first = renderHook(() => useSidebarCollapse(), { wrapper: SidebarCollapseProvider });
    act(() => first.result.current.toggle());

    const second = renderHook(() => useSidebarCollapse(), { wrapper: SidebarCollapseProvider });
    expect(second.result.current.collapsed).toBe(true);
  });
});
