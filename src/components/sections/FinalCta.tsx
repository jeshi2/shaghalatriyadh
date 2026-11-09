import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/Section";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";

export function FinalCta() {
  const t = useTranslations("home.finalCta");
  const tCommon = useTranslations("common");

  return (
    <Section tone="brand" aria-labelledby="final-cta-title">
      <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
        <SectionHeading
          id="final-cta-title"
          title={t("title")}
          description={t("description")}
          tone="inverted"
        />
        <div className="flex flex-wrap gap-3">
          <WhatsAppButton label={tCommon("whatsappCta")} size="lg" />
          <ButtonLink
            href="/contact"
            size="lg"
            className="bg-white text-brand-700 hover:bg-brand-50"
          >
            {t("secondaryCta")}
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
