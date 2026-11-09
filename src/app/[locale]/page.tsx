import { getTranslations, setRequestLocale } from "next-intl/server";
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { Link } from "@/i18n/navigation";
import { business } from "@/config/business";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("common");
  const tNav = await getTranslations("nav");

  return (
    <main className="container-content flex flex-1 flex-col gap-8 py-20">
      <LocaleSwitcher className="self-start" />
      <div className="flex flex-col gap-4">
        <p className="text-sm font-semibold tracking-wide text-brand-700 uppercase">
          {business.address.city}, {business.address.country}
        </p>
        <h1 className="text-4xl font-bold sm:text-5xl">{t("brandName")}</h1>
        <p className="max-w-prose text-lg text-ink-500">{t("tagline")}</p>
      </div>
      <ul className="flex flex-wrap gap-4 text-brand-700 underline underline-offset-4">
        <li>
          <Link href="/services">{tNav("services")}</Link>
        </li>
        <li>
          <Link href="/how-it-works">{tNav("howItWorks")}</Link>
        </li>
        <li>
          <Link href="/about">{tNav("about")}</Link>
        </li>
        <li>
          <Link href="/contact">{tNav("contact")}</Link>
        </li>
      </ul>
    </main>
  );
}
