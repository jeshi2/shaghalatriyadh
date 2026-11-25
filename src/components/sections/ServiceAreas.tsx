import { useLocale, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/Card";
import { Section, SectionHeading } from "@/components/ui/Section";
import { serviceAreaNames } from "@/config/business";
import type { Locale } from "@/i18n/routing";

/**
 * Names the districts the business covers. This is the main local-SEO block
 * on the homepage: the district names are the words Riyadh customers add to
 * their searches, and they are real visible copy rather than hidden keywords.
 */
export function ServiceAreas() {
  const t = useTranslations("home.areasSection");
  const locale = useLocale() as Locale;

  return (
    <Section aria-labelledby="service-areas-title">
      <SectionHeading
        id="service-areas-title"
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />
      <ul className="mt-8 flex flex-wrap gap-2">
        {serviceAreaNames(locale).map((area) => (
          <li key={area}>
            <Badge tone="neutral">{area}</Badge>
          </li>
        ))}
      </ul>
    </Section>
  );
}
