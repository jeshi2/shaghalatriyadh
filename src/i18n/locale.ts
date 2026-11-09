import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { routing, type Locale } from "./routing";

/**
 * Narrows a route parameter to a supported locale. Anything else 404s rather
 * than falling back to Arabic, so an unsupported locale never serves content
 * under the wrong URL.
 */
export function requireLocale(value: string): Locale {
  if (!hasLocale(routing.locales, value)) {
    notFound();
  }

  return value;
}
