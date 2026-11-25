import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FinalCta } from "@/components/sections/FinalCta";
import { ButtonLink } from "@/components/ui/Button";
import { Badge, Card } from "@/components/ui/Card";
import { CheckIcon } from "@/components/ui/icons";
import { Section, SectionHeading } from "@/components/ui/Section";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { serviceAreaNames } from "@/config/business";
import { getService, services, serviceSlugs } from "@/content/services";
import { JsonLd } from "@/components/seo/JsonLd";
import { Link } from "@/i18n/navigation";
import { requireLocale } from "@/i18n/locale";
import { buildPageMetadata, localeUrl } from "@/lib/metadata";
import { buildBreadcrumbs, buildService } from "@/lib/structuredData";

/** One static page per service, per locale. */
export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/services/[slug]">): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = requireLocale(localeParam);
  if (!getService(slug)) return {};

  const t = await getTranslations({ locale, namespace: "services" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const tDetail = await getTranslations({
    locale,
    namespace: "servicesPage.detail",
  });
  const tSeo = await getTranslations({ locale, namespace: "seo" });

  const name = t(`${slug}.name`);

  return buildPageMetadata({
    locale,
    path: `/services/${slug}`,
    // The city belongs in the title: it is what people search for.
    title: tDetail("metaTitle", { service: name }),
    description: tDetail("metaDescription", {
      summary: t(`${slug}.summary`),
    }),
    siteName: tCommon("brandName"),
    keywords: [name, ...(tSeo.raw("keywords") as string[])],
  });
}

export default async function ServiceDetailPage({
  params,
}: PageProps<"/[locale]/services/[slug]">) {
  const { locale: localeParam, slug } = await params;
  const locale = requireLocale(localeParam);
  const service = getService(slug);

  if (!service) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations("services");
  const tPage = await getTranslations("servicesPage.detail");
  const tCommon = await getTranslations("common");
  const tWhatsApp = await getTranslations("whatsapp");

  const tNav = await getTranslations("nav");
  const tServicesPage = await getTranslations("servicesPage");
  const pageUrl = localeUrl(locale, `/services/${slug}`);

  const Icon = service.icon;
  const highlights = t.raw(`${slug}.highlights`) as string[];
  const includes = t.raw(`${slug}.includes`) as string[];
  const otherServices = services.filter((item) => item.slug !== slug);

  return (
    <>
      <Section aria-labelledby="service-title">
        <nav aria-label={tPage("backToServices")} className="mb-8">
          <Link
            href="/services"
            className="rounded-sm text-sm font-semibold text-brand-700 hover:underline"
          >
            {tPage("backToServices")}
          </Link>
        </nav>

        <div className="grid gap-12 lg:grid-cols-[2fr_1fr] lg:items-start">
          <div className="flex flex-col gap-6">
            <span
              className="flex size-14 items-center justify-center rounded-card bg-brand-50 text-3xl text-brand-700"
              aria-hidden="true"
            >
              <Icon />
            </span>

            <SectionHeading
              id="service-title"
              level="h1"
              title={t(`${slug}.name`)}
              description={t(`${slug}.summary`)}
            />

            <p className="max-w-prose leading-relaxed text-ink-600">
              {t(`${slug}.description`)}
            </p>

            <div>
              <h2 className="text-xl font-bold">{tPage("includesTitle")}</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {includes.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-ink-600"
                  >
                    <CheckIcon className="mt-1 shrink-0 text-brand-700" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="flex flex-col gap-6">
            <Card>
              <h2 className="text-lg font-bold">{tPage("highlightsTitle")}</h2>
              <ul className="flex flex-col gap-2">
                {highlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-ink-600"
                  >
                    <CheckIcon className="mt-1 shrink-0 text-brand-700" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-2 border-t border-ink-200 pt-4">
                <h3 className="text-sm font-bold tracking-wide uppercase text-ink-500">
                  {tPage("idealForTitle")}
                </h3>
                <p className="mt-2 text-sm text-ink-600">
                  {t(`${slug}.idealFor`)}
                </p>
              </div>
              <WhatsAppButton
                label={tCommon("whatsappCta")}
                message={tWhatsApp("service", {
                  service: t(`${slug}.name`),
                })}
                fullWidth
              />
            </Card>

            <nav aria-labelledby="other-services">
              <h2 id="other-services" className="text-lg font-bold">
                {tPage("otherServices")}
              </h2>
              <ul className="mt-3 flex flex-col gap-2">
                {otherServices.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/services/${item.slug}`}
                      className="rounded-sm text-sm text-ink-600 hover:text-brand-700 hover:underline"
                    >
                      {t(`${item.slug}.name`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 className="text-lg font-bold">{tPage("areasTitle")}</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {serviceAreaNames(locale)
                  .slice(0, 8)
                  .map((area) => (
                    <li key={area}>
                      <Badge tone="neutral">{area}</Badge>
                    </li>
                  ))}
              </ul>
              <p className="mt-3 text-sm text-ink-500">{tPage("areasNote")}</p>
            </div>

            <ButtonLink href="/contact" variant="outline" size="sm">
              {tPage("askAbout")}
            </ButtonLink>
          </aside>
        </div>
      </Section>

      <FinalCta />

      <JsonLd
        data={buildService({
          name: t(`${slug}.name`),
          description: t(`${slug}.description`),
          serviceType: t(`${slug}.name`),
          url: pageUrl,
          providerName: tCommon("brandName"),
          providerUrl: localeUrl(locale, "/"),
          locale,
        })}
      />
      <JsonLd
        data={buildBreadcrumbs([
          { name: tNav("home"), url: localeUrl(locale, "/") },
          {
            name: tServicesPage("eyebrow"),
            url: localeUrl(locale, "/services"),
          },
          { name: t(`${slug}.name`), url: pageUrl },
        ])}
      />
    </>
  );
}
