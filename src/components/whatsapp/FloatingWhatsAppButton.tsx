import { useTranslations } from "next-intl";
import { WhatsAppIcon } from "@/components/ui/icons";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

/**
 * Persistent WhatsApp shortcut. Rendered on the server with no client
 * JavaScript, positioned with logical properties so it sits in the trailing
 * corner in both reading directions, and hidden from print.
 */
export function FloatingWhatsAppButton() {
  const t = useTranslations("whatsapp");

  return (
    <a
      href={buildWhatsAppUrl({ message: t("general") })}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("floatingLabel")}
      className="fixed bottom-5 end-5 z-50 flex size-14 items-center justify-center rounded-pill bg-whatsapp text-3xl text-white shadow-lifted transition-colors hover:bg-whatsapp-dark print:hidden"
    >
      <WhatsAppIcon />
    </a>
  );
}
