import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { ArrowIcon, CheckIcon } from "@/components/ui/icons";
import { Link } from "@/i18n/navigation";

type ServiceCardProps = {
  title: string;
  description: string;
  /** Internal href, locale prefix added by the i18n-aware Link. */
  href: string;
  icon: ReactNode;
  /** Up to three short selling points. */
  highlights?: readonly string[];
  ctaLabel: string;
};

/**
 * The whole card is one link: the heading carries the accessible name and the
 * stretched overlay makes the full surface clickable without nesting
 * interactive elements inside each other.
 */
export function ServiceCard({
  title,
  description,
  href,
  icon,
  highlights,
  ctaLabel,
}: ServiceCardProps) {
  return (
    <Card interactive className="relative h-full">
      <span
        className="flex size-12 items-center justify-center rounded-card bg-brand-50 text-2xl text-brand-700"
        aria-hidden="true"
      >
        {icon}
      </span>

      <h3 className="text-lg font-bold">
        <Link
          href={href}
          className="rounded-sm after:absolute after:inset-0 after:content-['']"
        >
          {title}
        </Link>
      </h3>

      <p className="text-sm leading-relaxed text-ink-500">{description}</p>

      {highlights?.length ? (
        <ul className="mt-1 flex flex-col gap-1.5">
          {highlights.map((highlight) => (
            <li
              key={highlight}
              className="flex items-start gap-2 text-sm text-ink-600"
            >
              <CheckIcon className="mt-1 shrink-0 text-brand-700" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <span className="mt-auto flex items-center gap-1.5 pt-2 text-sm font-semibold text-brand-700">
        {ctaLabel}
        <ArrowIcon />
      </span>
    </Card>
  );
}
