import { business } from "@/config/business";

export type DayKey = keyof typeof business.openingHours;
export type DayHours = { opens: string; closes: string } | null;

/** The Saudi week starts on Sunday; Friday is the weekly rest day. */
export const dayOrder: readonly DayKey[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export type OpeningHoursGroup = {
  days: DayKey[];
  hours: DayHours;
};

function sameHours(a: DayHours, b: DayHours): boolean {
  if (a === null || b === null) return a === b;
  return a.opens === b.opens && a.closes === b.closes;
}

/**
 * Collapses consecutive days that share the same hours, so the footer can show
 * "Sunday – Thursday 08:00–20:00" instead of five identical rows. The same
 * grouping feeds the schema.org openingHoursSpecification.
 */
export function groupOpeningHours(
  hours: Record<DayKey, DayHours> = business.openingHours,
): OpeningHoursGroup[] {
  return dayOrder.reduce<OpeningHoursGroup[]>((groups, day) => {
    const dayHours = hours[day];
    const previous = groups.at(-1);

    if (previous && sameHours(previous.hours, dayHours)) {
      previous.days.push(day);
      return groups;
    }

    groups.push({ days: [day], hours: dayHours });
    return groups;
  }, []);
}
