import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

/**
 * Next.js 16 renamed Middleware to Proxy; the behaviour is unchanged.
 *
 * This redirects `/` to the visitor's preferred locale (Arabic by default),
 * adds the locale prefix to unprefixed paths and sets the locale cookie that
 * keeps the choice sticky between visits.
 */
export default createMiddleware(routing);

export const config = {
  // Skip Next.js internals, API routes and anything with a file extension
  // (images, fonts, robots.txt, sitemap.xml, ...).
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
