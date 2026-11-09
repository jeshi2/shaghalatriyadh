import { useTranslations } from "next-intl";
import { ServiceCard } from "@/components/services/ServiceCard";
import { ButtonLink } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/Section";
import { featuredServices } from "@/content/services";

export function ServicesOverview() {
  const t = useTranslations("home.servicesSection");
  const tServices = useTranslations("services");

  return (
    <Section tone="muted" aria-labelledby="services-overview-title">
      <SectionHeading
        id="services-overview-title"
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />

      <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featuredServices.map(({ slug, icon: Icon }) => (
          <li key={slug}>
            <ServiceCard
              title={tServices(`${slug}.name`)}
              description={tServices(`${slug}.summary`)}
              href={`/services/${slug}`}
              icon={<Icon />}
              highlights={tServices.raw(`${slug}.highlights`) as string[]}
              ctaLabel={t("cardCta")}
            />
          </li>
        ))}
      </ul>

      <div className="mt-10">
        <ButtonLink href="/services" variant="outline">
          {t("allServices")}
        </ButtonLink>
      </div>
    </Section>
  );
}
