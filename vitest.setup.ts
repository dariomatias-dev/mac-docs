import "@testing-library/jest-dom/vitest";

// jsdom doesn't implement layout, so it never implemented scrollIntoView
// either. Several components call it (search results, sidebar active-link
// scroll); a no-op keeps those effects from throwing in every test that
// happens to mount them, without asserting anything about scroll position.
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}
