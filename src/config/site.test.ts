import { describe, expect, it } from "vitest";
import { absoluteUrl, site } from "./site";

describe("absoluteUrl", () => {
  it("returns the bare origin for the site root", () => {
    expect(absoluteUrl("/")).toBe(site.url);
  });

  it("prefixes a missing leading slash", () => {
    expect(absoluteUrl("ar/services")).toBe(`${site.url}/ar/services`);
  });

  it("keeps nested paths intact", () => {
    expect(absoluteUrl("/en/contact")).toBe(`${site.url}/en/contact`);
  });
});

describe("site configuration", () => {
  it("never ends in a trailing slash", () => {
    expect(site.url.endsWith("/")).toBe(false);
  });

  it("declares Arabic as the default locale", () => {
    expect(site.defaultLocale).toBe("ar");
    expect(site.locales).toEqual(["ar", "en"]);
  });
});
