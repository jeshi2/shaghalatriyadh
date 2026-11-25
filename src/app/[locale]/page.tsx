import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/seo/JsonLd";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { ServicesOverview } from "@/components/sections/ServicesOverview";
import { ServiceAreas } from "@/components/sections/ServiceAreas";
import { ValueProps } from "@/components/sections/ValueProps";
import type { FaqItem } from "@/components/sections/Faq";
import { requireLocale } from "@/i18n/locale";
import { buildPageMetadata } from "@/lib/metadata";
import { buildFaqPage } from "@/lib/structuredData";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = requireLocale(localeParam);
  const t = await getTranslations({ locale, namespace: "common" });
  const tHome = await getTranslations({ locale, namespace: "home" });
  const tSeo = await getTranslations({ locale, namespace: "seo" });

  return {
    ...buildPageMetadata({
      locale,
      path: "/",
      title: tHome("metaTitle"),
      description: tHome("metaDescription"),
      siteName: t("brandName"),
      keywords: tSeo.raw("keywords") as string[],
    }),
    // The homepage title is written for search results, so it stands alone
    // instead of going through the "%s | brand" template.
    title: { absolute: tHome("metaTitle") },
  };
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale: localeParam } = await params;
  const locale = requireLocale(localeParam);
  setRequestLocale(locale);

  const tFaq = await getTranslations("home.faq");
  const faqItems = tFaq.raw("items") as FaqItem[];

  return (
    <>
      <Hero />
      <ValueProps />
      <ServicesOverview />
      <ServiceAreas />
      <HowItWorks />
      <Faq />
      <FinalCta />
      {/* FAQ markup lives only here, so the same questions are not marked up twice. */}
      <JsonLd data={buildFaqPage(faqItems)} />
    </>
  );
}
