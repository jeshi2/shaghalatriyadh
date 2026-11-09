import axe from "axe-core";
import { expect } from "vitest";

/**
 * Runs axe against a rendered fragment and fails with the offending rules.
 *
 * `region` is disabled because components are rendered outside a page shell in
 * these tests, and colour contrast cannot be evaluated in jsdom (no layout) —
 * it is covered by the design token tests in src/app/theme.test.ts instead.
 */
export async function expectNoAccessibilityViolations(
  container: HTMLElement,
): Promise<void> {
  const results = await axe.run(container, {
    rules: {
      region: { enabled: false },
      "color-contrast": { enabled: false },
    },
  });

  const summary = results.violations.map(
    (violation) =>
      `${violation.id} (${violation.impact}): ${violation.help} — ${violation.nodes
        .map((node) => node.html)
        .join(", ")}`,
  );

  expect(summary, summary.join("\n")).toEqual([]);
}
