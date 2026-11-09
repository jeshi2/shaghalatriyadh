import { describe, expect, it } from "vitest";
import { business, formatQatarPhone } from "./business";

describe("formatQatarPhone", () => {
  it("formats an E.164 Qatari number for display", () => {
    expect(formatQatarPhone("+97444001122")).toBe("+974 4400 1122");
  });

  it("tolerates spaces and dashes in the input", () => {
    expect(formatQatarPhone("+974 4400-1122")).toBe("+974 4400 1122");
  });

  it("returns non-Qatari or malformed numbers unchanged", () => {
    expect(formatQatarPhone("+442079460000")).toBe("+442079460000");
    expect(formatQatarPhone("not-a-number")).toBe("not-a-number");
  });
});

describe("business configuration", () => {
  it("exposes a WhatsApp number in wa.me format (digits only)", () => {
    expect(business.whatsapp.number).toMatch(/^\d{8,15}$/);
  });

  it("flags placeholder details so they are not shipped unnoticed", () => {
    // When NEXT_PUBLIC_WHATSAPP_NUMBER is unset the fallback is a placeholder.
    expect(business.whatsapp.isPlaceholder).toBe(
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER === undefined,
    );
  });

  it("serves areas inside Qatar", () => {
    expect(business.serviceAreas).toContain("Doha");
    expect(business.address.countryCode).toBe("QA");
  });
});
