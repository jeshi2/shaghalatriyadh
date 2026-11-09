"use client";

import type { ReactNode } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

type NavLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
};

/**
 * Navigation link that marks itself as the current page for both assistive
 * technology (`aria-current`) and sighted users (underline + colour).
 */
export function NavLink({
  href,
  children,
  className,
  onNavigate,
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive =
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "rounded-sm px-1 py-2 text-base font-medium transition-colors",
        isActive
          ? "text-brand-700 underline decoration-2 underline-offset-8"
          : "text-ink-600 hover:text-brand-700",
        className,
      )}
    >
      {children}
    </Link>
  );
}
