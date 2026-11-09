import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button, buttonClasses, ExternalButtonLink } from "./Button";

describe("buttonClasses", () => {
  it("defaults to the primary medium button", () => {
    const classes = buttonClasses();
    expect(classes).toContain("bg-brand-700");
    expect(classes).toContain("min-h-12");
  });

  it("applies the requested variant and size", () => {
    const classes = buttonClasses({ variant: "whatsapp", size: "lg" });
    expect(classes).toContain("bg-whatsapp");
    expect(classes).toContain("min-h-14");
    expect(classes).not.toContain("bg-brand-700");
  });

  it("keeps every size at a 44px minimum touch target", () => {
    for (const size of ["sm", "md", "lg"] as const) {
      expect(buttonClasses({ size })).toMatch(/min-h-(11|12|14)/);
    }
  });

  it("supports full width and extra classes", () => {
    const classes = buttonClasses({ fullWidth: true, className: "mt-4" });
    expect(classes).toContain("w-full");
    expect(classes).toContain("mt-4");
  });
});

describe("Button", () => {
  it('defaults to type="button" so it never submits a form by accident', () => {
    render(<Button>Send</Button>);
    expect(screen.getByRole("button", { name: "Send" })).toHaveAttribute(
      "type",
      "button",
    );
  });

  it("can be an explicit submit button", () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole("button", { name: "Submit" })).toHaveAttribute(
      "type",
      "submit",
    );
  });
});

describe("ExternalButtonLink", () => {
  it("hardens links that open in a new tab", () => {
    render(
      <ExternalButtonLink href="https://wa.me/97400000000" target="_blank">
        WhatsApp
      </ExternalButtonLink>,
    );

    expect(screen.getByRole("link", { name: "WhatsApp" })).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
  });

  it("leaves same-tab links without a rel attribute", () => {
    render(
      <ExternalButtonLink href="tel:+97400000000">Call</ExternalButtonLink>,
    );

    expect(screen.getByRole("link", { name: "Call" })).not.toHaveAttribute(
      "rel",
    );
  });
});
