import { ImageResponse } from "next/og";
import { business } from "@/config/business";
import { routing } from "@/i18n/routing";

/**
 * Social card generated at build time, one per locale.
 *
 * The text is Latin-only on purpose: ImageResponse ships Latin fonts, and
 * rendering Arabic would require bundling an Arabic font file. Replace this
 * route with the real branded artwork once design assets exist.
 *
 * Satori (the renderer behind ImageResponse) requires an explicit `display`
 * on any element with more than one child, so each block below holds exactly
 * one text node.
 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const alt = "Qatar Home Services — قطر لخدمات المنازل";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #8a1538 0%, #4d0b22 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#ead7b8",
            }}
          >
            {`${business.address.city} · ${business.address.country}`}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.15,
            }}
          >
            {business.legalName}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 34,
              color: "#f5c6d3",
              maxWidth: 900,
            }}
          >
            {"Housemaids, cleaning, childcare, elderly care and home cooking"}
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 26, color: "#f5ecdc" }}>
          {"WhatsApp enquiries · Arabic & English"}
        </div>
      </div>
    ),
    size,
  );
}
