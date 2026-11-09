import { describe, expect, it } from "vitest";
import ar from "@/messages/ar.json";
import en from "@/messages/en.json";
import {
  featuredServices,
  getService,
  services,
  serviceSlugs,
} from "./services";

const dictionaries = [
  { locale: "ar", messages: ar.services as Record<string, unknown> },
  { locale: "en", messages: en.services as Record<string, unknown> },
];

type ServiceCopy = {
  name: string;
  summary: string;
  description: string;
  idealFor: string;
  highlights: string[];
  includes: string[];
};

describe("service catalogue", () => {
  it("uses unique, URL-safe slugs", () => {
    expect(new Set(serviceSlugs).size).toBe(services.length);
    for (const slug of serviceSlugs) {
      expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it("has copy for every service in both locales", () => {
    for (const { locale, messages } of dictionaries) {
      for (const slug of serviceSlugs) {
        const copy = messages[slug] as ServiceCopy | undefined;
        expect(copy, `${locale} is missing copy for ${slug}`).toBeDefined();
        expect(copy?.name).toBeTruthy();
        expect(copy?.summary).toBeTruthy();
        expect(copy?.description).toBeTruthy();
        expect(copy?.idealFor).toBeTruthy();
        expect(copy?.highlights.length).toBeGreaterThanOrEqual(2);
        expect(copy?.includes.length).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it("does not carry copy for services that no longer exist", () => {
    for (const { locale, messages } of dictionaries) {
      for (const key of Object.keys(messages)) {
        expect(
          serviceSlugs,
          `${locale} has orphaned copy for ${key}`,
        ).toContain(key);
      }
    }
  });

  it("gives every service an icon", () => {
    for (const service of services) {
      expect(typeof service.icon).toBe("function");
    }
  });

  it("looks a service up by slug", () => {
    expect(getService("nanny")?.slug).toBe("nanny");
    expect(getService("not-a-service")).toBeUndefined();
  });

  it("features services on the homepage", () => {
    expect(featuredServices.length).toBeGreaterThan(0);
    expect(featuredServices.every((service) => service.featured)).toBe(true);
  });
});
