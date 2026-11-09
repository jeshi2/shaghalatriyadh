import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware wrappers around the Next.js navigation APIs. Always import
 * `Link`, `redirect`, `usePathname` and `useRouter` from here rather than from
 * `next/link` / `next/navigation` so the active locale prefix is preserved.
 *
 * URL slugs are intentionally identical in both locales (`/ar/services` and
 * `/en/services`): it keeps links shareable between languages, avoids
 * percent-encoded Arabic paths and keeps the sitemap simple.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
