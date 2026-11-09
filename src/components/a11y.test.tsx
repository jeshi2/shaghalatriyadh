import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ComponentProps, ReactNode } from "react";
import { describe, it, vi } from "vitest";
import { ContactForm } from "@/components/forms/ContactForm";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Faq } from "@/components/sections/Faq";
import { ServiceCard } from "@/components/services/ServiceCard";
import { expectNoAccessibilityViolations } from "@/test/a11y";
import messages from "@/messages/en.json";

vi.mock("@/i18n/navigation", () => ({
  usePathname: () => "/",
  Link: ({ href, children, ...rest }: ComponentProps<"a">) => (
    <a href={`/en${href}`} {...rest}>
      {children}
    </a>
  ),
}));

function renderWithIntl(ui: ReactNode) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>,
  );
}

describe("accessibility", () => {
  it("header has no violations", async () => {
    const { container } = renderWithIntl(<Header />);
    await expectNoAccessibilityViolations(container);
  });

  it("footer has no violations", async () => {
    const { container } = renderWithIntl(<Footer />);
    await expectNoAccessibilityViolations(container);
  });

  it("open mobile navigation has no violations", async () => {
    const { container } = renderWithIntl(<MobileNav />);
    fireEvent.click(screen.getByRole("button"));
    await expectNoAccessibilityViolations(container);
  });

  it("contact form has no violations, before and after validation", async () => {
    const { container } = renderWithIntl(<ContactForm />);
    await expectNoAccessibilityViolations(container);

    fireEvent.click(screen.getByRole("button", { name: /WhatsApp/ }));
    await expectNoAccessibilityViolations(container);
  });

  it("FAQ disclosure has no violations", async () => {
    const { container } = renderWithIntl(<Faq />);
    await expectNoAccessibilityViolations(container);
  });

  it("service card has no violations", async () => {
    const { container } = renderWithIntl(
      <ServiceCard
        title="Home cleaning"
        description="Regular cleaning by vetted staff."
        href="/services/part-time-cleaning"
        icon={<span />}
        highlights={["Weekly or monthly"]}
        ctaLabel="See details"
      />,
    );
    await expectNoAccessibilityViolations(container);
  });
});
