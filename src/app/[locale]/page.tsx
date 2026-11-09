import { setRequestLocale } from "next-intl/server";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { ServicesOverview } from "@/components/sections/ServicesOverview";
import { ValueProps } from "@/components/sections/ValueProps";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <ValueProps />
      <ServicesOverview />
      <HowItWorks />
      <Faq />
      <FinalCta />
    </>
  );
}
