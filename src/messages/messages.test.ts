import { describe, expect, it } from "vitest";
import ar from "./ar.json";
import en from "./en.json";

type Messages = Record<string, unknown>;

/** Flattens a nested message object into dot-separated keys. */
function flatten(messages: Messages, prefix = ""): string[] {
  return Object.entries(messages).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return value !== null && typeof value === "object" && !Array.isArray(value)
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

const arKeys = flatten(ar as Messages);
const enKeys = flatten(en as Messages);

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
