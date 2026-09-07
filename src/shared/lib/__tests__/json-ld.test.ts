import { describe, expect, it } from "vitest";

import { jsonLd } from "../json-ld";

describe("jsonLd", () => {
  it("serializes a plain object", () => {
    expect(jsonLd({ a: 1, b: "x" })).toBe('{"a":1,"b":"x"}');
  });

  it("escapes < so a value can't close the surrounding <script> tag", () => {
    const out = jsonLd({ evil: "</script><script>alert(1)</script>" });
    expect(out).not.toContain("</script>");
    expect(out).toContain("\\u003c/script>");
  });

  it("produces valid JSON once the escape is reversed", () => {
    const data = { title: "a <b> c", n: 2 };
    const out = jsonLd(data);
    expect(JSON.parse(out.replace(/\\u003c/g, "<"))).toEqual(data);
  });
});
