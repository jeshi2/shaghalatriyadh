import type { MetadataRoute } from "next";
import { sitemapRoutes } from "@/config/navigation";
import { serviceSlugs } from "@/content/services";
import { routing } from "@/i18n/routing";
import { languageAlternates, localeUrl } from "@/lib/metadata";

/** Priority by depth: homepage first, then the services hub, then the rest. */
function priorityFor(path: string): number {
  if (path === "/") return 1;
  if (path === "/services") return 0.9;
  if (path.startsWith("/services/")) return 0.8;
  return 0.7;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...sitemapRoutes,
    ...serviceSlugs.map((slug) => `/services/${slug}`),
  ];
  const lastModified = new Date();

  // One entry per locale per path, each listing every language alternate so
  // search engines can pair the Arabic and English versions.
  return paths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: localeUrl(locale, path),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: priorityFor(path),
      alternates: { languages: languageAlternates(path) },
    })),
  );
}
