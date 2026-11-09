import { useTranslations } from "next-intl";
import { BrandMark } from "@/components/layout/BrandMark";
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { MobileNav } from "@/components/layout/MobileNav";
import { NavLink } from "@/components/layout/NavLink";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { mainNav } from "@/config/navigation";

export function Header() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const tWhatsApp = useTranslations("whatsapp");

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200 bg-white/95 backdrop-blur">
      <div className="container-content flex h-16 items-center gap-4 lg:h-20">
        <BrandMark name={tCommon("brandName")} tagline={tCommon("tagline")} />

        <nav aria-label={t("primary")} className="hidden lg:block">
          <ul className="flex items-center gap-6">
            {mainNav.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href}>{t(item.labelKey)}</NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ms-auto flex items-center gap-2">
          <LocaleSwitcher className="hidden sm:flex" />
          <WhatsAppButton
            label={tCommon("whatsappCta")}
            message={tWhatsApp("general")}
            size="sm"
            className="hidden sm:inline-flex"
          />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
