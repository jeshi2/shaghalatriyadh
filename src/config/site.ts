import { routing } from "@/i18n/routing";

/**
 * Deployment-level configuration. `NEXT_PUBLIC_SITE_URL` must be set in
 * production so that canonical URLs, hreflang alternates, the sitemap and
 * structured data all point at the real domain.
 */
const DEFAULT_SITE_URL = "http://localhost:3000";

function resolveSiteUrl(): string {
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined);

  if (!configured) return DEFAULT_SITE_URL;
  return configured.replace(/\/+$/, "");
}

export const site = {
  url: resolveSiteUrl(),
  defaultLocale: routing.defaultLocale,
  locales: routing.locales,
  /** Used by the OpenGraph image and the social card fallbacks. */
  ogImagePath: "/og-image.svg",
} as const;

/** Absolute URL helper — always returns a canonical, slash-normalised URL. */
export function absoluteUrl(path = "/"): string {
  const normalised = path.startsWith("/") ? path : `/${path}`;
  return `${site.url}${normalised === "/" ? "" : normalised}`;
}
