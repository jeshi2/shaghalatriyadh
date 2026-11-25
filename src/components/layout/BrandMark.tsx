import { BrandIcon } from "@/components/ui/icons";
import { Link } from "@/i18n/navigation";

type BrandMarkProps = {
  /** Translated company name. */
  name: string;
  /** Short descriptor shown under the name on wide screens. */
  tagline?: string;
};

/**
 * Wordmark used in the header and footer: the brand mark in a navy tile,
 * followed by the company name as live text so it stays translatable.
 */
export function BrandMark({ name, tagline }: BrandMarkProps) {
  return (
    <Link href="/" className="flex items-center gap-3 rounded-sm">
      <span
        className="flex size-10 shrink-0 items-center justify-center rounded-card bg-brand-700 text-xl text-white"
        aria-hidden="true"
      >
        <BrandIcon />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-base font-bold text-ink-900">{name}</span>
        {tagline ? (
          <span className="hidden text-xs text-ink-500 xl:block">
            {tagline}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
