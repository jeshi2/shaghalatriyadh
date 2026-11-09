import { HouseIcon } from "@/components/ui/icons";
import { Link } from "@/i18n/navigation";

type BrandMarkProps = {
  /** Translated company name. */
  name: string;
  /** Short descriptor shown under the name on wide screens. */
  tagline?: string;
};

/**
 * Wordmark used in the header and footer. A placeholder glyph stands in for
 * the real logo — drop an SVG in `public/` and swap the icon when branding is
 * supplied.
 */
export function BrandMark({ name, tagline }: BrandMarkProps) {
  return (
    <Link href="/" className="flex items-center gap-3 rounded-sm">
      <span
        className="flex size-10 shrink-0 items-center justify-center rounded-card bg-brand-700 text-xl text-white"
        aria-hidden="true"
      >
        <HouseIcon />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-base font-bold text-ink-900">{name}</span>
        {tagline ? (
          <span className="hidden text-xs text-ink-500 sm:block">
            {tagline}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
