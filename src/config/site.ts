import { routing } from "@/i18n/routing";

/**
 * Deployment-level configuration.
 *
 * `NEXT_PUBLIC_SITE_URL` should be set in every deployed environment so that
 * canonical URLs, hreflang alternates, the sitemap, robots.txt and the
 * structured data all point at the address visitors actually use.
 *
 * On Vercel, `VERCEL_PROJECT_PRODUCTION_URL` is used as a fallback so a
 * deployment is never left pointing at localhost. It is a server-only
 * variable, which is fine: everything here is read during metadata and route
 * generation, never in a Client Component.
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

/**
 * Set `NEXT_PUBLIC_NOINDEX=true` to keep a deployment out of search results.
 *
 * Use it while the site lives on a temporary address (a *.vercel.app
 * subdomain, a preview, a staging host). Indexing a throwaway hostname and
 * then moving to the real domain means redirecting and re-earning every
 * ranking signal, so it is cheaper to stay unindexed until the final domain
 * is in place.
 */
export const isIndexable = process.env.NEXT_PUBLIC_NOINDEX !== "true";

export const site = {
  url: resolveSiteUrl(),
  defaultLocale: routing.defaultLocale,
  locales: routing.locales,
  isIndexable,
} as const;

/** Absolute URL helper — always returns a canonical, slash-normalised URL. */
export function absoluteUrl(path = "/"): string {
  const normalised = path.startsWith("/") ? path : `/${path}`;
  return `${site.url}${normalised === "/" ? "" : normalised}`;
}
