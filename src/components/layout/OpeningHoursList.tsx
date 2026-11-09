import { useTranslations } from "next-intl";
import { groupOpeningHours, type DayKey } from "@/lib/openingHours";

/** Shared between the footer-style summary and the contact page. */
export function OpeningHoursList() {
  const t = useTranslations("footer");
  const tDays = useTranslations("days");

  function dayRangeLabel(days: DayKey[]): string {
    if (days.length === 1) return tDays(days[0]);
    return `${tDays(days[0])} – ${tDays(days[days.length - 1])}`;
  }

  return (
    <dl className="flex flex-col gap-2 text-sm text-ink-600">
      {groupOpeningHours().map((group) => (
        <div
          key={group.days.join("-")}
          className="flex justify-between gap-4 border-b border-ink-100 pb-2 last:border-0"
        >
          <dt className="font-medium">{dayRangeLabel(group.days)}</dt>
          <dd dir="ltr" className="text-ink-500">
            {group.hours
              ? `${group.hours.opens} – ${group.hours.closes}`
              : t("closed")}
          </dd>
        </div>
      ))}
    </dl>
  );
}
