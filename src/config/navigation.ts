/**
 * The site's primary navigation. Pages, the header, the footer and the sitemap
 * all derive from this list so a new page is linked everywhere at once.
 *
 * `labelKey` resolves against the `nav` namespace in the message catalogues.
 */
export const mainNav = [
  { href: "/", labelKey: "home" },
  { href: "/services", labelKey: "services" },
  { href: "/how-it-works", labelKey: "howItWorks" },
  { href: "/about", labelKey: "about" },
  { href: "/contact", labelKey: "contact" },
] as const;

export type NavItem = (typeof mainNav)[number];
export type NavLabelKey = NavItem["labelKey"];

/** Routes that should appear in the XML sitemap, in priority order. */
export const sitemapRoutes = mainNav.map((item) => item.href);
