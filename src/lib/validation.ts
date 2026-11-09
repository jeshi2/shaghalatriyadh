/**
 * Pure validation for the contact form. Returns message *keys* rather than
 * text, so the same rules serve both locales and can be unit tested without
 * rendering anything.
 */

export type ContactFormValues = {
  name: string;
  phone: string;
  service: string;
  area: string;
  details: string;
};

export type ContactFormField = keyof ContactFormValues;
export type ContactFormErrors = Partial<Record<ContactFormField, string>>;

export const contactFormLimits = {
  nameMin: 2,
  nameMax: 80,
  areaMax: 80,
  detailsMin: 10,
  detailsMax: 1000,
} as const;

/**
 * Accepts international and local formats: an optional leading `+`, then 7-15
 * digits, with spaces, dashes, dots or brackets allowed as separators.
 */
export function isValidPhone(value: string): boolean {
  const trimmed = value.trim();
  if (!/^\+?[\d\s().-]+$/.test(trimmed)) return false;

  const digits = trimmed.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

export function validateContactForm(
  values: ContactFormValues,
  /** Slugs accepted by the service field, plus the catch-all "other". */
  allowedServices: readonly string[],
): ContactFormErrors {
  const errors: ContactFormErrors = {};
  const name = values.name.trim();
  const details = values.details.trim();
  const area = values.area.trim();
  const phone = values.phone.trim();

  if (!name) {
    errors.name = "nameRequired";
  } else if (name.length < contactFormLimits.nameMin) {
    errors.name = "nameTooShort";
  } else if (name.length > contactFormLimits.nameMax) {
    errors.name = "nameTooLong";
  }

  if (!allowedServices.includes(values.service)) {
    errors.service = "serviceRequired";
  }

  if (phone && !isValidPhone(phone)) {
    errors.phone = "phoneInvalid";
  }

  if (area.length > contactFormLimits.areaMax) {
    errors.area = "areaTooLong";
  }

  if (!details) {
    errors.details = "detailsRequired";
  } else if (details.length < contactFormLimits.detailsMin) {
    errors.details = "detailsTooShort";
  } else if (details.length > contactFormLimits.detailsMax) {
    errors.details = "detailsTooLong";
  }

  return errors;
}
