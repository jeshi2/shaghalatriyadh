import { describe, expect, it } from "vitest";
import { getDirection, localeHtmlLang, localeLabels, routing } from "./routing";

describe("routing configuration", () => {
  it("makes Arabic the default locale", () => {
    expect(routing.defaultLocale).toBe("ar");
  });

  it("always prefixes the locale so every page has one canonical URL", () => {
    expect(routing.localePrefix).toBe("always");
  });

  it("supports exactly Arabic and English", () => {
    expect(routing.locales).toEqual(["ar", "en"]);
  });
});

describe("direction handling", () => {
  it("renders Arabic right-to-left", () => {
    expect(getDirection("ar")).toBe("rtl");
  });

  it("renders English left-to-right", () => {
    expect(getDirection("en")).toBe("ltr");
  });
});

describe("locale metadata", () => {
  it("provides a Saudi BCP 47 tag for each locale", () => {
    expect(localeHtmlLang).toEqual({ ar: "ar-SA", en: "en-SA" });
  });

  it("labels each locale in its own language", () => {
    expect(localeLabels.ar).toBe("العربية");
    expect(localeLabels.en).toBe("English");
  });

  it("covers every configured locale", () => {
    for (const locale of routing.locales) {
      expect(localeLabels[locale]).toBeTruthy();
      expect(localeHtmlLang[locale]).toBeTruthy();
      expect(["rtl", "ltr"]).toContain(getDirection(locale));
    }
  });
});
