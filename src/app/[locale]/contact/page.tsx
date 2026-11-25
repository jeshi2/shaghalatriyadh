import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { OpeningHoursList } from "@/components/layout/OpeningHoursList";
import { ExternalButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section, SectionHeading } from "@/components/ui/Section";
import { PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/ui/icons";
import { ContactForm } from "@/components/forms/ContactForm";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { business } from "@/config/business";
import { requireLocale } from "@/i18n/locale";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = requireLocale(localeParam);
  const t = await getTranslations({ locale, namespace: "contactPage" });

  const tCommon = await getTranslations({ locale, namespace: "common" });

  return buildPageMetadata({
    locale,
    path: "/contact",
    title: t("metaTitle"),
    description: t("metaDescription"),
    siteName: tCommon("brandName"),
  });
}

export default async function ContactPage({
  params,
}: PageProps<"/[locale]/contact">) {
  const { locale: localeParam } = await params;
  const locale = requireLocale(localeParam);
  setRequestLocale(locale);

  const t = await getTranslations("contactPage");
  const tCommon = await getTranslations("common");
  const tWhatsApp = await getTranslations("whatsapp");
  const tForm = await getTranslations("contactForm");

  return (
    <Section aria-labelledby="contact-title">
      <SectionHeading
        id="contact-title"
        level="h1"
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <Card>
          <span
            className="flex size-12 items-center justify-center rounded-card bg-whatsapp/15 text-2xl text-ink-900"
            aria-hidden="true"
          >
            <WhatsAppIcon />
          </span>
          <h2 className="text-lg font-bold">{t("whatsappTitle")}</h2>
          <p className="text-sm leading-relaxed text-ink-500">
            {t("whatsappDescription")}
          </p>
          <WhatsAppButton
            label={tCommon("whatsappCta")}
            message={tWhatsApp("general")}
            fullWidth
            className="mt-auto"
          />
        </Card>

        <Card>
          <span
            className="flex size-12 items-center justify-center rounded-card bg-brand-50 text-2xl text-brand-700"
            aria-hidden="true"
          >
            <PhoneIcon />
          </span>
          <h2 className="text-lg font-bold">{t("phoneTitle")}</h2>
          <p className="text-sm leading-relaxed text-ink-500">
            {t("phoneDescription")}
          </p>
          <ExternalButtonLink
            href={`tel:${business.phone.e164}`}
            variant="outline"
            fullWidth
            className="mt-auto"
          >
            <span dir="ltr">{business.phone.display}</span>
          </ExternalButtonLink>
        </Card>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <Card>
          <span
            className="flex size-12 items-center justify-center rounded-card bg-sand-100 text-2xl text-sand-600"
            aria-hidden="true"
          >
            <PinIcon />
          </span>
          <h2 className="text-lg font-bold">{t("addressTitle")}</h2>
          <address className="text-sm leading-relaxed text-ink-600 not-italic">
            {locale === "ar" ? business.legalNameAr : business.legalName}
            <br />
            {locale === "ar"
              ? business.address.street
              : business.address.streetEn}
            <br />
            {locale === "ar"
              ? `${business.address.district}، ${business.address.city}`
              : `${business.address.districtEn}, ${business.address.cityEn}`}
            <br />
            {locale === "ar"
              ? `${business.address.country} — ${business.address.postalCode}`
              : `${business.address.countryEn} — ${business.address.postalCode}`}
          </address>
        </Card>

        <Card>
          <h2 className="text-lg font-bold">{t("hoursTitle")}</h2>
          <OpeningHoursList />
          <p className="text-xs text-ink-500">{t("hoursNote")}</p>
        </Card>
      </div>

      <div className="mt-16 max-w-2xl">
        <h2 className="text-2xl font-bold">{tForm("title")}</h2>
        <p className="mt-3 leading-relaxed text-ink-600">
          {tForm("description")}
        </p>
        <div className="mt-8">
          <ContactForm />
        </div>
      </div>
    </Section>
  );
}
