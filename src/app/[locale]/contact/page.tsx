import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { OpeningHoursList } from "@/components/layout/OpeningHoursList";
import { ExternalButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section, SectionHeading } from "@/components/ui/Section";
import { MailIcon, PhoneIcon, PinIcon } from "@/components/ui/icons";
import { ContactForm } from "@/components/forms/ContactForm";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { business } from "@/config/business";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contactPage" });

  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function ContactPage({
  params,
}: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
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

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        <Card>
          <span
            className="flex size-12 items-center justify-center rounded-card bg-whatsapp/10 text-2xl text-whatsapp-dark"
            aria-hidden="true"
          >
            <PhoneIcon />
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

        <Card>
          <span
            className="flex size-12 items-center justify-center rounded-card bg-brand-50 text-2xl text-brand-700"
            aria-hidden="true"
          >
            <MailIcon />
          </span>
          <h2 className="text-lg font-bold">{t("emailTitle")}</h2>
          <p className="text-sm leading-relaxed text-ink-500">
            {t("emailDescription")}
          </p>
          <ExternalButtonLink
            href={`mailto:${business.email}`}
            variant="outline"
            fullWidth
            className="mt-auto"
          >
            <span dir="ltr">{business.email}</span>
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
            {business.legalName}
            <br />
            {business.address.street}
            <br />
            {business.address.district}, {business.address.city}
            <br />
            {business.address.country} — {business.address.poBox}
          </address>
        </Card>

        <Card>
          <h2 className="text-lg font-bold">{t("hoursTitle")}</h2>
          <OpeningHoursList />
          <p className="text-xs text-ink-400">{t("hoursNote")}</p>
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
