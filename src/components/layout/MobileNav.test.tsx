import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import messages from "@/messages/en.json";
import { MobileNav } from "./MobileNav";

vi.mock("@/i18n/navigation", () => ({
  usePathname: () => "/services",
  Link: ({ href, children, ...rest }: ComponentProps<"a">) => (
    <a href={`/en${href}`} {...rest}>
      {children}
    </a>
  ),
}));

function renderNav() {
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <MobileNav />
    </NextIntlClientProvider>,
  );

  return {
    toggle: () => screen.getByRole("button"),
  };
}

describe("MobileNav", () => {
  it("starts closed with the panel hidden", () => {
    const { toggle } = renderNav();

    expect(toggle()).toHaveAttribute("aria-expanded", "false");
    expect(toggle()).toHaveAccessibleName("Open menu");
    // `hidden` keeps the panel out of the accessibility tree entirely.
    expect(screen.queryByRole("link", { name: "Contact" })).toBeNull();
  });

  it("opens the panel and exposes the navigation links", () => {
    const { toggle } = renderNav();

    fireEvent.click(toggle());

    expect(toggle()).toHaveAttribute("aria-expanded", "true");
    expect(toggle()).toHaveAccessibleName("Close menu");
    expect(screen.getByRole("link", { name: "Contact" })).toBeVisible();
    expect(screen.getByRole("link", { name: /WhatsApp/ })).toBeVisible();
  });

  it("points the toggle at the panel it controls", () => {
    const { toggle } = renderNav();

    fireEvent.click(toggle());
    const panelId = toggle().getAttribute("aria-controls");

    expect(panelId).toBeTruthy();
    expect(document.getElementById(panelId as string)).not.toBeNull();
  });

  it("closes again on a second click", () => {
    const { toggle } = renderNav();

    fireEvent.click(toggle());
    fireEvent.click(toggle());

    expect(toggle()).toHaveAttribute("aria-expanded", "false");
  });

  it("closes on Escape", () => {
    const { toggle } = renderNav();

    fireEvent.click(toggle());
    fireEvent.keyDown(document, { key: "Escape" });

    expect(toggle()).toHaveAttribute("aria-expanded", "false");
  });

  it("marks the current page inside the panel", () => {
    const { toggle } = renderNav();

    fireEvent.click(toggle());

    expect(screen.getByRole("link", { name: "Services" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});
