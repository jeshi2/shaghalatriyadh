import { business } from "@/config/business";

export type WhatsAppLinkOptions = {
  /** Any format; everything that is not a digit is stripped. */
  number?: string;
  /** Prefilled message. Newlines and Arabic text are encoded safely. */
  message?: string;
};

/**
 * Builds a `wa.me` deep link. wa.me expects the number in international
 * format with digits only (no `+`, spaces or dashes) and the prefilled text
 * percent-encoded in the `text` query parameter.
 */
export function buildWhatsAppUrl({
  number = business.whatsapp.number,
  message,
}: WhatsAppLinkOptions = {}): string {
  const digits = number.replace(/\D/g, "");
  const url = `https://wa.me/${digits}`;
  const text = message?.trim();

  return text ? `${url}?text=${encodeURIComponent(text)}` : url;
}

/**
 * Joins the lines of an enquiry into one WhatsApp message, dropping the
 * optional lines the visitor left empty. Kept separate from the components so
 * the message layout is testable on its own.
 */
export function composeWhatsAppMessage(
  lines: readonly (string | null | undefined | false)[],
): string {
  return lines
    .filter((line): line is string => Boolean(line && line.trim()))
    .map((line) => line.trim())
    .join("\n");
}
