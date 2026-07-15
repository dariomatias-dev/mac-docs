import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { useAnnotations } from "../use-annotations";

describe("useAnnotations", () => {
  beforeEach(() => localStorage.clear());

  it("starts empty", () => {
    const { result } = renderHook(() => useAnnotations("foo"));
    expect(result.current.annotations).toEqual([]);
  });

  it("adds a note", () => {
    const { result } = renderHook(() => useAnnotations("foo"));
    act(() => result.current.add("my note"));
    expect(result.current.annotations).toHaveLength(1);
    expect(result.current.annotations[0]).toMatchObject({ note: "my note" });
  });

  it("updates a note by id", () => {
    const { result } = renderHook(() => useAnnotations("foo"));
    act(() => result.current.add("note"));
    const id = result.current.annotations[0].id;
    act(() => result.current.update(id, "edited"));
    expect(result.current.annotations[0].note).toBe("edited");
  });

  it("removes a note by id", () => {
    const { result } = renderHook(() => useAnnotations("foo"));
    act(() => result.current.add("note"));
    const id = result.current.annotations[0].id;
    act(() => result.current.remove(id));
    expect(result.current.annotations).toEqual([]);
  });

  it("keeps notes scoped per slug", () => {
    const { result: a } = renderHook(() => useAnnotations("page-a"));
    const { result: b } = renderHook(() => useAnnotations("page-b"));
    act(() => a.current.add("note"));
    expect(a.current.annotations).toHaveLength(1);
    expect(b.current.annotations).toHaveLength(0);
  });

  it("ignores blank or whitespace-only notes on add", () => {
    const { result } = renderHook(() => useAnnotations("foo"));
    act(() => result.current.add("   "));
    expect(result.current.annotations).toEqual([]);
  });

  it("ignores blank or whitespace-only notes on update", () => {
    const { result } = renderHook(() => useAnnotations("foo"));
    act(() => result.current.add("note"));
    const id = result.current.annotations[0].id;
    act(() => result.current.update(id, "   "));
    expect(result.current.annotations[0].note).toBe("note");
  });

  it("trims stored note text", () => {
    const { result } = renderHook(() => useAnnotations("foo"));
    act(() => result.current.add("  padded note  "));
    expect(result.current.annotations[0].note).toBe("padded note");
  });

  it("restores a removed note", () => {
    const { result } = renderHook(() => useAnnotations("foo"));
    act(() => result.current.add("note"));
    const removed = result.current.annotations[0];
    act(() => result.current.remove(removed.id));
    expect(result.current.annotations).toEqual([]);

    act(() => result.current.restore(removed));
    expect(result.current.annotations).toEqual([removed]);
  });

  it("does not duplicate a note that is restored twice", () => {
    const { result } = renderHook(() => useAnnotations("foo"));
    act(() => result.current.add("note"));
    const annotation = result.current.annotations[0];

    act(() => result.current.restore(annotation));
    expect(result.current.annotations).toEqual([annotation]);
  });

  it("imports notes, skipping blank ones", () => {
    const { result } = renderHook(() => useAnnotations("foo"));
    act(() => result.current.importNotes([{ note: "first" }, { note: "  " }, { note: "second" }]));

    expect(result.current.annotations).toHaveLength(2);
    expect(result.current.annotations.map((a) => a.note)).toEqual(["first", "second"]);
  });

  it("imports notes, skipping malformed entries instead of throwing", () => {
    const { result } = renderHook(() => useAnnotations("foo"));
    act(() =>
      result.current.importNotes([{ note: "valid" }, null, "not an object", { other: 1 }, 42]),
    );

    expect(result.current.annotations).toHaveLength(1);
    expect(result.current.annotations[0].note).toBe("valid");
  });

  it("imports notes appended to existing ones", () => {
    const { result } = renderHook(() => useAnnotations("foo"));
    act(() => result.current.add("existing"));
    act(() => result.current.importNotes([{ note: "imported", createdAt: 123 }]));

    expect(result.current.annotations).toHaveLength(2);
    expect(result.current.annotations[1]).toMatchObject({ note: "imported", createdAt: 123 });
  });
});
