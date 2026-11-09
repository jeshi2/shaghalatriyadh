import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/seo/JsonLd";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { ServicesOverview } from "@/components/sections/ServicesOverview";
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

  return {
    ...buildPageMetadata({
      locale,
      path: "/",
      title: `${t("brandName")} — ${t("tagline")}`,
      description: t("tagline"),
      siteName: t("brandName"),
    }),
    // The homepage title already carries the brand, so skip the template.
    title: { absolute: `${t("brandName")} — ${t("tagline")}` },
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
      <HowItWorks />
      <Faq />
      <FinalCta />
      {/* FAQ markup lives only here, so the same questions are not marked up twice. */}
      <JsonLd data={buildFaqPage(faqItems)} />
    </>
  );
}
