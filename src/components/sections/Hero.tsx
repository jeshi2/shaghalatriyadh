import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/Button";
import { CheckIcon } from "@/components/ui/icons";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { featuredServices } from "@/content/services";

export function Hero() {
  const t = useTranslations("home.hero");
  const tCommon = useTranslations("common");
  const tServices = useTranslations("services");
  const tSection = useTranslations("home.servicesSection");

  const trust = t.raw("trust") as string[];

  return (
    <section className="border-b border-ink-200 bg-gradient-to-b from-brand-50 to-white">
      <div className="container-content grid gap-12 py-16 sm:py-24 lg:grid-cols-2 lg:items-center">
        <div className="flex flex-col gap-6">
          <p className="text-sm font-semibold tracking-wide text-brand-700 uppercase">
            {t("eyebrow")}
          </p>
          <h1 className="text-3xl leading-tight sm:text-4xl lg:text-5xl">
            {t("title")}
          </h1>
          <p className="max-w-prose text-base leading-relaxed text-ink-600 sm:text-lg">
            {t("subtitle")}
          </p>

          <div className="flex flex-wrap gap-3">
            <WhatsAppButton label={tCommon("whatsappCta")} size="lg" />
            <ButtonLink href="/services" variant="outline" size="lg">
              {t("secondaryCta")}
            </ButtonLink>
          </div>

          <ul className="flex flex-col gap-2 pt-2">
            {trust.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-sm text-ink-600"
              >
                <CheckIcon className="shrink-0 text-brand-700" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Service shortcuts instead of a stock photo: useful on arrival and
            nothing to replace later. */}
        <ul className="grid gap-3 sm:grid-cols-2">
          {featuredServices.map(({ slug, icon: Icon }) => (
            <li key={slug}>
              <ButtonLink
                href={`/services/${slug}`}
                variant="ghost"
                className="h-full w-full justify-start gap-3 rounded-card border border-ink-200 bg-white px-4 py-4 text-start shadow-soft hover:border-brand-200 hover:bg-brand-50"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-card bg-brand-50 text-xl text-brand-700">
                  <Icon />
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="font-semibold text-ink-900">
                    {tServices(`${slug}.name`)}
                  </span>
                  <span className="text-xs font-normal text-ink-500">
                    {tSection("cardCta")}
                  </span>
                </span>
              </ButtonLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
