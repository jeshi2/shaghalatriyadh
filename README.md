# Domestic Services Qatar

Bilingual (Arabic-first) marketing website for a domestic services company in
Qatar. Visitors browse the services and start an enquiry on WhatsApp; there is
no backend and no customer data is stored.

Built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4 and next-intl.
Every page is prerendered at build time in both languages.

---

## Contents

- [Requirements](#requirements)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [Environment variables](#environment-variables)
- [Changing the business details](#changing-the-business-details)
- [Changing the WhatsApp number and messages](#changing-the-whatsapp-number-and-messages)
- [Editing the text on the site](#editing-the-text-on-the-site)
- [Adding or removing a service](#adding-or-removing-a-service)
- [Project structure](#project-structure)
- [Internationalisation and routing](#internationalisation-and-routing)
- [SEO](#seo)
- [Accessibility](#accessibility)
- [Testing](#testing)
- [Deployment](#deployment)
- [Before going live](#before-going-live)

---

## Requirements

- Node.js 20.9 or newer (developed on Node 22)
- npm 10 or newer

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the real business details
npm run dev
```

The site runs on <http://localhost:3000> and redirects to `/ar`.

## Scripts

| Script                 | Purpose                                        |
| ---------------------- | ---------------------------------------------- |
| `npm run dev`          | Development server                             |
| `npm run build`        | Production build (prerenders every page)       |
| `npm start`            | Serve the production build                     |
| `npm run lint`         | ESLint (Next.js core-web-vitals + TypeScript)  |
| `npm run typecheck`    | Generates route types, then `tsc --noEmit`     |
| `npm test`             | Vitest unit, component and accessibility tests |
| `npm run test:watch`   | Vitest in watch mode                           |
| `npm run format`       | Prettier write                                 |
| `npm run format:check` | Prettier check                                 |

## Environment variables

All variables are public (`NEXT_PUBLIC_`) because they are rendered into the
HTML. There are no secrets in this project. See [`.env.example`](.env.example).

| Variable                               | Required      | Purpose                                                                                                                                                    |
| -------------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                 | in production | Absolute origin, no trailing slash. Used for canonical URLs, hreflang, the sitemap, `robots.txt` and structured data. Defaults to `http://localhost:3000`. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER`          | yes           | WhatsApp business number, digits only, international format, no `+` (for example `97433221100`).                                                           |
| `NEXT_PUBLIC_CONTACT_PHONE`            | yes           | Phone number in E.164 (`+97433221100`); displayed formatted.                                                                                               |
| `NEXT_PUBLIC_CONTACT_EMAIL`            | yes           | Enquiries inbox.                                                                                                                                           |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | optional      | Google Search Console verification token.                                                                                                                  |

> `NEXT_PUBLIC_*` values are baked in at **build time**. After changing one,
> rebuild and redeploy — restarting the server is not enough.

## Changing the business details

Everything the site says about the business lives in one file:
[`src/config/business.ts`](src/config/business.ts). Nothing else in the
codebase hard-codes a phone number, address or opening time.

It holds the trading name (English and Arabic), commercial registration number,
WhatsApp number, phone, email, address, map coordinates, opening hours, the
list of areas served, and optional social profiles. Values that still need the
real data are marked `PLACEHOLDER` in that file.

Opening hours are keyed by day, with `null` meaning closed:

```ts
openingHours: {
  sunday: { opens: "08:00", closes: "20:00" },
  // ...
  friday: null,
}
```

Consecutive days with identical hours are grouped automatically
("Sunday – Thursday 08:00 – 20:00") in the footer, on the contact page and in
the `LocalBusiness` structured data.

Set a social profile to a URL string to make it appear, or leave it `null` to
hide it.

## Changing the WhatsApp number and messages

1. **The number**: set `NEXT_PUBLIC_WHATSAPP_NUMBER` in `.env.local` (digits
   only, no `+`, no spaces), then rebuild. The fallback in
   `src/config/business.ts` is a placeholder and must not be shipped.
2. **The prefilled messages**: they are translations, under the `whatsapp` key
   in [`src/messages/ar.json`](src/messages/ar.json) and
   [`src/messages/en.json`](src/messages/en.json):
   - `whatsapp.general` — header, menu, footer, hero, closing CTA and the
     floating button
   - `whatsapp.service` — service pages; `{service}` is replaced with the
     service name
   - `whatsapp.form.*` — the lines the contact form composes

Every link is built by `buildWhatsAppUrl` in
[`src/lib/whatsapp.ts`](src/lib/whatsapp.ts), which strips non-digits from the
number and percent-encodes the message, including Arabic text and newlines.

## Editing the text on the site

All copy lives in the two message catalogues, `src/messages/ar.json` and
`src/messages/en.json`. Both files must define exactly the same keys — a test
fails if one language is missing a key, has an empty string, uses different ICU
placeholders, or has a different number of items in a list.

## Adding or removing a service

1. Add an entry to [`src/content/services.ts`](src/content/services.ts) with a
   URL slug, an icon from `src/components/ui/icons.tsx`, and `featured: true`
   if it should appear on the homepage.
2. Add a `services.<slug>` block to **both** message files with `name`,
   `summary`, `description`, `idealFor`, `highlights[]` and `includes[]`.
3. Run `npm test`. The catalogue test fails if copy is missing in either
   language, or if copy is left behind for a service that no longer exists.

The page, the sitemap entry, the homepage card and the navigation follow
automatically.

## Project structure

```
src/
├── app/
│   ├── [locale]/              # every page; this is also the root layout
│   │   ├── layout.tsx         # <html lang/dir>, header, footer, JSON-LD
│   │   ├── page.tsx           # homepage
│   │   ├── services/          # listing + [slug] detail pages
│   │   ├── about/ how-it-works/ contact/
│   │   ├── not-found.tsx      # translated 404
│   │   ├── [...rest]/         # catch-all so unknown paths keep the layout
│   │   └── opengraph-image.tsx
│   ├── robots.ts
│   ├── sitemap.ts
│   └── globals.css            # design tokens
├── components/
│   ├── forms/ layout/ sections/ seo/ services/ ui/ whatsapp/
├── config/                    # business details, site URL, navigation
├── content/                   # service catalogue (structure only)
├── i18n/                      # routing, request config, navigation, guard
├── lib/                       # whatsapp, validation, metadata, structured data
├── messages/                  # ar.json, en.json — all copy
├── test/                      # test helpers
└── proxy.ts                   # locale detection and redirects
```

Tests live next to the code they cover, as `*.test.ts(x)`.

## Internationalisation and routing

- Arabic is the default locale and is always prefixed: `/ar/...` and `/en/...`.
  `/` redirects to the visitor's preferred language, defaulting to Arabic.
- `src/proxy.ts` (Next.js 16 renamed Middleware to Proxy) handles detection,
  prefixing and the locale cookie.
- Direction is set per locale on `<html dir>`; layouts use CSS logical
  properties (`ms-`, `me-`, `start-`, `end-`), so RTL needs no separate styles.
- URL slugs are identical in both languages, so a link can be shared between
  them and the sitemap stays simple.
- Import `Link`, `redirect`, `usePathname` and `useRouter` from
  `@/i18n/navigation` — never from `next/link` or `next/navigation` — so the
  locale prefix is preserved.

## SEO

- Canonical URL and `hreflang` alternates on every page, with `x-default`
  pointing at Arabic.
- Open Graph and Twitter cards; the social card image is generated per locale
  at build time by `src/app/[locale]/opengraph-image.tsx`. Its text is
  Latin-only because the image renderer ships no Arabic font — replace that
  route with real artwork when brand assets exist.
- `sitemap.xml` lists all 22 URLs (11 paths × 2 locales) with their language
  alternates; `robots.txt` points at it.
- JSON-LD: `LocalBusiness` and `WebSite` site-wide, `FAQPage` on the homepage
  only, `Service` and `BreadcrumbList` on each service page.

## Accessibility

- Skip link, landmark structure and one `h1` per page.
- Colour contrast is asserted against the design tokens in
  `src/app/theme.test.ts`. WhatsApp actions use dark text on WhatsApp green,
  because white on that green is only 1.98:1.
- axe-core runs in the test suite over the header, footer, mobile menu, FAQ,
  service card and the contact form (before and after validation).
- The contact form marks invalid fields with `aria-invalid` and
  `aria-describedby`, moves focus to the first error and announces the result
  in a live region.
- The FAQ is built on `<details>`/`<summary>`, so it works without JavaScript.

## Deployment

The site is fully static apart from the locale proxy, so it runs on any Node
host (`npm run build && npm start`) or on Vercel with no extra configuration.

1. Set the environment variables listed above for the production environment.
2. `npm ci`
3. `npm run build`
4. `npm start` (or let the platform serve `.next`)

**Security headers** (CSP, HSTS, nosniff, `X-Frame-Options`,
`Referrer-Policy`, `Permissions-Policy`) are defined in
[`next.config.ts`](next.config.ts) and are applied by `next start` and by
Node-based hosts. If you put a CDN or static host in front, configure the same
headers there — `next.config.ts` headers are not emitted into static files.

## Before going live

- [ ] Replace every `PLACEHOLDER` in `src/config/business.ts` (trading name,
      commercial registration, address, PO box, coordinates, opening hours).
- [ ] Set `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_CONTACT_PHONE`,
      `NEXT_PUBLIC_CONTACT_EMAIL` and `NEXT_PUBLIC_SITE_URL`, then rebuild.
- [ ] Have the business owner confirm the claims in the copy — the replacement
      policy, the screening steps and what the paperwork covers. The site
      intentionally contains no testimonials, star ratings or statistics;
      add them only with real, attributable sources.
- [ ] Replace the generated social card with branded artwork.
- [ ] Add a real favicon (the create-next-app default is still in place).
- [ ] Verify the site in Google Search Console and submit the sitemap.
- [ ] Configure the security headers at the CDN if one is used.
