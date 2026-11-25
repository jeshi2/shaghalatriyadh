import { useFormatter, useLocale, useTranslations } from "next-intl";
import { BrandMark } from "@/components/layout/BrandMark";
import { PhoneIcon, PinIcon } from "@/components/ui/icons";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { business, serviceAreaNames } from "@/config/business";
import { mainNav } from "@/config/navigation";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { groupOpeningHours, type DayKey } from "@/lib/openingHours";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const tDays = useTranslations("days");
  const tWhatsApp = useTranslations("whatsapp");
  const format = useFormatter();
  const locale = useLocale() as Locale;

  const hourGroups = groupOpeningHours();

  function dayRangeLabel(days: DayKey[]): string {
    if (days.length === 1) return tDays(days[0]);
    return `${tDays(days[0])} – ${tDays(days[days.length - 1])}`;
  }

  return (
    <footer className="mt-auto border-t border-ink-200 bg-ink-50">
      <div className="container-content grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4">
          <BrandMark name={tCommon("brandName")} />
          <p className="text-sm leading-relaxed text-ink-500">
            {tCommon("tagline")}
          </p>
          <WhatsAppButton
            label={tCommon("whatsappCta")}
            message={tWhatsApp("general")}
            size="sm"
          />
        </div>

        <nav aria-labelledby="footer-links">
          <h2
            id="footer-links"
            className="text-sm font-bold tracking-wide uppercase"
          >
            {t("quickLinks")}
          </h2>
          <ul className="mt-4 flex flex-col gap-2 text-sm">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-sm text-ink-600 hover:text-brand-700 hover:underline"
                >
                  {tNav(item.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-bold tracking-wide uppercase">
            {t("contact")}
          </h2>
          <ul className="mt-4 flex flex-col gap-3 text-sm text-ink-600">
            <li>
              <a
                href={`tel:${business.phone.e164}`}
                className="flex items-center gap-2 rounded-sm hover:text-brand-700"
              >
                <PhoneIcon className="shrink-0 text-brand-700" />
                <span dir="ltr">{business.phone.display}</span>
              </a>
            </li>
            <li className="flex items-start gap-2">
              <PinIcon className="mt-1 shrink-0 text-brand-700" />
              <span>
                {locale === "ar"
                  ? `${business.address.street}، ${business.address.district}`
                  : `${business.address.streetEn}, ${business.address.districtEn}`}
                <br />
                {locale === "ar"
                  ? `${business.address.city}، ${business.address.country}`
                  : `${business.address.cityEn}, ${business.address.countryEn}`}
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold tracking-wide uppercase">
            {t("openingHours")}
          </h2>
          <dl className="mt-4 flex flex-col gap-2 text-sm text-ink-600">
            {hourGroups.map((group) => (
              <div
                key={group.days.join("-")}
                className="flex justify-between gap-4"
              >
                <dt>{dayRangeLabel(group.days)}</dt>
                <dd dir="ltr" className="text-ink-500">
                  {group.hours
                    ? `${group.hours.opens} – ${group.hours.closes}`
                    : t("closed")}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-sm text-ink-500">
            {t("serviceAreas", {
              areas: format.list(serviceAreaNames(locale).slice(0, 6), {
                type: "unit",
              }),
            })}
          </p>
        </div>
      </div>

      <div className="border-t border-ink-200">
        <div className="container-content flex flex-col gap-1 py-6 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {t("rights", {
              year: new Date().getFullYear(),
              name: tCommon("brandName"),
            })}
          </p>
          <p>{t("licence", { number: business.licenceNumber })}</p>
        </div>
      </div>
    </footer>
  );
}
