import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionProps = {
  children: ReactNode;
  /** Vertical rhythm is set here so pages never hand-pick paddings. */
  tone?: "default" | "muted" | "brand";
  as?: ElementType;
  id?: string;
  className?: string;
  "aria-labelledby"?: string;
};

const tones = {
  default: "bg-white",
  muted: "bg-ink-50",
  brand: "bg-brand-700 text-white",
} as const;

export function Section({
  children,
  tone = "default",
  as: Tag = "section",
  id,
  className,
  ...rest
}: SectionProps) {
  return (
    <Tag
      id={id}
      className={cn("py-16 sm:py-20", tones[tone], className)}
      {...rest}
    >
      <div className="container-content">{children}</div>
    </Tag>
  );
}

type SectionHeadingProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  /** `h2` on inner sections, `h1` only once per page. */
  level?: "h1" | "h2" | "h3";
  align?: "start" | "center";
  id?: string;
  tone?: "default" | "inverted";
};

export function SectionHeading({
  title,
  eyebrow,
  description,
  level: Heading = "h2",
  align = "start",
  id,
  tone = "default",
}: SectionHeadingProps) {
  const inverted = tone === "inverted";

  return (
    <div
      className={cn(
        "flex max-w-2xl flex-col gap-3",
        align === "center" && "mx-auto text-center",
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "text-sm font-semibold tracking-wide uppercase",
            inverted ? "text-sand-200" : "text-brand-700",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <Heading
        id={id}
        className={cn(
          Heading === "h1"
            ? "text-3xl sm:text-4xl lg:text-5xl"
            : "text-2xl sm:text-3xl",
          inverted && "text-white",
        )}
      >
        {title}
      </Heading>
      {description ? (
        <p
          className={cn(
            "text-base leading-relaxed sm:text-lg",
            inverted ? "text-brand-50" : "text-ink-500",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
