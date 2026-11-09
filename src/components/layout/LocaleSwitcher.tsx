"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { localeLabels, routing, type Locale } from "@/i18n/routing";

type LocaleSwitcherProps = {
  className?: string;
};

/**
 * Renders one real link per locale instead of a JavaScript-only toggle, so the
 * alternate language is crawlable, shareable and works without client JS.
 * `usePathname` from next-intl returns the path without the locale prefix,
 * which keeps the visitor on the same page when switching.
 */
export function LocaleSwitcher({ className }: LocaleSwitcherProps) {
  const t = useTranslations("common");
  const activeLocale = useLocale() as Locale;
  const pathname = usePathname();

  return (
    <nav
      aria-label={t("language")}
      className={`flex items-center gap-1 ${className ?? ""}`}
    >
      {routing.locales.map((locale) => {
        const isActive = locale === activeLocale;

        return (
          <Link
            key={locale}
            href={pathname}
            locale={locale}
            hrefLang={locale}
            aria-current={isActive ? "true" : undefined}
            aria-label={
              isActive
                ? undefined
                : t("switchLanguage", { language: localeLabels[locale] })
            }
            className={
              isActive
                ? "rounded-pill bg-brand-700 px-3 py-1.5 text-sm font-semibold text-white"
                : "rounded-pill px-3 py-1.5 text-sm font-semibold text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900"
            }
          >
            {localeLabels[locale]}
          </Link>
        );
      })}
    </nav>
  );
}
