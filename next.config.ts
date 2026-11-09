import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // This is a content-driven marketing site: every route is prerendered at
  // build time. Cache Components (the create-next-app default) is therefore
  // not needed and is left off so rendering behaviour stays predictable
  // alongside next-intl's request-scoped locale resolution.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withNextIntl(nextConfig);
