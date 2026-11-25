import { business, countryName, serviceAreaNames } from "@/config/business";
import type { Locale } from "@/i18n/routing";
import { dayOrder, groupOpeningHours, type DayKey } from "@/lib/openingHours";

/**
 * schema.org builders. They take already-translated strings so the same
 * function serves both locales, and they are pure objects so they can be
 * asserted on in tests.
 */

type JsonLdObject = Record<string, unknown>;

const dayNames = {
  sunday: "Sunday",
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
} as const satisfies Record<DayKey, string>;

function openingHoursSpecification(): JsonLdObject[] {
  return groupOpeningHours()
    .filter((group) => group.hours !== null)
    .map((group) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: group.days.map((day) => dayNames[day]),
      opens: group.hours?.opens,
      closes: group.hours?.closes,
    }));
}

function postalAddress(locale: Locale): JsonLdObject {
  const isArabic = locale === "ar";

  return {
    "@type": "PostalAddress",
    streetAddress: isArabic
      ? business.address.street
      : business.address.streetEn,
    addressLocality: isArabic ? business.address.city : business.address.cityEn,
    addressRegion: isArabic
      ? business.address.region
      : business.address.regionEn,
    addressCountry: business.address.countryCode,
    postalCode: business.address.postalCode,
  };
}

export type LocalBusinessOptions = {
  name: string;
  description: string;
  url: string;
  locale: Locale;
  /** Absolute URL of the Open Graph image, used as the business image. */
  image?: string;
};

export function buildLocalBusiness({
  name,
  description,
  url,
  locale,
  image,
}: LocalBusinessOptions): JsonLdObject {
  const sameAs = Object.values(business.social).filter((link): link is string =>
    Boolean(link),
  );

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${url}#business`,
    name,
    legalName: business.legalName,
    description,
    url,
    telephone: business.phone.e164,
    identifier: business.licenceNumber,
    address: postalAddress(locale),
    geo: {
      "@type": "GeoCoordinates",
      latitude: business.geo.latitude,
      longitude: business.geo.longitude,
    },
    // Riyadh first, then each district: this is the local-SEO signal that
    // ties the business to the city people are searching in.
    areaServed: [
      {
        "@type": "City",
        name: locale === "ar" ? business.address.city : business.address.cityEn,
      },
      ...serviceAreaNames(locale).map((area) => ({
        "@type": "Place",
        name: area,
      })),
    ],
    openingHoursSpecification: openingHoursSpecification(),
    ...(image ? { image } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function buildWebSite({
  name,
  url,
  locale,
}: {
  name: string;
  url: string;
  locale: string;
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    inLanguage: locale,
  };
}

export type ServiceSchemaOptions = {
  name: string;
  description: string;
  url: string;
  providerName: string;
  providerUrl: string;
  serviceType: string;
  locale: Locale;
};

export function buildService({
  name,
  description,
  url,
  providerName,
  providerUrl,
  serviceType,
  locale,
}: ServiceSchemaOptions): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType,
    url,
    provider: {
      "@type": "LocalBusiness",
      "@id": `${providerUrl}#business`,
      name: providerName,
      url: providerUrl,
    },
    areaServed: {
      "@type": "City",
      name: locale === "ar" ? business.address.city : business.address.cityEn,
      containedInPlace: {
        "@type": "Country",
        name: countryName(locale),
      },
    },
  };
}

export function buildFaqPage(
  items: readonly { question: string; answer: string }[],
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildBreadcrumbs(
  items: readonly { name: string; url: string }[],
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Exported for tests: the canonical day order used by the specification. */
export const structuredDataDayOrder = dayOrder;
