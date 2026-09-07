import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// KaTeX and Tailwind inject inline styles, so style-src needs 'unsafe-inline'.
// Turbopack HMR needs 'unsafe-eval' and a websocket connection in development only.
//
// script-src keeps 'unsafe-inline' too, and deliberately does not move to a
// per-request nonce. Every page here is statically generated at build time
// (generateStaticParams over content/), and Next.js nonces only work on
// dynamically rendered pages: the nonce comes from a proxy (middleware)
// reading the request, which doesn't exist yet when a static page is
// prerendered. Switching to nonces would force every route to dynamic
// rendering, which both defeats the point of this being a static docs site
// and works against the bundle/Lighthouse budget planned separately.
// Hash-based CSP (the documented fallback for static sites) doesn't apply
// cleanly either: Next's own App Router streaming script
// (`self.__next_f.push(...)`) is inline and its content is unique per page,
// so a single fixed set of hashes in next.config.ts's static headers()
// couldn't cover every route. 'unsafe-inline' stays until either constraint
// changes.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "frame-src https://www.youtube-nocookie.com",
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
