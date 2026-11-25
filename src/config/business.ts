import type { Locale } from "@/i18n/routing";

/**
 * Single source of truth for every piece of business information shown on the
 * site. Nothing else in the codebase should hard-code a phone number, an
 * address or an opening time.
 *
 * The business operates in Riyadh, Saudi Arabia. Values marked PLACEHOLDER
 * must be replaced with the real details before the site goes live; each one
 * can also be overridden with an environment variable (see `.env.example`).
 */

const env = {
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE,
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
};

/**
 * The business WhatsApp line: local 0596249823, which is +966 59 624 9823 in
 * international format and 966596249823 in the digits-only form wa.me needs.
 */
const WHATSAPP_NUMBER = "966596249823";
const PHONE_E164 = "+966596249823";

/** A district the business serves, named in both site languages. */
export type ServiceArea = {
  key: string;
  ar: string;
  en: string;
};

export const business = {
  /** PLACEHOLDER — trading name in Arabic (the primary language). */
  legalNameAr: "خدمات منزلية الرياض",
  /** PLACEHOLDER — trading name in English. */
  legalName: "Riyadh Home Services",

  /** PLACEHOLDER — Saudi commercial registration (السجل التجاري). */
  licenceNumber: "CR-0000000000",

  whatsapp: {
    number: env.whatsapp ?? WHATSAPP_NUMBER,
  },

  phone: {
    e164: env.phone ?? PHONE_E164,
    get display() {
      return formatSaudiPhone(this.e164);
    },
    /** How Saudi customers usually write it: 05X XXX XXXX. */
    get local() {
      return formatSaudiLocalPhone(this.e164);
    },
  },

  /** PLACEHOLDER — replace with the real enquiries inbox. */
  email: env.email ?? "info@example.sa",

  address: {
    /** PLACEHOLDER — street address. */
    street: "طريق الملك فهد، مبنى 0000",
    streetEn: "King Fahd Road, Building 0000",
    /** PLACEHOLDER — district. */
    district: "العليا",
    districtEn: "Al Olaya",
    city: "الرياض",
    cityEn: "Riyadh",
    region: "منطقة الرياض",
    regionEn: "Riyadh Region",
    country: "المملكة العربية السعودية",
    countryEn: "Saudi Arabia",
    countryCode: "SA",
    /** PLACEHOLDER — postal code. */
    postalCode: "12211",
  },

  /** Central Riyadh — PLACEHOLDER until the office location is confirmed. */
  geo: {
    latitude: 24.7136,
    longitude: 46.6753,
  },

  /**
   * Opening hours in 24h local time (Asia/Riyadh). `null` means closed.
   * The Saudi working week runs Sunday to Thursday; Friday is the rest day.
   */
  openingHours: {
    sunday: { opens: "09:00", closes: "21:00" },
    monday: { opens: "09:00", closes: "21:00" },
    tuesday: { opens: "09:00", closes: "21:00" },
    wednesday: { opens: "09:00", closes: "21:00" },
    thursday: { opens: "09:00", closes: "21:00" },
    friday: null,
    saturday: { opens: "09:00", closes: "21:00" },
  },

  /**
   * Districts of Riyadh the business covers. These drive the footer, the
   * about page and the `areaServed` property of the LocalBusiness schema, so
   * they are the local-SEO surface of the site — keep them accurate.
   */
  serviceAreas: [
    { key: "olaya", ar: "العليا", en: "Al Olaya" },
    { key: "malqa", ar: "الملقا", en: "Al Malqa" },
    { key: "narjis", ar: "النرجس", en: "Al Narjis" },
    { key: "hittin", ar: "حطين", en: "Hittin" },
    { key: "yasmin", ar: "الياسمين", en: "Al Yasmin" },
    { key: "sahafa", ar: "الصحافة", en: "Al Sahafa" },
    { key: "aqiq", ar: "العقيق", en: "Al Aqiq" },
    { key: "qurtubah", ar: "قرطبة", en: "Qurtubah" },
    { key: "rabwah", ar: "الربوة", en: "Al Rabwah" },
    { key: "nasim", ar: "النسيم", en: "Al Naseem" },
    { key: "suwaidi", ar: "السويدي", en: "Al Suwaidi" },
    { key: "muruj", ar: "المروج", en: "Al Muruj" },
    { key: "ishbiliyah", ar: "إشبيلية", en: "Ishbiliyah" },
    { key: "munsiyah", ar: "المونسية", en: "Al Munsiyah" },
    { key: "diriyah", ar: "الدرعية", en: "Diriyah" },
  ] as const satisfies readonly ServiceArea[],

  /** PLACEHOLDER — set to a URL to show the link, or leave null to hide it. */
  social: {
    instagram: null as string | null,
    x: null as string | null,
    snapchat: null as string | null,
  },
} as const;

/** Formats an E.164 Saudi number as `+966 59 624 9823`. */
export function formatSaudiPhone(e164: string): string {
  const digits = e164.replace(/\D/g, "");
  if (digits.startsWith("966") && digits.length === 12) {
    return `+966 ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }
  return e164;
}

/** Formats an E.164 Saudi mobile in the local form `059 624 9823`. */
export function formatSaudiLocalPhone(e164: string): string {
  const digits = e164.replace(/\D/g, "");
  if (digits.startsWith("966") && digits.length === 12) {
    const national = `0${digits.slice(3)}`;
    return `${national.slice(0, 3)} ${national.slice(3, 6)} ${national.slice(6)}`;
  }
  return e164;
}

/** District names in the reading order of the requested locale. */
export function serviceAreaNames(locale: Locale): string[] {
  return business.serviceAreas.map((area) => area[locale]);
}

/** The city name, localised. */
export function cityName(locale: Locale): string {
  return locale === "ar" ? business.address.city : business.address.cityEn;
}

/** The country name, localised. */
export function countryName(locale: Locale): string {
  return locale === "ar"
    ? business.address.country
    : business.address.countryEn;
}

export type Business = typeof business;
