import type { Metadata } from "next";
import { site } from "@/config/site";
import { localeHtmlLang, routing, type Locale } from "@/i18n/routing";

/** Absolute URL for a path in a given locale. */
export function localeUrl(locale: Locale, path = "/"): string {
  const normalised =
    path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `${site.url}/${locale}${normalised}`;
}

/**
 * hreflang map for a path: one entry per locale plus `x-default`, which points
 * at the Arabic version because Arabic is the primary language of the site.
 */
export function languageAlternates(path = "/"): Record<string, string> {
  return {
    ...Object.fromEntries(
      routing.locales.map((locale) => [
        localeHtmlLang[locale],
        localeUrl(locale, path),
      ]),
    ),
    "x-default": localeUrl(routing.defaultLocale, path),
  };
}

/** `ar-QA` -> `ar_QA`, the form Open Graph expects. */
function ogLocale(locale: Locale): string {
  return localeHtmlLang[locale].replace("-", "_");
}

export type PageMetadataOptions = {
  locale: Locale;
  /** Path without the locale prefix, e.g. `/services/nanny`. */
  path?: string;
  title: string;
  description: string;
  siteName: string;
};

/** Absolute URL of the generated social card for a locale. */
export function ogImageUrl(locale: Locale): string {
  return `${localeUrl(locale, "/")}/opengraph-image`;
}

/**
 * Builds the canonical URL, hreflang alternates and Open Graph/Twitter tags
 * for one page. The social card from the opengraph-image route is referenced
 * explicitly, because declaring `openGraph` here replaces rather than extends
 * the file-based image metadata.
 */
export function buildPageMetadata({
  locale,
  path = "/",
  title,
  description,
  siteName,
}: PageMetadataOptions): Metadata {
  const canonical = localeUrl(locale, path);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: languageAlternates(path),
    },
    openGraph: {
      type: "website",
      url: canonical,
      siteName,
      title,
      description,
      locale: ogLocale(locale),
      alternateLocale: routing.locales
        .filter((other) => other !== locale)
        .map(ogLocale),
      images: [
        {
          url: ogImageUrl(locale),
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl(locale)],
    },
  };
}
