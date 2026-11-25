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

export const alt = "Riyadh Home Services — خدمات منزلية الرياض";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "linear-gradient(135deg, #123a5c 0%, #091f31 100%)",
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* The brand mark, drawn inline so the card fetches no asset. */}
        <svg width="88" height="88" viewBox="0 0 24 24" fill="#ead7b8">
          <path
            fillRule="evenodd"
            d="M3.5 21.5V5.5a1.5 1.5 0 0 1 1.5-1.5h14a1.5 1.5 0 0 1 1.5 1.5v16h-17ZM7 6.5h3L8.5 9.5ZM10.5 6.5h3L12 9.5ZM14 6.5h3L15.5 9.5ZM9.25 21.5v-6.25a2.75 2.75 0 0 1 5.5 0v6.25Z"
          />
        </svg>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#ead7b8",
          }}
        >
          {`${business.address.cityEn} · ${business.address.countryEn}`}
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
            color: "#c0d8ec",
            maxWidth: 900,
          }}
        >
          {"Monthly housemaids, cleaners, nannies, cooks and elderly care"}
        </div>
      </div>

      <div style={{ display: "flex", fontSize: 26, color: "#e2edf7" }}>
        {"WhatsApp enquiries · Arabic & English"}
      </div>
    </div>,
    size,
  );
}
