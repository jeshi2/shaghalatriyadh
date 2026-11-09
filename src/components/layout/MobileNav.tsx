"use client";

import { useEffect, useId, useState } from "react";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { NavLink } from "@/components/layout/NavLink";
import { Button } from "@/components/ui/Button";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { mainNav } from "@/config/navigation";
import { usePathname } from "@/i18n/navigation";

/**
 * Small-screen navigation. The panel is a plain disclosure rather than a modal
 * dialog: it is part of the page flow, so it needs no focus trap, and it
 * closes on Escape or on navigation.
 */
export function MobileNav() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const panelId = useId();
  const pathname = usePathname();

  // The panel is only open for the path it was opened on, so navigating (or
  // going back) closes it without an effect that writes state.
  const [openForPath, setOpenForPath] = useState<string | null>(null);
  const isOpen = openForPath === pathname;

  const close = () => setOpenForPath(null);
  const toggle = () => setOpenForPath(isOpen ? null : pathname);

  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenForPath(null);
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      <Button
        variant="ghost"
        size="sm"
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-label={isOpen ? t("closeMenu") : t("openMenu")}
        onClick={toggle}
        className="px-3 text-2xl"
      >
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </Button>

      <div
        id={panelId}
        hidden={!isOpen}
        className="absolute inset-x-0 top-full border-b border-ink-200 bg-white shadow-lifted"
      >
        <div className="container-content flex flex-col gap-4 py-6">
          <nav aria-label={tCommon("brandName")}>
            <ul className="flex flex-col gap-1">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <NavLink
                    href={item.href}
                    className="block py-3 text-lg"
                    onNavigate={close}
                  >
                    {t(item.labelKey)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <WhatsAppButton label={tCommon("whatsappCta")} fullWidth />
          <LocaleSwitcher />
        </div>
      </div>
    </div>
  );
}
