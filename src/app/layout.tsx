import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

/**
 * Cairo covers both Arabic and Latin, so a single family keeps the two
 * locales visually consistent and avoids a second font download.
 */
const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Qatar Home Services",
  description: "Trusted domestic services in Qatar.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">{children}</body>
    </html>
  );
}
