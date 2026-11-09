import { useTranslations } from "next-intl";
import { Section, SectionHeading } from "@/components/ui/Section";

type Step = { title: string; description: string };

export function HowItWorks() {
  const t = useTranslations("home.howItWorks");
  const steps = t.raw("steps") as Step[];

  return (
    <Section aria-labelledby="how-it-works-title">
      <SectionHeading
        id="how-it-works-title"
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />

      <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <li key={step.title} className="flex flex-col gap-3">
            <span
              className="flex size-10 items-center justify-center rounded-pill bg-brand-700 font-bold text-white"
              aria-hidden="true"
            >
              {index + 1}
            </span>
            <h3 className="text-lg font-bold">{step.title}</h3>
            <p className="text-sm leading-relaxed text-ink-500">
              {step.description}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
