import { describe, expect, it } from "vitest";
import ar from "./ar.json";
import en from "./en.json";

type Messages = Record<string, unknown>;

/**
 * Flattens a nested message object into dot-separated keys. Arrays are walked
 * by index, so a list with a different number of items in one locale shows up
 * as a missing key rather than passing silently.
 */
function flatten(messages: Messages, prefix = ""): string[] {
  return Object.entries(messages).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return value !== null && typeof value === "object"
      ? flatten(value as Messages, path)
      : [path];
  });
}

/** Extracts ICU placeholders such as `{language}` from a message string. */
function placeholders(value: string): string[] {
  return [...value.matchAll(/\{(\w+)[,}]/g)].map((match) => match[1]).sort();
}

function valueAt(messages: Messages, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>(
      (acc, key) => (acc as Messages | undefined)?.[key],
      messages,
    );
}

/**
 * Keyword lists are researched separately for each language, so Arabic and
 * English legitimately hold a different number of terms. Everything else must
 * match key for key.
 */
const localeSpecific = ["seo.keywords"];

function isLocaleSpecific(key: string): boolean {
  return localeSpecific.some((prefix) => key.startsWith(`${prefix}.`));
}

const arKeys = flatten(ar as Messages).filter((key) => !isLocaleSpecific(key));
const enKeys = flatten(en as Messages).filter((key) => !isLocaleSpecific(key));

describe("translation dictionaries", () => {
  it("define the same keys in both locales", () => {
    expect(arKeys.filter((key) => !enKeys.includes(key))).toEqual([]);
    expect(enKeys.filter((key) => !arKeys.includes(key))).toEqual([]);
  });

  it("never ship an empty translation", () => {
    for (const locale of [
      { name: "ar", messages: ar as Messages, keys: arKeys },
      { name: "en", messages: en as Messages, keys: enKeys },
    ]) {
      for (const key of locale.keys) {
        const value = valueAt(locale.messages, key);
        expect(
          typeof value === "string" && value.trim().length > 0,
          `${locale.name}: ${key} must be a non-empty string`,
        ).toBe(true);
      }
    }
  });

  it("gives both locales a non-empty keyword list", () => {
    for (const messages of [ar, en]) {
      const keywords = messages.seo.keywords;
      expect(Array.isArray(keywords)).toBe(true);
      expect(keywords.length).toBeGreaterThanOrEqual(5);
      for (const keyword of keywords) {
        expect(keyword.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("targets Riyadh in both keyword lists", () => {
    expect(ar.seo.keywords.some((term) => term.includes("الرياض"))).toBe(true);
    expect(
      en.seo.keywords.some((term) => term.toLowerCase().includes("riyadh")),
    ).toBe(true);
  });

  it("use the same ICU placeholders in both locales", () => {
    for (const key of enKeys) {
      const arValue = valueAt(ar as Messages, key);
      const enValue = valueAt(en as Messages, key);
      if (typeof arValue !== "string" || typeof enValue !== "string") continue;
      expect(placeholders(arValue), `placeholders differ for ${key}`).toEqual(
        placeholders(enValue),
      );
    }
  });
});
