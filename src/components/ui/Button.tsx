import type { ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export type ButtonVariant =
  "primary" | "secondary" | "outline" | "ghost" | "whatsapp";

export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-pill text-center font-semibold whitespace-nowrap transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand-700 text-white hover:bg-brand-800 active:bg-brand-900",
  secondary: "bg-sand-200 text-ink-900 hover:bg-sand-300 active:bg-sand-400",
  outline:
    "border border-brand-700 bg-transparent text-brand-700 hover:bg-brand-50 active:bg-brand-100",
  ghost: "bg-transparent text-ink-700 hover:bg-ink-100 active:bg-ink-200",
  // Dark text on WhatsApp green: white on #25d366 is only 1.98:1, while
  // ink-900 on the same green measures 9.0:1.
  whatsapp:
    "bg-whatsapp text-ink-900 hover:bg-whatsapp-dark active:bg-whatsapp-dark",
};

const sizes: Record<ButtonSize, string> = {
  // 44px minimum touch target at every size.
  sm: "min-h-11 px-4 py-2 text-sm",
  md: "min-h-12 px-5 py-2.5 text-base",
  lg: "min-h-14 px-7 py-3 text-lg",
};

export type ButtonStyleProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
};

/**
 * Single source of truth for button appearance, shared by the `<button>`,
 * internal-link and external-link variants below. Exported so it can be unit
 * tested and reused by one-off anchors.
 */
export function buttonClasses({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
}: ButtonStyleProps = {}): string {
  return cn(
    base,
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    className,
  );
}

export type ButtonProps = ComponentProps<"button"> & ButtonStyleProps;

export function Button({
  variant,
  size,
  fullWidth,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, fullWidth, className })}
      {...props}
    />
  );
}

export type ButtonLinkProps = ComponentProps<typeof Link> & ButtonStyleProps;

/** Internal navigation — keeps the active locale prefix. */
export function ButtonLink({
  variant,
  size,
  fullWidth,
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={buttonClasses({ variant, size, fullWidth, className })}
      {...props}
    />
  );
}

export type ExternalButtonLinkProps = ComponentProps<"a"> &
  ButtonStyleProps & { children: ReactNode };

/**
 * Outbound links (WhatsApp, tel:, mail:). `rel="noopener noreferrer"` is
 * applied whenever the link opens in a new tab.
 */
export function ExternalButtonLink({
  variant,
  size,
  fullWidth,
  className,
  target,
  rel,
  ...props
}: ExternalButtonLinkProps) {
  return (
    <a
      target={target}
      rel={target === "_blank" ? (rel ?? "noopener noreferrer") : rel}
      className={buttonClasses({ variant, size, fullWidth, className })}
      {...props}
    />
  );
}
