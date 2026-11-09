import { defineRouting } from "next-intl/routing";

/**
 * Arabic is the primary language of the business, so it is the default locale
 * and is always prefixed (`/ar`) to keep both languages symmetrical and to
 * give every page a single canonical URL per locale.
 */
export const routing = defineRouting({
  locales: ["ar", "en"],
  defaultLocale: "ar",
  localePrefix: "always",
  localeDetection: true,
});

export type Locale = (typeof routing.locales)[number];

export const localeDirections = {
  ar: "rtl",
  en: "ltr",
} as const satisfies Record<Locale, "rtl" | "ltr">;

export const localeLabels = {
  ar: "العربية",
  en: "English",
} as const satisfies Record<Locale, string>;

/** BCP 47 tags used for `hreflang`, `og:locale` and `<html lang>`. */
export const localeHtmlLang = {
  ar: "ar-QA",
  en: "en-QA",
} as const satisfies Record<Locale, string>;

export function getDirection(locale: Locale): "rtl" | "ltr" {
  return localeDirections[locale];
}
