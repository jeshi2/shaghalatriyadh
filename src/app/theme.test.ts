import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Colour contrast is a property of the design tokens, so it is asserted
 * against globals.css directly: changing a token re-runs these checks.
 */
const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

function token(name: string): string {
  const match = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!match) throw new Error(`Design token --color-${name} is not defined`);
  return match[1];
}

function relativeLuminance(hex: string): number {
  const channels = (hex.replace("#", "").match(/../g) ?? []).map((pair) => {
    const value = parseInt(pair, 16) / 255;
    return value <= 0.03928
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(foreground: string, background: string): number {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

const WHITE = "#ffffff";

/** WCAG 2.2 AA: 4.5:1 for body text, 3:1 for large text and UI components. */
const bodyTextPairs: [string, string, string][] = [
  ["brand-700 on white", token("brand-700"), WHITE],
  ["ink-500 on white", token("ink-500"), WHITE],
  ["ink-600 on ink-50", token("ink-600"), token("ink-50")],
  ["ink-500 on ink-50", token("ink-500"), token("ink-50")],
  ["ink-800 on white", token("ink-800"), WHITE],
  ["white on brand-700", WHITE, token("brand-700")],
  ["sand-200 on brand-700", token("sand-200"), token("brand-700")],
  ["brand-50 on brand-700", token("brand-50"), token("brand-700")],
  ["ink-900 on whatsapp", token("ink-900"), token("whatsapp")],
  ["ink-900 on whatsapp-dark", token("ink-900"), token("whatsapp-dark")],
];

describe("design token contrast", () => {
  it.each(bodyTextPairs)("%s meets AA for body text", (_name, fg, bg) => {
    expect(contrast(fg, bg)).toBeGreaterThanOrEqual(4.5);
  });

  it("keeps WhatsApp actions readable, which white text would not", () => {
    // The official WhatsApp green with white text is 1.98:1, so the buttons
    // use ink-900 instead. This guards that decision.
    expect(contrast(WHITE, token("whatsapp"))).toBeLessThan(4.5);
    expect(
      contrast(token("ink-900"), token("whatsapp")),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it("keeps the muted text colour above the AA floor", () => {
    // ink-400 is reserved for borders and decoration, never body text.
    expect(contrast(token("ink-400"), WHITE)).toBeLessThan(4.5);
    expect(css).toContain("--color-ink-400");
  });
});
