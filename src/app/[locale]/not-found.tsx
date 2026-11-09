import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function LocaleNotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="container-content flex flex-1 flex-col items-start justify-center gap-4 py-24">
      <p className="text-5xl font-bold text-brand-700">404</p>
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <p className="max-w-prose text-ink-500">{t("description")}</p>
      <Link
        href="/"
        className="rounded-pill bg-brand-700 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-brand-800"
      >
        {t("backHome")}
      </Link>
    </div>
  );
}
