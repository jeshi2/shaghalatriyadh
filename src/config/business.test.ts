import { describe, expect, it } from "vitest";
import {
  business,
  cityName,
  countryName,
  formatSaudiLocalPhone,
  formatSaudiPhone,
  serviceAreaNames,
} from "./business";

describe("formatSaudiPhone", () => {
  it("formats an E.164 Saudi mobile for display", () => {
    expect(formatSaudiPhone("+966596249823")).toBe("+966 59 624 9823");
  });

  it("tolerates spaces and dashes in the input", () => {
    expect(formatSaudiPhone("+966 59-624 9823")).toBe("+966 59 624 9823");
  });

  it("returns non-Saudi or malformed numbers unchanged", () => {
    expect(formatSaudiPhone("+447700900000")).toBe("+447700900000");
    expect(formatSaudiPhone("not-a-number")).toBe("not-a-number");
  });
});

describe("formatSaudiLocalPhone", () => {
  it("shows the local 05X form Saudi customers recognise", () => {
    expect(formatSaudiLocalPhone("+966596249823")).toBe("059 624 9823");
  });

  it("returns anything else unchanged", () => {
    expect(formatSaudiLocalPhone("+201234567890")).toBe("+201234567890");
  });
});

describe("business configuration", () => {
  it("uses the business WhatsApp line in wa.me digits-only format", () => {
    expect(business.whatsapp.number).toBe("966596249823");
    expect(business.whatsapp.number).toMatch(/^966\d{9}$/);
  });

  it("keeps the phone and the WhatsApp line in sync", () => {
    expect(business.phone.e164.replace(/\D/g, "")).toBe(
      business.whatsapp.number,
    );
  });

  it("is located in Riyadh, Saudi Arabia", () => {
    expect(business.address.city).toBe("الرياض");
    expect(business.address.cityEn).toBe("Riyadh");
    expect(business.address.countryCode).toBe("SA");
    // Central Riyadh, to roughly one degree.
    expect(business.geo.latitude).toBeCloseTo(24.7, 0);
    expect(business.geo.longitude).toBeCloseTo(46.7, 0);
  });

  it("closes on Friday, the Saudi rest day, and opens the rest of the week", () => {
    expect(business.openingHours.friday).toBeNull();
    expect(business.openingHours.sunday).not.toBeNull();
    expect(business.openingHours.saturday).not.toBeNull();
  });

  it("names every served district in both languages", () => {
    expect(business.serviceAreas.length).toBeGreaterThanOrEqual(10);
    for (const area of business.serviceAreas) {
      expect(area.ar.trim()).not.toBe("");
      expect(area.en.trim()).not.toBe("");
      // Arabic names must actually be Arabic script.
      expect(area.ar).toMatch(/[؀-ۿ]/);
    }
  });

  it("covers the districts Riyadh customers search for", () => {
    const arabic = serviceAreaNames("ar");
    expect(arabic).toContain("العليا");
    expect(arabic).toContain("النرجس");
    expect(arabic).toContain("الملقا");
    expect(serviceAreaNames("en")).toContain("Al Olaya");
  });

  it("uses unique district keys", () => {
    const keys = business.serviceAreas.map((area) => area.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("localises the city and country names", () => {
    expect(cityName("ar")).toBe("الرياض");
    expect(cityName("en")).toBe("Riyadh");
    expect(countryName("ar")).toBe("المملكة العربية السعودية");
    expect(countryName("en")).toBe("Saudi Arabia");
  });
});
