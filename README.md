# Domestic Services Riyadh

Bilingual (Arabic-first) marketing website for a domestic services office in
Riyadh, Saudi Arabia. Visitors browse the services and start an enquiry on
WhatsApp; there is no backend and no customer data is stored.

The site targets what Riyadh customers actually search for: **شغالة بالشهر**
(monthly housemaid), **مدربات تنظيف** (trained cleaners), **مربية أطفال**
(nanny), **طباخات** (cooks) and **العناية بكبار السن** (elderly care).

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
- [Local SEO for Riyadh](#local-seo-for-riyadh)
- [Domain name](#domain-name)
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
| `NEXT_PUBLIC_WHATSAPP_NUMBER`          | recommended   | WhatsApp line, digits only, international format (`966596249823`). Defaults to the number in `src/config/business.ts`.                                     |
| `NEXT_PUBLIC_CONTACT_PHONE`            | recommended   | Phone in E.164 (`+966596249823`); displayed formatted.                                                                                                     |
| `NEXT_PUBLIC_CONTACT_EMAIL`            | yes           | Enquiries inbox.                                                                                                                                           |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | optional      | Google Search Console verification token.                                                                                                                  |

> `NEXT_PUBLIC_*` values are baked in at **build time**. After changing one,
> rebuild and redeploy — restarting the server is not enough.

## Changing the business details

Everything the site says about the business lives in one file:
[`src/config/business.ts`](src/config/business.ts). Nothing else in the
codebase hard-codes a phone number, address or opening time.

It holds the trading name (Arabic and English), commercial registration
number, WhatsApp line, phone, email, Riyadh address, map coordinates, opening
hours, the districts served and optional social profiles. Values that still
need real data are marked `PLACEHOLDER`.

Opening hours are keyed by day, with `null` meaning closed. The Saudi week
starts on Sunday and Friday is the rest day:

```ts
openingHours: {
  sunday: { opens: "09:00", closes: "21:00" },
  // ...
  friday: null,
  saturday: { opens: "09:00", closes: "21:00" },
}
```

Consecutive days with identical hours are grouped automatically
("الأحد – الخميس ٠٩:٠٠ – ٢١:٠٠") in the footer, on the contact page and in the
`LocalBusiness` structured data.

Districts are listed once, in both languages:

```ts
serviceAreas: [{ key: "olaya", ar: "العليا", en: "Al Olaya" }, ...]
```

They drive the footer, the homepage districts section, the service pages and
the `areaServed` property of the structured data — so they are the site's
local-SEO surface. Keep them accurate, and add districts as coverage grows.

## Changing the WhatsApp number and messages

1. **The number**: set `NEXT_PUBLIC_WHATSAPP_NUMBER` in `.env.local` (digits
   only, no `+`, no spaces — a Saudi `05XXXXXXXX` becomes `9665XXXXXXXX`),
   then rebuild. The current business line, `0596249823` → `966596249823`, is
   also the default in `src/config/business.ts`.
2. **The prefilled messages**: they are translations, under the `whatsapp` key
   in [`src/messages/ar.json`](src/messages/ar.json) and
   [`src/messages/en.json`](src/messages/en.json):
   - `whatsapp.general` — header, menu, footer, hero, closing CTA and the
     floating button
   - `whatsapp.service` — service pages; `{service}` is the service name
   - `whatsapp.form.*` — the lines the contact form composes, including the
     Riyadh district line

Every link is built by `buildWhatsAppUrl` in
[`src/lib/whatsapp.ts`](src/lib/whatsapp.ts), which strips non-digits from the
number and percent-encodes the message, including Arabic text and newlines.

## Editing the text on the site

All copy lives in the two message catalogues, `src/messages/ar.json` and
`src/messages/en.json`. Both must define the same keys — a test fails if one
language is missing a key, has an empty string, uses different ICU
placeholders, or has a different number of items in a list. The one exception
is `seo.keywords`, which is researched per language.

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
- Locale tags are `ar-SA` and `en-SA`; the timezone is `Asia/Riyadh`.
- `src/proxy.ts` (Next.js 16 renamed Middleware to Proxy) handles detection,
  prefixing and the locale cookie.
- Direction is set per locale on `<html dir>`; layouts use CSS logical
  properties (`ms-`, `me-`, `start-`, `end-`), so RTL needs no separate styles.
- URL slugs are identical in both languages, so a link can be shared between
  them and the sitemap stays simple.
- Import `Link`, `redirect`, `usePathname` and `useRouter` from
  `@/i18n/navigation` — never from `next/link` or `next/navigation` — so the
  locale prefix is preserved.

## Local SEO for Riyadh

What the site already does:

- **Arabic-first**: Arabic is the default locale, `x-default` points at the
  Arabic page, and the Arabic copy carries the search terms verbatim.
- **City in the titles**: the homepage title is
  "شغالة بالشهر الرياض | مدربات تنظيف ومربيات أطفال وطباخات", and each service
  page is titled "{الخدمة} في الرياض".
- **One page per search term**: each of the five services has its own page,
  so a query like "مربية أطفال الرياض" has a dedicated page to match.
- **District coverage in visible copy**: the homepage districts section, the
  footer and each service page name the districts — visible text, not hidden
  keywords.
- **Structured data**: `LocalBusiness` with the Riyadh address, coordinates
  and `areaServed` (the city plus every district), `Service` per service page
  tied to the business by `@id`, `FAQPage` on the homepage, and
  `BreadcrumbList` on service pages.
- **`seo.keywords`** in each message file records the target terms, including
  the misspellings people actually type (`شغاله بالشهر`, `مدربات تنضيف`). The
  keywords meta tag carries little weight on its own — it is kept so the
  target terms live next to the page they belong to.

What still has to happen outside the codebase — these matter more than
anything on-page for local ranking:

1. **Google Business Profile** for the Riyadh office: same name, address and
   phone as `src/config/business.ts`, correct category, real photos, and
   reviews collected over time.
2. **Consistent NAP** (name, address, phone) across the site, the Business
   Profile and any directory listing.
3. **Search Console**: verify the domain, submit `sitemap.xml`, and watch
   which Arabic queries actually bring traffic.
4. **Reviews**: ask real customers. The site deliberately ships no invented
   testimonials or ratings; add them only when they are real and attributable.

## Domain name

The aim is a domain that matches what people type into Google in Arabic, in
Latin letters, and that is short enough to say over the phone.

**Recommended: `shaghalatriyadh.com`** — "شغالات الرياض" transliterated: the
service word plus the city, no hyphen, one word to dictate. Pair it with
**`shaghalat.com.sa`** (or `shaghalat.sa`) once the commercial registration is
to hand — a `.sa` domain is a strong local trust signal in Saudi Arabia — and
point it at the same site.

| Domain                 | Reads as        | Notes                                                               |
| ---------------------- | --------------- | ------------------------------------------------------------------- |
| `shaghalatriyadh.com`  | شغالات الرياض   | **First choice.** Keyword + city, no hyphen, easy to dictate.       |
| `shaghala-riyadh.com`  | شغالة الرياض    | Singular form; the hyphen costs clarity over the phone.             |
| `shaghalabalshahr.com` | شغالة بالشهر    | Exact primary keyword but long, and it says nothing about the city. |
| `shaghalatksa.com`     | شغالات السعودية | Pick this only if the business expands beyond Riyadh.               |
| `maidsriyadh.com`      | (English)       | Worth registering as a redirect for English-language searches.      |
| `shaghalat.com.sa`     | شغالات          | Local trust signal; `.sa` registration requires a Saudi CR.         |

All six were unregistered when checked on 25 November 2026 — confirm at the
registrar before deciding, since availability changes daily. Note that
`shaghalat-riyadh.com` (with a hyphen) and `riyadhmaids.com` are already taken,
which is another reason to prefer the unhyphenated spelling.

Avoid an Arabic-script domain (`شغالات.السعودية`) as the primary: it breaks in
some apps when shared, and it is hard to type on a Latin keyboard.

Once the domain is chosen, set `NEXT_PUBLIC_SITE_URL` to it and rebuild — the
canonical URLs, hreflang tags, sitemap and structured data all follow from it.

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

## Testing

```bash
npm test
```

The suite covers the WhatsApp URL and message composition, contact form
validation and submission (including the Arabic message), the opening hours
grouping, metadata and structured data, dictionary parity between Arabic and
English, the service catalogue, design token contrast, and axe accessibility
checks on the main components.

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
      commercial registration, street address, postal code, coordinates,
      opening hours).
- [ ] Confirm the WhatsApp line `0596249823` is the one that will answer
      enquiries, and set `NEXT_PUBLIC_CONTACT_EMAIL` and
      `NEXT_PUBLIC_SITE_URL`, then rebuild.
- [ ] Have the owner confirm the claims in the copy — the replacement policy,
      what the monthly contract covers, and who carries legal responsibility
      for the worker. These are legal statements, not marketing copy.
- [ ] Register the domain and create the Google Business Profile.
- [ ] Replace the generated social card with branded artwork.
- [ ] Add a real favicon (the create-next-app default is still in place).
- [ ] Verify in Search Console and submit the sitemap.
- [ ] Configure the security headers at the CDN if one is used.
