import { useTranslations } from "next-intl";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { Section, SectionHeading } from "@/components/ui/Section";
import {
  ChatIcon,
  DocumentIcon,
  ShieldIcon,
  TagIcon,
} from "@/components/ui/icons";

const items = [
  { key: "vetted", icon: ShieldIcon },
  { key: "legal", icon: DocumentIcon },
  { key: "response", icon: ChatIcon },
  { key: "pricing", icon: TagIcon },
] as const;

export function ValueProps() {
  const t = useTranslations("home.valueProps");

  return (
    <Section aria-labelledby="value-props-title">
      <SectionHeading
        id="value-props-title"
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />
      <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ key, icon: Icon }) => (
          <li key={key}>
            <FeatureCard
              icon={<Icon />}
              title={t(`items.${key}.title`)}
              description={t(`items.${key}.description`)}
            />
          </li>
        ))}
      </ul>
    </Section>
  );
}
