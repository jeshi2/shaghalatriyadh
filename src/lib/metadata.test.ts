import { describe, expect, it } from "vitest";
import { site } from "@/config/site";
import {
  buildPageMetadata,
  languageAlternates,
  localeUrl,
  ogImageUrl,
} from "./metadata";

describe("localeUrl", () => {
  it("builds the locale root without a trailing slash", () => {
    expect(localeUrl("ar")).toBe(`${site.url}/ar`);
    expect(localeUrl("en", "/")).toBe(`${site.url}/en`);
  });

  it("prefixes nested paths with the locale", () => {
    expect(localeUrl("en", "/services/nanny")).toBe(
      `${site.url}/en/services/nanny`,
    );
  });

  it("tolerates a path without a leading slash", () => {
    expect(localeUrl("ar", "about")).toBe(`${site.url}/ar/about`);
  });
});

describe("languageAlternates", () => {
  it("lists every locale plus x-default", () => {
    expect(languageAlternates("/contact")).toEqual({
      "ar-QA": `${site.url}/ar/contact`,
      "en-QA": `${site.url}/en/contact`,
      "x-default": `${site.url}/ar/contact`,
    });
  });

  it("points x-default at Arabic, the primary language", () => {
    expect(languageAlternates("/")["x-default"]).toBe(
      languageAlternates("/")["ar-QA"],
    );
  });
});

describe("buildPageMetadata", () => {
  const metadata = buildPageMetadata({
    locale: "ar",
    path: "/services",
    title: "الخدمات المنزلية",
    description: "وصف الصفحة",
    siteName: "قطر لخدمات المنازل",
  });

  it("sets the canonical URL for the current locale", () => {
    expect(metadata.alternates?.canonical).toBe(`${site.url}/ar/services`);
  });

  it("declares hreflang alternates for the same path", () => {
    expect(metadata.alternates?.languages).toEqual(
      languageAlternates("/services"),
    );
  });

  it("describes the page for Open Graph in the right locale", () => {
    expect(metadata.openGraph).toMatchObject({
      type: "website",
      url: `${site.url}/ar/services`,
      locale: "ar_QA",
      alternateLocale: ["en_QA"],
      title: "الخدمات المنزلية",
    });
  });

  it("attaches the generated social card at the documented size", () => {
    expect(metadata.openGraph).toMatchObject({
      images: [
        {
          url: ogImageUrl("ar"),
          width: 1200,
          height: 630,
          alt: "قطر لخدمات المنازل",
        },
      ],
    });
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      images: [ogImageUrl("ar")],
    });
  });

  it("derives the social card URL from the locale", () => {
    expect(ogImageUrl("en")).toBe(`${site.url}/en/opengraph-image`);
  });
});
