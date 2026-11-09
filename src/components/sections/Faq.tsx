import { useTranslations } from "next-intl";
import { Section, SectionHeading } from "@/components/ui/Section";

export type FaqItem = { question: string; answer: string };

type FaqProps = {
  /** Overrides the homepage FAQ when a page has its own questions. */
  items?: FaqItem[];
  headingId?: string;
};

/**
 * Built on <details>/<summary>: keyboard accessible and fully functional
 * without JavaScript, so the answers are also readable by crawlers.
 */
export function Faq({ items, headingId = "faq-title" }: FaqProps) {
  const t = useTranslations("home.faq");
  const faqItems = items ?? (t.raw("items") as FaqItem[]);

  return (
    <Section tone="muted" aria-labelledby={headingId}>
      <SectionHeading
        id={headingId}
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />

      <div className="mt-10 flex max-w-3xl flex-col gap-3">
        {faqItems.map((item) => (
          <details
            key={item.question}
            className="group rounded-card border border-ink-200 bg-white px-5 py-4 shadow-soft open:border-brand-200"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink-900 marker:content-none">
              {item.question}
              <span
                aria-hidden="true"
                className="shrink-0 text-xl leading-none text-brand-700 transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </Section>
  );
}
