import {
  ExternalButtonLink,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type WhatsAppButtonProps = {
  /** Visible label, already translated by the caller. */
  label: string;
  /** Prefilled message in the visitor's language. */
  message?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
};

/**
 * The single way to link to WhatsApp. Always opens in a new tab so visitors
 * keep the page they came from, and the icon is decorative because the label
 * already names the action.
 */
export function WhatsAppButton({
  label,
  message,
  variant = "whatsapp",
  size = "md",
  fullWidth,
  className,
}: WhatsAppButtonProps) {
  return (
    <ExternalButtonLink
      href={buildWhatsAppUrl({ message })}
      target="_blank"
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      className={className}
    >
      <WhatsAppIcon className="text-[1.15em]" />
      {label}
    </ExternalButtonLink>
  );
}
