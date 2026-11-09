import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/**
 * Content Security Policy.
 *
 * `script-src` and `style-src` need 'unsafe-inline' because every page here is
 * statically prerendered: Next inlines its bootstrap script and the streamed
 * RSC payload, and a nonce would have to be generated per request, which would
 * make every page dynamic. The site renders no user-supplied content, so the
 * residual risk is small. If that changes, move to nonces in src/proxy.ts and
 * accept dynamic rendering.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline'",
  "connect-src 'self'",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  // This is a content-driven marketing site: every route is prerendered at
  // build time. Cache Components (the create-next-app default) is therefore
  // not needed and is left off so rendering behaviour stays predictable
  // alongside next-intl's request-scoped locale resolution.

  // Do not advertise the framework version.
  poweredByHeader: false,

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  /**
   * These headers are applied by `next start` and by any Node-based host. On a
   * static/CDN host (S3, Cloudflare Pages, nginx) they must be configured
   * there as well — see the deployment section of the README.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
