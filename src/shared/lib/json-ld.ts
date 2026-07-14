/** Serializes a JSON-LD object for a `<script type="application/ld+json">` tag,
 * escaping `<` so a value containing `</script>` can't break out of the tag. */
export function jsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
