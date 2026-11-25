import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { FloatingWhatsAppButton } from "@/components/whatsapp/FloatingWhatsAppButton";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/config/site";
import { getDirection, localeHtmlLang, routing } from "@/i18n/routing";
import { localeUrl, ogImageUrl } from "@/lib/metadata";
import { buildLocalBusiness, buildWebSite } from "@/lib/structuredData";
import "../globals.css";

/**
 * Cairo covers both Arabic and Latin, so a single family keeps the two
 * locales visually consistent and avoids a second font download.
 */
const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
});

/** Prerender both locales at build time. */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const t = await getTranslations({ locale, namespace: "common" });

  return {
    metadataBase: new URL(site.url),
    // Pages set their own title; this appends the brand to each one.
    title: {
      default: `${t("brandName")} — ${t("tagline")}`,
      template: `%s | ${t("brandName")}`,
    },
    description: t("tagline"),
    robots: {
      index: site.isIndexable,
      follow: site.isIndexable,
    },
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? {
          verification: {
            google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
          },
        }
      : {}),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;

  // A locale that is not in the routing config must 404 rather than fall back
  // silently, otherwise `/de/...` would render Arabic content on a German URL.
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Required for static rendering: makes the locale available to the
  // translation APIs without reading request headers.
  setRequestLocale(locale);

  const t = await getTranslations("common");
  const homeUrl = localeUrl(locale, "/");

  return (
    <html
      lang={localeHtmlLang[locale]}
      dir={getDirection(locale)}
      className={`${cairo.variable} h-full`}
    >
      <body className="flex min-h-full flex-col antialiased">
        <NextIntlClientProvider>
          <SkipLink />
          <Header />
          <main id="main" className="flex flex-1 flex-col">
            {children}
          </main>
          <Footer />
          <FloatingWhatsAppButton />
          {/* Site-wide structured data: who the business is and where. */}
          <JsonLd
            data={buildLocalBusiness({
              name: t("brandName"),
              description: t("tagline"),
              url: homeUrl,
              locale,
              image: ogImageUrl(locale),
            })}
          />
          <JsonLd
            data={buildWebSite({
              name: t("brandName"),
              url: homeUrl,
              locale: localeHtmlLang[locale],
            })}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
