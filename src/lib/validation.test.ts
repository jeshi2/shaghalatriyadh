import { describe, expect, it } from "vitest";
import {
  contactFormLimits,
  isValidPhone,
  validateContactForm,
  type ContactFormValues,
} from "./validation";

const allowed = ["nanny", "cooking", "other"];

function values(overrides: Partial<ContactFormValues> = {}): ContactFormValues {
  return {
    name: "Noora Al-Kuwari",
    phone: "",
    service: "nanny",
    area: "",
    details: "We need a nanny for two children, three days a week.",
    ...overrides,
  };
}

describe("isValidPhone", () => {
  it("accepts international and spaced formats", () => {
    expect(isValidPhone("+974 3322 1100")).toBe(true);
    expect(isValidPhone("033221100")).toBe(true);
    expect(isValidPhone("+974-3322-1100")).toBe(true);
    expect(isValidPhone("(974) 3322.1100")).toBe(true);
  });

  it("rejects letters and too few or too many digits", () => {
    expect(isValidPhone("call me")).toBe(false);
    expect(isValidPhone("12345")).toBe(false);
    expect(isValidPhone("1234567890123456")).toBe(false);
  });
});

describe("validateContactForm", () => {
  it("passes a complete submission", () => {
    expect(validateContactForm(values(), allowed)).toEqual({});
  });

  it("requires a name", () => {
    expect(validateContactForm(values({ name: "   " }), allowed).name).toBe(
      "nameRequired",
    );
    expect(validateContactForm(values({ name: "A" }), allowed).name).toBe(
      "nameTooShort",
    );
    expect(
      validateContactForm(
        values({ name: "x".repeat(contactFormLimits.nameMax + 1) }),
        allowed,
      ).name,
    ).toBe("nameTooLong");
  });

  it("requires a service from the catalogue", () => {
    expect(validateContactForm(values({ service: "" }), allowed).service).toBe(
      "serviceRequired",
    );
    expect(
      validateContactForm(values({ service: "gardening" }), allowed).service,
    ).toBe("serviceRequired");
    expect(
      validateContactForm(values({ service: "other" }), allowed).service,
    ).toBeUndefined();
  });

  it("treats the phone number as optional but validates it when present", () => {
    expect(
      validateContactForm(values({ phone: "" }), allowed).phone,
    ).toBeUndefined();
    expect(validateContactForm(values({ phone: "abc" }), allowed).phone).toBe(
      "phoneInvalid",
    );
  });

  it("requires usable details", () => {
    expect(validateContactForm(values({ details: "" }), allowed).details).toBe(
      "detailsRequired",
    );
    expect(
      validateContactForm(values({ details: "help" }), allowed).details,
    ).toBe("detailsTooShort");
    expect(
      validateContactForm(
        values({ details: "x".repeat(contactFormLimits.detailsMax + 1) }),
        allowed,
      ).details,
    ).toBe("detailsTooLong");
  });

  it("reports every invalid field at once", () => {
    expect(
      validateContactForm(
        values({ name: "", service: "", details: "", phone: "abc" }),
        allowed,
      ),
    ).toEqual({
      name: "nameRequired",
      service: "serviceRequired",
      phone: "phoneInvalid",
      details: "detailsRequired",
    });
  });

  it("ignores surrounding whitespace", () => {
    const errors = validateContactForm(
      values({ name: "  Ali  ", details: `  ${"a".repeat(20)}  ` }),
      allowed,
    );
    expect(errors).toEqual({});
  });
});
