# Google Business Profile and Search Console — launch pack

Everything needed to set both up, ready to paste. **Do this after the real
domain is live**, not before — see [Sequencing](#sequencing).

For a domestic services office in Riyadh, the Business Profile will out-rank
the website for local searches long before the site does. It is the single
highest-value item on this list.

---

## Sequencing

| #   | Step                                                                                 | Why this order                                                                |
| --- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| 1   | Register the domain                                                                  | Everything else points at it                                                  |
| 2   | Add it in Vercel, set `NEXT_PUBLIC_SITE_URL`, delete `NEXT_PUBLIC_NOINDEX`, redeploy | Until this, the site is `Disallow: /` and nothing can be indexed              |
| 3   | Confirm `robots.txt` no longer says `Disallow: /`                                    | One curl; catches a forgotten variable                                        |
| 4   | Create the Business Profile                                                          | Verification takes days — start it as early as step 1 if the address is final |
| 5   | Verify the domain in Search Console, submit the sitemap                              | Needs step 2 done or every URL is excluded                                    |

Steps 4 and 5 are independent of each other. The Business Profile does not
need the website to exist, so if the address is confirmed you can start it
while the domain is still being registered, and add the website URL after.

---

## Before you start: facts still missing

The site ships placeholders for these. The Business Profile must match the
website exactly — Google compares them — so fix `src/config/business.ts`
first and redeploy.

- [ ] **Legal/trading name** — currently `خدمات منزلية الرياض` / `Riyadh Home Services`
- [ ] **Commercial registration (السجل التجاري)** — currently `CR-0000000000`
- [ ] **Street address and postal code** — currently `طريق الملك فهد، مبنى 0000`, `12211`
- [ ] **Exact coordinates** — currently central Riyadh, not the office
- [ ] **Whether customers visit the office** — decides storefront vs service-area (below)

---

## Business Profile

### Name

Use the **real registered trading name only**.

Do not use `شغالة بالشهر الرياض` as the profile name. Keyword-stuffed names
violate Google's representation guidelines, and competitors report them —
suspension loses the listing and the reviews with it. The keywords belong in
the description, the services and the website, all of which are below.

### Storefront or service area?

Almost certainly a **service-area business**: staff go to customers' homes.
Choose that, and **hide the street address**. You still enter the address for
verification; it just is not shown publicly.

Service areas to add:

```
الرياض · Riyadh
الدرعية · Diriyah
الخرج · Al Kharj
```

Google caps service areas at 20 and prefers cities over districts. The
district list on the site covers the neighbourhood-level keywords.

### Categories

Set one primary, then the rest as secondary. Search the picker for these —
the exact wording varies by locale:

- **Primary:** Maid service / خدمة خادمات
- Employment agency / وكالة توظيف
- House cleaning service / خدمة تنظيف منازل
- Nanny service
- Elder care / رعاية المسنين

Primary category carries the most ranking weight. If the business is legally
a recruitment office, use Employment agency as primary instead.

### Contact

```
Phone:   +966 59 624 9823
Website: https://<the real domain>        (vercel.app URL works meanwhile)
```

No email — the business takes enquiries on WhatsApp and by phone only.

### Hours

```
Sunday    09:00 – 21:00
Monday    09:00 – 21:00
Tuesday   09:00 – 21:00
Wednesday 09:00 – 21:00
Thursday  09:00 – 21:00
Friday    Closed
Saturday  09:00 – 21:00
```

Must match `openingHours` in `src/config/business.ts`. Add Ramadan and Eid
hours as special hours when they come around — Google surfaces them.

### Description (Arabic — paste as-is)

> مكتب خدمات منزلية في الرياض يوفر شغالات بالشهر ومدربات تنظيف ومربيات أطفال
> وطباخات ورعاية لكبار السن. عقود شهرية واضحة بدون إجراءات استقدام، مع توضيح
> التكلفة وما تشملها قبل الاتفاق، وإمكانية تبديل العاملة وفق ما ينص عليه
> العقد. نخدم معظم أحياء الرياض: العليا، الملقا، النرجس، حطين، الياسمين،
> الصحافة، قرطبة، النسيم، السويدي وغيرها. للاستفسار والحجز تواصل معنا عبر
> واتساب أو الهاتف خلال ساعات العمل.

### Description (English)

> A domestic services office in Riyadh providing monthly housemaids, trained
> cleaners, nannies, cooks and elderly care. Clear monthly contracts with no
> recruitment process, the cost and what it covers explained before anything
> is agreed, and a replacement available under the terms of the contract. We
> serve most districts of Riyadh including Al Olaya, Al Malqa, Al Narjis,
> Hittin, Al Yasmin, Al Sahafa, Qurtubah, Al Naseem and Al Suwaidi. Contact us
> on WhatsApp or by phone during working hours.

Limit is 750 characters; both fit. No prices, no phone number, no URL —
Google strips those from descriptions.

### Services

Add each with its own description. Names match the website so the two
reinforce each other:

| Service           | Arabic name        | One-line description                                                             |
| ----------------- | ------------------ | -------------------------------------------------------------------------------- |
| Monthly housemaid | شغالة بالشهر       | عاملة منزلية بعقد شهري في الرياض، بدون إجراءات استقدام ولا التزام طويل الأجل.    |
| Trained cleaners  | مدربات تنظيف       | عاملات تنظيف مدربات لتنظيف الفلل والشقق والمجالس، بزيارات يومية أو أسبوعية.      |
| Nanny             | مربية أطفال        | مربيات أطفال بخبرة في العناية بالأطفال ومتابعة روتينهم اليومي داخل المنزل.       |
| Cooks             | طباخات             | طباخات منزليات لإعداد الوجبات اليومية حسب ذوق الأسرة، بما في ذلك المطبخ السعودي. |
| Elderly care      | العناية بكبار السن | مرافقة ورعاية منزلية لكبار السن مع احترام خصوصية الأسرة.                         |

### Photos

The weakest part of most listings, and the easiest to beat. Needed:

- Logo — `public/brand/tile-512.png`
- Cover — a real photo, not the logo
- Office exterior and interior, if customers ever visit
- Staff at work, **with written consent from the people in the frame**

Avoid stock photography. Google and customers both discount it, and for this
line of work it reads as dishonest.

### Verification

Service-area businesses in Saudi Arabia are usually verified by **video**:
you record a continuous walkthrough showing the premises, branding, tools or
equipment, and proof you manage the business. Have the commercial
registration to hand. Allow up to a week.

### After it is live

- Turn on messaging if someone will actually answer it. An unanswered chat
  button is worse than none.
- Ask real customers for reviews and reply to every one. Review volume and
  recency are the strongest local ranking factors you control.
- Post updates occasionally — offers, Ramadan hours, new services.

**Never** buy reviews or write them yourself. It is the fastest route to a
suspended listing, and it is fraud.

---

## Search Console

Only once `robots.txt` has stopped saying `Disallow: /`.

### While the site is on the vercel.app subdomain

A **Domain** property needs a DNS TXT record, and you do not control DNS for
`vercel.app`. Use a **URL prefix** property instead, verified by meta tag:

1. <https://search.google.com/search-console> → **Add property** → **URL
   prefix** → `https://shaghalatriyadh.vercel.app`
2. Choose the **HTML tag** verification method and copy the token — the
   `content` value, not the whole tag.
3. Set it in Vercel as `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` and redeploy.
   The locale layout already renders the tag when that variable is present.
4. Press Verify.

This property is throwaway: it does not carry over to the real domain. Redo
the steps below once the domain is live.

### On the real domain

1. <https://search.google.com/search-console> → **Add property** → **Domain**
   (not URL prefix — a domain property covers www, non-www and every
   subdomain).
2. Add the TXT record it gives you at the registrar. On Cloudflare the record
   propagates in seconds.
3. **Sitemaps** → submit `sitemap.xml`. The site generates it with all 20
   URLs and their `hreflang` alternates.
4. **Settings → International targeting** needs nothing — `hreflang` is in the
   sitemap and in every page's `<head>`.
5. Use **URL Inspection** on `/ar` → **Test live URL** to confirm Google
   fetches the page, sees the Arabic version and reports no `noindex`. This
   is also the definitive check that Vercel's firewall is not challenging
   Googlebot: if the live test fetches cleanly, crawling is fine.

> Vercel's firewall can show a "Security Checkpoint" challenge to automated
> clients. Bot Protection is **inactive** on this project, so verified
> crawlers are not affected — the challenge comes from rate-based DDoS
> mitigation and targets individual IPs that make bursts of requests. If your
> own `curl` testing starts getting challenged, clear it under
> **Firewall → Persistent Actions**.

### What to watch in the first month

- **Performance → Queries**, filtered to Arabic: the terms people actually
  arrive on will not be the ones you guessed. Rewrite copy toward the real
  ones.
- **Pages → Not indexed**: `Excluded by noindex` appearing after launch means
  `NEXT_PUBLIC_NOINDEX` is still set in Vercel.
- **Core Web Vitals**: the site is statically prerendered, so this should stay
  green. If it does not, something was added that should not have been.
