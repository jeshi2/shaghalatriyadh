import { describe, expect, it } from "vitest";
import {
  dayOrder,
  groupOpeningHours,
  type DayHours,
  type DayKey,
} from "./openingHours";

const open = { opens: "08:00", closes: "20:00" };

function hours(overrides: Partial<Record<DayKey, DayHours>> = {}) {
  return dayOrder.reduce(
    (acc, day) => ({ ...acc, [day]: open, ...overrides }),
    {} as Record<DayKey, DayHours>,
  );
}

describe("groupOpeningHours", () => {
  it("collapses a whole week of identical hours into one group", () => {
    const groups = groupOpeningHours(hours());

    expect(groups).toHaveLength(1);
    expect(groups[0].days).toEqual([...dayOrder]);
    expect(groups[0].hours).toEqual(open);
  });

  it("splits a closed day out of the open range", () => {
    const groups = groupOpeningHours(hours({ friday: null }));

    expect(groups.map((group) => group.days)).toEqual([
      ["sunday", "monday", "tuesday", "wednesday", "thursday"],
      ["friday"],
      ["saturday"],
    ]);
    expect(groups[1].hours).toBeNull();
  });

  it("keeps days with different hours apart", () => {
    const groups = groupOpeningHours(
      hours({ thursday: { opens: "08:00", closes: "14:00" } }),
    );

    expect(groups).toHaveLength(3);
    expect(groups[1].days).toEqual(["thursday"]);
    expect(groups[1].hours).toEqual({ opens: "08:00", closes: "14:00" });
  });

  it("starts the week on Sunday, as in Qatar", () => {
    expect(dayOrder[0]).toBe("sunday");
    expect(dayOrder).toHaveLength(7);
  });
});
