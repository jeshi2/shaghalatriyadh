import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type CardProps = {
  children: ReactNode;
  className?: string;
  /** Adds a hover lift — only for cards that are entirely clickable. */
  interactive?: boolean;
};

export function Card({ children, className, interactive = false }: CardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-card border border-ink-200 bg-white p-6 shadow-soft",
        interactive &&
          "transition-shadow duration-200 hover:border-brand-200 hover:shadow-lifted focus-within:border-brand-300",
        className,
      )}
    >
      {children}
    </div>
  );
}

type BadgeProps = {
  children: ReactNode;
  tone?: "brand" | "neutral" | "sand";
};

const badgeTones = {
  brand: "bg-brand-50 text-brand-700",
  neutral: "bg-ink-100 text-ink-700",
  sand: "bg-sand-100 text-sand-600",
} as const;

export function Badge({ children, tone = "brand" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-3 py-1 text-xs font-semibold",
        badgeTones[tone],
      )}
    >
      {children}
    </span>
  );
}
