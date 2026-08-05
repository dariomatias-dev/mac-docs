export const ANNOTATIONS_KEY_PREFIX = "annotations:";

export function slugFromHref(href: string): string {
  return href.replace(/^\/docs\/?/, "").replace(/\/$/, "");
}
