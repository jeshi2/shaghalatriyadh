/**
 * Single source of truth for every piece of business information shown on the
 * site. Nothing else in the codebase should hard-code a phone number, an
 * address or an opening time.
 *
 * Values marked PLACEHOLDER must be replaced with the real details before the
 * site goes live. Each one can also be overridden with an environment variable
 * (see `.env.example`) so the same build can be reused across environments.
 */

const env = {
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE,
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
};

/** Digits only, international format, no `+` and no spaces (wa.me format). */
const WHATSAPP_NUMBER_PLACEHOLDER = "97400000000";

export const business = {
  /** PLACEHOLDER — legal/trading name of the company. */
  legalName: "Qatar Home Services",
  /** PLACEHOLDER — trading name in Arabic. */
  legalNameAr: "قطر لخدمات المنازل",

  /** PLACEHOLDER — commercial registration / licence number. */
  licenceNumber: "CR-0000000",

  whatsapp: {
    /** PLACEHOLDER — replace with the real WhatsApp business number. */
    number: env.whatsapp ?? WHATSAPP_NUMBER_PLACEHOLDER,
    isPlaceholder: !env.whatsapp,
  },

  phone: {
    /** PLACEHOLDER — replace with the real landline/mobile number. */
    e164: env.phone ?? "+97400000000",
    get display() {
      return formatQatarPhone(this.e164);
    },
  },

  /** PLACEHOLDER — replace with the real enquiries inbox. */
  email: env.email ?? "hello@example.qa",

  address: {
    /** PLACEHOLDER — street address. */
    street: "Building 00, Street 000, Zone 00",
    /** PLACEHOLDER — district/area. */
    district: "Al Sadd",
    city: "Doha",
    country: "Qatar",
    countryCode: "QA",
    /** PLACEHOLDER — postal/PO box. */
    poBox: "P.O. Box 00000",
  },

  /** Approximate coordinates of central Doha — PLACEHOLDER. */
  geo: {
    latitude: 25.2854,
    longitude: 51.531,
  },

  /**
   * Opening hours in 24h local time (Asia/Qatar). `null` means closed.
   * Schema.org day names are derived from the keys.
   */
  openingHours: {
    saturday: { opens: "08:00", closes: "20:00" },
    sunday: { opens: "08:00", closes: "20:00" },
    monday: { opens: "08:00", closes: "20:00" },
    tuesday: { opens: "08:00", closes: "20:00" },
    wednesday: { opens: "08:00", closes: "20:00" },
    thursday: { opens: "08:00", closes: "20:00" },
    friday: null,
  },

  /** Areas served across Qatar, used for local SEO and the footer. */
  serviceAreas: [
    "Doha",
    "Al Rayyan",
    "Al Wakrah",
    "Lusail",
    "The Pearl",
    "West Bay",
    "Al Khor",
    "Umm Salal",
    "Al Sadd",
    "Mesaimeer",
  ],

  /** PLACEHOLDER — set to `null` to hide a social link in the footer. */
  social: {
    instagram: null as string | null,
    facebook: null as string | null,
    x: null as string | null,
  },
} as const;

/** Formats an E.164 Qatari number as `+974 0000 0000` for display. */
export function formatQatarPhone(e164: string): string {
  const digits = e164.replace(/\D/g, "");
  if (digits.startsWith("974") && digits.length === 11) {
    return `+974 ${digits.slice(3, 7)} ${digits.slice(7)}`;
  }
  return e164;
}

export type Business = typeof business;
