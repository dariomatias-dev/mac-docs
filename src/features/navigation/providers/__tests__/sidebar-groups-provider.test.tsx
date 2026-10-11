import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { SidebarGroupsProvider, useSidebarGroups } from "../sidebar-groups-provider";

describe("useSidebarGroups", () => {
  beforeEach(() => localStorage.clear());

  it("throws when used outside the provider", () => {
    expect(() => renderHook(() => useSidebarGroups())).toThrow(
      "useSidebarGroups must be used within SidebarGroupsProvider",
    );
  });

  it("falls back to defaultOpen for a group that was never touched", () => {
    const { result } = renderHook(() => useSidebarGroups(), {
      wrapper: SidebarGroupsProvider,
    });
    expect(result.current.isOpen("/docs/a", true)).toBe(true);
    expect(result.current.isOpen("/docs/a", false)).toBe(false);
  });

  it("remembers an explicit setGroupOpen over the caller's default", () => {
    const { result } = renderHook(() => useSidebarGroups(), {
      wrapper: SidebarGroupsProvider,
    });

    act(() => result.current.setGroupOpen("/docs/a", true));

    expect(result.current.isOpen("/docs/a", false)).toBe(true);
  });

  it("does not update when setGroupOpen writes the same value", () => {
    const { result } = renderHook(() => useSidebarGroups(), {
      wrapper: SidebarGroupsProvider,
    });

    act(() => result.current.setGroupOpen("/docs/a", true));
    const isOpen = result.current.isOpen;
    act(() => result.current.setGroupOpen("/docs/a", true));
    expect(result.current.isOpen).toBe(isOpen);
  });

  it("persists across a fresh mount", () => {
    const first = renderHook(() => useSidebarGroups(), { wrapper: SidebarGroupsProvider });
    act(() => first.result.current.setGroupOpen("/docs/a", true));

    const second = renderHook(() => useSidebarGroups(), { wrapper: SidebarGroupsProvider });
    expect(second.result.current.isOpen("/docs/a", false)).toBe(true);
  });
});
