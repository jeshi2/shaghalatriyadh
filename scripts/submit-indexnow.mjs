/**
 * Pings IndexNow with every URL in the sitemap.
 *
 * IndexNow is a push protocol: instead of waiting for a crawler to find the
 * site, it tells Bing, Yandex, Seznam and Naver that URLs are new or changed.
 * Google does not participate, so this complements Search Console rather than
 * replacing it — but Bing-family indexing typically lands within hours rather
 * than weeks, which matters most for a site with no history.
 *
 * Usage:
 *   node scripts/submit-indexnow.mjs
 *   node scripts/submit-indexnow.mjs https://example.sa
 */

const KEY = "59bc8ab705a61ecca0dfdd6de21ec03d";
const DEFAULT_SITE = "https://shaghalatriyadh.vercel.app";

const site = (
  process.argv[2] ??
  process.env.NEXT_PUBLIC_SITE_URL ??
  DEFAULT_SITE
).replace(/\/+$/, "");
const host = new URL(site).host;

async function readSitemapUrls() {
  const response = await fetch(`${site}/sitemap.xml`);
  if (!response.ok) {
    throw new Error(`sitemap.xml returned ${response.status}`);
  }

  const xml = await response.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

async function main() {
  const urlList = await readSitemapUrls();
  if (urlList.length === 0) {
    throw new Error("no URLs found in sitemap.xml");
  }

  console.log(`Submitting ${urlList.length} URLs for ${host}`);

  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host,
      key: KEY,
      keyLocation: `${site}/${KEY}.txt`,
      urlList,
    }),
  });

  // 200 = accepted, 202 = accepted but key still being validated.
  console.log(`IndexNow responded ${response.status} ${response.statusText}`);
  if (response.status >= 400) {
    console.error(await response.text());
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
