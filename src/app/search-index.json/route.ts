import { getSearchIndex } from "@/features/search";

// Prerendered to a static JSON artifact at build time and fetched lazily by
// the search dialog, so the index stays out of every page's RSC payload.
export const dynamic = "force-static";

export function GET() {
  return Response.json(getSearchIndex());
}
