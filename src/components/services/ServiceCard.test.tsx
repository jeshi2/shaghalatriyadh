import { render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import { ServiceCard } from "./ServiceCard";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...rest }: ComponentProps<"a">) => (
    <a href={`/ar${href}`} {...rest}>
      {children}
    </a>
  ),
}));

function renderCard(props?: Partial<ComponentProps<typeof ServiceCard>>) {
  return render(
    <ServiceCard
      title="Home cleaning"
      description="Regular or one-off cleaning by vetted staff."
      href="/services/home-cleaning"
      icon={<span />}
      highlights={["Weekly or monthly", "Supplies included"]}
      ctaLabel="See details"
      {...props}
    />,
  );
}

describe("ServiceCard", () => {
  it("exposes the service as a single link named by its heading", () => {
    renderCard();

    expect(
      screen.getByRole("heading", { level: 3, name: "Home cleaning" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.getByRole("link", { name: "Home cleaning" })).toHaveAttribute(
      "href",
      "/ar/services/home-cleaning",
    );
  });

  it("lists the highlights", () => {
    renderCard();

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("Supplies included")).toBeInTheDocument();
  });

  it("omits the highlight list when there is nothing to show", () => {
    renderCard({ highlights: [] });

    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("renders the call to action label", () => {
    renderCard();

    expect(screen.getByText("See details")).toBeInTheDocument();
  });
});
