import { describe, expect, it } from "vitest";
import { business } from "@/config/business";
import {
  buildBreadcrumbs,
  buildFaqPage,
  buildLocalBusiness,
  buildService,
  buildWebSite,
} from "./structuredData";

const url = "https://example.qa/ar";

describe("buildLocalBusiness", () => {
  const schema = buildLocalBusiness({
    name: "قطر لخدمات المنازل",
    description: "خدمات منزلية",
    url,
    image: `${url}/opengraph-image`,
  });

  it("is a LocalBusiness with a stable @id", () => {
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("LocalBusiness");
    expect(schema["@id"]).toBe(`${url}#business`);
  });

  it("carries the contact details from the business config", () => {
    expect(schema).toMatchObject({
      telephone: business.phone.e164,
      email: business.email,
      identifier: business.licenceNumber,
    });
  });

  it("describes the postal address and coordinates", () => {
    expect(schema.address).toMatchObject({
      "@type": "PostalAddress",
      addressLocality: business.address.city,
      addressCountry: business.address.countryCode,
    });
    expect(schema.geo).toMatchObject({ "@type": "GeoCoordinates" });
  });

  it("lists every served area as a City", () => {
    expect(schema.areaServed).toHaveLength(business.serviceAreas.length);
  });

  it("publishes only the days the office is open", () => {
    const spec = schema.openingHoursSpecification as {
      dayOfWeek: string[];
      opens: string;
      closes: string;
    }[];

    expect(spec.length).toBeGreaterThan(0);
    expect(spec.flatMap((entry) => entry.dayOfWeek)).not.toContain("Friday");
    for (const entry of spec) {
      expect(entry.opens).toMatch(/^\d{2}:\d{2}$/);
      expect(entry.closes).toMatch(/^\d{2}:\d{2}$/);
    }
  });

  it("omits sameAs while no social profiles are configured", () => {
    expect(schema.sameAs).toBeUndefined();
  });
});

describe("buildWebSite", () => {
  it("records the site language", () => {
    expect(buildWebSite({ name: "Site", url, locale: "ar-QA" })).toMatchObject({
      "@type": "WebSite",
      inLanguage: "ar-QA",
    });
  });
});

describe("buildService", () => {
  const schema = buildService({
    name: "Nanny",
    description: "Childcare",
    serviceType: "Nanny",
    url: `${url}/services/nanny`,
    providerName: "Qatar Home Services",
    providerUrl: url,
  });

  it("links the service to the business by @id", () => {
    expect(schema["@type"]).toBe("Service");
    expect(schema.provider).toMatchObject({ "@id": `${url}#business` });
  });

  it("states the country it is offered in", () => {
    expect(schema.areaServed).toMatchObject({
      "@type": "Country",
      name: business.address.country,
    });
  });
});

describe("buildFaqPage", () => {
  it("maps each entry to a Question with an accepted Answer", () => {
    const schema = buildFaqPage([
      { question: "Q1", answer: "A1" },
      { question: "Q2", answer: "A2" },
    ]);

    expect(schema["@type"]).toBe("FAQPage");
    expect(schema.mainEntity).toEqual([
      {
        "@type": "Question",
        name: "Q1",
        acceptedAnswer: { "@type": "Answer", text: "A1" },
      },
      {
        "@type": "Question",
        name: "Q2",
        acceptedAnswer: { "@type": "Answer", text: "A2" },
      },
    ]);
  });
});

describe("buildBreadcrumbs", () => {
  it("numbers the trail from one", () => {
    const schema = buildBreadcrumbs([
      { name: "Home", url },
      { name: "Services", url: `${url}/services` },
      { name: "Nanny", url: `${url}/services/nanny` },
    ]);

    expect(
      (schema.itemListElement as { position: number }[]).map(
        (item) => item.position,
      ),
    ).toEqual([1, 2, 3]);
  });
});
