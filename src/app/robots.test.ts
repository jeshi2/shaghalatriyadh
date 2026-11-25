import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * `isIndexable` is read when the module is first evaluated, so each case
 * re-imports the module with a fresh environment.
 */
async function loadRobots(noindex?: string) {
  vi.resetModules();
  if (noindex === undefined) {
    vi.stubEnv("NEXT_PUBLIC_NOINDEX", "");
  } else {
    vi.stubEnv("NEXT_PUBLIC_NOINDEX", noindex);
  }

  const [{ default: robots }, { site }] = await Promise.all([
    import("./robots"),
    import("@/config/site"),
  ]);

  return { result: robots(), site };
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("robots.txt", () => {
  it("invites crawlers and points at the sitemap by default", async () => {
    const { result, site } = await loadRobots();

    expect(site.isIndexable).toBe(true);
    expect(result.rules).toEqual([{ userAgent: "*", allow: "/" }]);
    expect(result.sitemap).toBe(`${site.url}/sitemap.xml`);
  });

  it("blocks crawling entirely when NEXT_PUBLIC_NOINDEX is set", async () => {
    const { result, site } = await loadRobots("true");

    expect(site.isIndexable).toBe(false);
    expect(result.rules).toEqual([{ userAgent: "*", disallow: "/" }]);
    // No sitemap is advertised on a host that should not be indexed.
    expect(result.sitemap).toBeUndefined();
  });

  it('only treats the exact string "true" as opting out', async () => {
    const { result } = await loadRobots("false");

    expect(result.rules).toEqual([{ userAgent: "*", allow: "/" }]);
  });
});
