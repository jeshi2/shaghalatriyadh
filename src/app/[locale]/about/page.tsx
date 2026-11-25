import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FinalCta } from "@/components/sections/FinalCta";
import { Badge, Card } from "@/components/ui/Card";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { Section, SectionHeading } from "@/components/ui/Section";
import {
  DocumentIcon,
  HeartHandsIcon,
  ShieldIcon,
  UsersIcon,
} from "@/components/ui/icons";
import { business, serviceAreaNames } from "@/config/business";
import { requireLocale } from "@/i18n/locale";
import { buildPageMetadata } from "@/lib/metadata";

const values = [
  { key: "clarity", icon: DocumentIcon },
  { key: "legal", icon: ShieldIcon },
  { key: "respect", icon: HeartHandsIcon },
  { key: "support", icon: UsersIcon },
] as const;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = requireLocale(localeParam);
  const t = await getTranslations({ locale, namespace: "aboutPage" });

  const tCommon = await getTranslations({ locale, namespace: "common" });

  return buildPageMetadata({
    locale,
    path: "/about",
    title: t("metaTitle"),
    description: t("metaDescription"),
    siteName: tCommon("brandName"),
  });
}

export default async function AboutPage({
  params,
}: PageProps<"/[locale]/about">) {
  const { locale: localeParam } = await params;
  const locale = requireLocale(localeParam);
  setRequestLocale(locale);

  const t = await getTranslations("aboutPage");
  const story = t.raw("story") as string[];

  return (
    <>
      <Section aria-labelledby="about-title">
        <SectionHeading
          id="about-title"
          level="h1"
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-[2fr_1fr] lg:items-start">
          <div>
            <h2 className="text-2xl font-bold">{t("storyTitle")}</h2>
            <div className="mt-4 flex max-w-prose flex-col gap-4 leading-relaxed text-ink-600">
              {story.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          </div>

          <Card>
            <h2 className="text-lg font-bold">{t("detailsTitle")}</h2>
            <dl className="flex flex-col gap-3 text-sm">
              <div>
                <dt className="font-medium text-ink-900">
                  {locale === "ar" ? business.legalNameAr : business.legalName}
                </dt>
                <dd className="text-ink-500">
                  {locale === "ar" ? business.legalName : business.legalNameAr}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-ink-900">
                  {locale === "ar"
                    ? `${business.address.city}، ${business.address.country}`
                    : `${business.address.cityEn}, ${business.address.countryEn}`}
                </dt>
                <dd className="text-ink-500">
                  {locale === "ar"
                    ? `${business.address.street}، ${business.address.district}`
                    : `${business.address.streetEn}, ${business.address.districtEn}`}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-ink-900">
                  {business.licenceNumber}
                </dt>
                <dd className="text-ink-500">{business.address.postalCode}</dd>
              </div>
            </dl>
          </Card>
        </div>
      </Section>

      <Section tone="muted" aria-labelledby="about-values">
        <SectionHeading id="about-values" title={t("valuesTitle")} />
        <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ key, icon: Icon }) => (
            <li key={key}>
              <FeatureCard
                icon={<Icon />}
                title={t(`values.${key}.title`)}
                description={t(`values.${key}.description`)}
              />
            </li>
          ))}
        </ul>
      </Section>

      <Section aria-labelledby="about-areas">
        <SectionHeading
          id="about-areas"
          title={t("areasTitle")}
          description={t("areasDescription")}
        />
        <ul className="mt-8 flex flex-wrap gap-2">
          {serviceAreaNames(locale).map((area) => (
            <li key={area}>
              <Badge tone="neutral">{area}</Badge>
            </li>
          ))}
        </ul>
      </Section>

      <FinalCta />
    </>
  );
}
