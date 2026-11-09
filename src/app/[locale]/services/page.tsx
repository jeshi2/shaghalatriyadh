import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FinalCta } from "@/components/sections/FinalCta";
import { ServiceCard } from "@/components/services/ServiceCard";
import { Section, SectionHeading } from "@/components/ui/Section";
import { services } from "@/content/services";
import { requireLocale } from "@/i18n/locale";
import { buildPageMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/services">): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = requireLocale(localeParam);
  const t = await getTranslations({ locale, namespace: "servicesPage" });

  const tCommon = await getTranslations({ locale, namespace: "common" });

  return buildPageMetadata({
    locale,
    path: "/services",
    title: t("metaTitle"),
    description: t("metaDescription"),
    siteName: tCommon("brandName"),
  });
}

export default async function ServicesPage({
  params,
}: PageProps<"/[locale]/services">) {
  const { locale: localeParam } = await params;
  const locale = requireLocale(localeParam);
  setRequestLocale(locale);

  const t = await getTranslations("servicesPage");
  const tServices = await getTranslations("services");
  const tSection = await getTranslations("home.servicesSection");

  return (
    <>
      <Section aria-labelledby="services-title">
        <SectionHeading
          id="services-title"
          level="h1"
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ slug, icon: Icon }) => (
            <li key={slug}>
              <ServiceCard
                title={tServices(`${slug}.name`)}
                description={tServices(`${slug}.summary`)}
                href={`/services/${slug}`}
                icon={<Icon />}
                highlights={tServices.raw(`${slug}.highlights`) as string[]}
                ctaLabel={tSection("cardCta")}
              />
            </li>
          ))}
        </ul>
      </Section>

      <FinalCta />
    </>
  );
}
