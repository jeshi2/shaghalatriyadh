import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ComponentProps, ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import messages from "@/messages/en.json";
import { LocaleSwitcher } from "./LocaleSwitcher";

// next-intl's navigation helpers depend on the App Router context, which does
// not exist in jsdom, so they are replaced with minimal stand-ins.
vi.mock("@/i18n/navigation", () => ({
  usePathname: () => "/services",
  Link: ({
    href,
    locale,
    children,
    ...rest
  }: ComponentProps<"a"> & { locale?: string; children: ReactNode }) => (
    <a href={`/${locale}${href}`} {...rest}>
      {children}
    </a>
  ),
}));

function renderSwitcher(locale: "ar" | "en" = "en") {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LocaleSwitcher />
    </NextIntlClientProvider>,
  );
}

describe("LocaleSwitcher", () => {
  it("offers both locales, labelled in their own language", () => {
    renderSwitcher();

    expect(screen.getByRole("link", { name: /English/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /العربية/ })).toBeInTheDocument();
  });

  it("keeps the visitor on the same page when switching locale", () => {
    renderSwitcher();

    expect(screen.getByRole("link", { name: /العربية/ })).toHaveAttribute(
      "href",
      "/ar/services",
    );
  });

  it("marks the active locale for assistive technology", () => {
    renderSwitcher("en");

    expect(screen.getByRole("link", { name: "English" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(screen.getByRole("link", { name: /العربية/ })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("is exposed as a labelled navigation landmark", () => {
    renderSwitcher();

    expect(
      screen.getByRole("navigation", { name: "Language" }),
    ).toBeInTheDocument();
  });
});
