import { useTranslations } from "next-intl";

/** Visible only on keyboard focus; the first thing in the tab order. */
export function SkipLink() {
  const t = useTranslations("common");

  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:rounded-pill focus:bg-brand-700 focus:px-5 focus:py-3 focus:font-semibold focus:text-white"
    >
      {t("skipToContent")}
    </a>
  );
}
