import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Card } from "@/components/ui/Card";
import { Section, SectionHeading } from "@/components/ui/Section";
import { CheckIcon, ClockIcon } from "@/components/ui/icons";
import { requireLocale } from "@/i18n/locale";
import { buildPageMetadata } from "@/lib/metadata";

type Step = { title: string; description: string; need: string };

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/how-it-works">): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = requireLocale(localeParam);
  const t = await getTranslations({ locale, namespace: "howItWorksPage" });

  const tCommon = await getTranslations({ locale, namespace: "common" });

  return buildPageMetadata({
    locale,
    path: "/how-it-works",
    title: t("metaTitle"),
    description: t("metaDescription"),
    siteName: tCommon("brandName"),
  });
}

export default async function HowItWorksPage({
  params,
}: PageProps<"/[locale]/how-it-works">) {
  const { locale: localeParam } = await params;
  const locale = requireLocale(localeParam);
  setRequestLocale(locale);

  const t = await getTranslations("howItWorksPage");
  const steps = t.raw("steps") as Step[];
  const documents = t.raw("documents") as string[];

  return (
    <>
      <Section aria-labelledby="how-title">
        <SectionHeading
          id="how-title"
          level="h1"
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />

        <h2 className="mt-12 text-2xl font-bold">{t("stepsTitle")}</h2>
        <ol className="mt-6 flex flex-col gap-6">
          {steps.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span
                className="flex size-10 shrink-0 items-center justify-center rounded-pill bg-brand-700 font-bold text-white"
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold">{step.title}</h3>
                <p className="max-w-prose leading-relaxed text-ink-600">
                  {step.description}
                </p>
                <p className="text-sm font-medium text-brand-700">
                  {step.need}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="muted" aria-labelledby="how-documents">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 id="how-documents" className="text-2xl font-bold">
              {t("documentsTitle")}
            </h2>
            <ul className="mt-6 flex flex-col gap-3">
              {documents.map((document) => (
                <li
                  key={document}
                  className="flex items-start gap-2 text-ink-600"
                >
                  <CheckIcon className="mt-1 shrink-0 text-brand-700" />
                  <span>{document}</span>
                </li>
              ))}
            </ul>
          </div>

          <Card>
            <span
              className="flex size-12 items-center justify-center rounded-card bg-sand-100 text-2xl text-sand-600"
              aria-hidden="true"
            >
              <ClockIcon />
            </span>
            <h2 className="text-lg font-bold">{t("timingTitle")}</h2>
            <p className="leading-relaxed text-ink-600">
              {t("timingDescription")}
            </p>
          </Card>
        </div>
      </Section>

      <Faq headingId="how-faq-title" />
      <FinalCta />
    </>
  );
}
