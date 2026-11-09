import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";
import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";
import { ContactForm } from "./ContactForm";

function renderForm(locale: "ar" | "en" = "en") {
  const open = vi.fn();
  vi.stubGlobal("open", open);

  render(
    <NextIntlClientProvider
      locale={locale}
      messages={locale === "ar" ? arMessages : enMessages}
    >
      <ContactForm />
    </NextIntlClientProvider>,
  );

  return { open };
}

function fill(label: RegExp | string, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
}

function submit() {
  fireEvent.click(screen.getByRole("button", { name: /WhatsApp|واتساب/ }));
}

function completeEnglishForm() {
  fill(/^Name$/, "Noora Al-Kuwari");
  fill(/Service needed/, "nanny");
  fill(/Request details/, "Two children, three days a week, mornings.");
}

describe("ContactForm validation", () => {
  it("blocks submission and reports each missing field", () => {
    const { open } = renderForm();

    submit();

    expect(open).not.toHaveBeenCalled();
    expect(screen.getByText("Your name is required.")).toBeInTheDocument();
    expect(
      screen.getByText("Please choose the service you need."),
    ).toBeInTheDocument();
    expect(screen.getByText("Please describe what you need.")).toBeInTheDocument();
  });

  it("marks invalid fields for assistive technology", () => {
    renderForm();

    submit();

    const name = screen.getByLabelText(/^Name$/);
    expect(name).toHaveAttribute("aria-invalid", "true");
    expect(name).toHaveAccessibleDescription("Your name is required.");
  });

  it("moves focus to the first invalid field", () => {
    renderForm();

    submit();

    expect(screen.getByLabelText(/^Name$/)).toHaveFocus();
  });

  it("clears a field error as soon as it is edited", () => {
    renderForm();

    submit();
    expect(screen.getByText("Your name is required.")).toBeInTheDocument();

    fill(/^Name$/, "Noora");
    expect(screen.queryByText("Your name is required.")).not.toBeInTheDocument();
  });

  it("rejects an unusable phone number but accepts an empty one", () => {
    const { open } = renderForm();

    completeEnglishForm();
    fill(/Phone number/, "call me");
    submit();

    expect(open).not.toHaveBeenCalled();
    expect(
      screen.getByText("Enter a valid phone number or leave the field empty."),
    ).toBeInTheDocument();

    fill(/Phone number/, "");
    submit();
    expect(open).toHaveBeenCalledOnce();
  });
});

describe("ContactForm submission", () => {
  it("opens WhatsApp with the enquiry prefilled", () => {
    const { open } = renderForm();

    completeEnglishForm();
    fill(/Area/, "The Pearl");
    fill(/Phone number/, "+974 3322 1100");
    submit();

    expect(open).toHaveBeenCalledOnce();
    const [url, target, features] = open.mock.calls[0];
    expect(url).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
    expect(target).toBe("_blank");
    expect(features).toContain("noopener");

    const message = decodeURIComponent(String(url).split("?text=")[1]);
    expect(message).toContain("Hello, my name is Noora Al-Kuwari.");
    expect(message).toContain("Service needed: Nanny and childcare");
    expect(message).toContain("Area: The Pearl");
    expect(message).toContain("Contact number: +974 3322 1100");
    expect(message).toContain("Details: Two children, three days a week");
  });

  it("omits the optional lines that were left empty", () => {
    const { open } = renderForm();

    completeEnglishForm();
    submit();

    const message = decodeURIComponent(
      String(open.mock.calls[0][0]).split("?text=")[1],
    );
    expect(message).not.toContain("Area:");
    expect(message).not.toContain("Contact number:");
  });

  it("confirms the hand-off and offers a fallback link", () => {
    renderForm();

    completeEnglishForm();
    submit();

    const status = screen.getByRole("status");
    expect(status).toHaveTextContent(
      "WhatsApp opened with your message. Review it and press send.",
    );
    expect(
      screen.getByRole("link", { name: /If WhatsApp did not open/ }),
    ).toHaveAttribute("href", expect.stringContaining("wa.me"));
  });

  it("composes the message in Arabic when the locale is Arabic", () => {
    const { open } = renderForm("ar");

    fill(/الاسم/, "نورة الكواري");
    fill(/الخدمة المطلوبة/, "nanny");
    fill(/تفاصيل الطلب/, "طفلان، ثلاثة أيام في الأسبوع، فترة صباحية.");
    submit();

    const message = decodeURIComponent(
      String(open.mock.calls[0][0]).split("?text=")[1],
    );
    expect(message).toContain("مرحبًا، أنا نورة الكواري.");
    expect(message).toContain("الخدمة المطلوبة: جليسة أطفال");
  });
});
