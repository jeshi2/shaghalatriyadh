import { describe, expect, it } from "vitest";
import { buildWhatsAppUrl, composeWhatsAppMessage } from "./whatsapp";

describe("buildWhatsAppUrl", () => {
  it("builds a wa.me link from the configured number", () => {
    expect(buildWhatsAppUrl({ number: "966596249823" })).toBe(
      "https://wa.me/966596249823",
    );
  });

  it("strips plus signs, spaces and dashes from the number", () => {
    expect(buildWhatsAppUrl({ number: "+966 59-624 9823" })).toBe(
      "https://wa.me/966596249823",
    );
  });

  it("percent-encodes the prefilled message", () => {
    const url = buildWhatsAppUrl({
      number: "966596249823",
      message: "Hello, I need a cleaner & a nanny",
    });

    expect(url).toBe(
      "https://wa.me/966596249823?text=Hello%2C%20I%20need%20a%20cleaner%20%26%20a%20nanny",
    );
  });

  it("encodes Arabic messages and newlines", () => {
    const url = buildWhatsAppUrl({
      number: "966596249823",
      message: "مرحبًا\nأرغب في خدمة تنظيف",
    });

    expect(url).toContain("?text=");
    expect(url).toContain("%0A");
    expect(decodeURIComponent(url.split("?text=")[1])).toBe(
      "مرحبًا\nأرغب في خدمة تنظيف",
    );
  });

  it("omits the query string when there is no message", () => {
    expect(buildWhatsAppUrl({ number: "966596249823", message: "   " })).toBe(
      "https://wa.me/966596249823",
    );
  });
});

describe("composeWhatsAppMessage", () => {
  it("joins the provided lines with newlines", () => {
    expect(
      composeWhatsAppMessage([
        "Hello, my name is Ali.",
        "Service needed: Nanny",
      ]),
    ).toBe("Hello, my name is Ali.\nService needed: Nanny");
  });

  it("drops lines the visitor left empty", () => {
    expect(
      composeWhatsAppMessage([
        "Hello",
        "",
        null,
        undefined,
        false,
        "   ",
        "Details: two children",
      ]),
    ).toBe("Hello\nDetails: two children");
  });

  it("trims each line", () => {
    expect(composeWhatsAppMessage(["  Hello  ", "  Area: Riyadh "])).toBe(
      "Hello\nArea: Riyadh",
    );
  });

  it("survives a round trip through the URL builder", () => {
    const message = composeWhatsAppMessage([
      "مرحبًا، أنا نورة.",
      "الخدمة المطلوبة: جليسة أطفال",
    ]);
    const url = buildWhatsAppUrl({ number: "966596249823", message });

    expect(decodeURIComponent(url.split("?text=")[1])).toBe(message);
  });
});
