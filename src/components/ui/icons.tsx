import type { SVGProps } from "react";
import { cn } from "@/lib/cn";

/**
 * Hand-rolled inline icons: a few kilobytes of SVG instead of an icon
 * dependency, and they inherit `currentColor` so they follow the button or
 * text colour they sit in.
 *
 * Icons are decorative by default (`aria-hidden`); pass a `title` only when an
 * icon carries meaning on its own.
 */
type IconProps = SVGProps<SVGSVGElement> & { title?: string };

function Icon({ title, children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      width="1em"
      height="1em"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      focusable="false"
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Icon>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Icon>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4.5 12.5l5 5 10-11" />
    </Icon>
  );
}

/** Points to the inline end, so it flips automatically in RTL. */
export function ArrowIcon(props: IconProps) {
  return (
    <Icon {...props} className={cn("rtl:-scale-x-100", props.className)}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Icon>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6.5 3h3l1.5 4.5-2 1.5a11.5 11.5 0 006 6l1.5-2L21 14.5v3a2.5 2.5 0 01-2.7 2.5A16.5 16.5 0 013.5 5.7A2.5 2.5 0 016 3z" />
    </Icon>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 6.5l8.5 6 8.5-6" />
    </Icon>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 21s7-6.3 7-11a7 7 0 10-14 0c0 4.7 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </Icon>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l3 2" />
    </Icon>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 3l7 2.5v5.5c0 4.6-3 8.1-7 10-4-1.9-7-5.4-7-10V5.5L12 3z" />
      <path d="M9 12l2 2 4-4" />
    </Icon>
  );
}

/** WhatsApp glyph — filled, so it keeps its shape at small sizes. */
export function WhatsAppIcon({ title, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width="1em"
      height="1em"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      focusable="false"
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.45 1.33 4.95L2 22l5.23-1.37a9.9 9.9 0 004.81 1.23h.01c5.49 0 9.95-4.46 9.95-9.96A9.9 9.9 0 0019.1 4.9A9.9 9.9 0 0012.04 2zm0 1.67c2.22 0 4.3.86 5.87 2.43a8.26 8.26 0 012.43 5.87c0 4.57-3.72 8.29-8.3 8.29a8.23 8.23 0 01-4.2-1.15l-.3-.18-3.1.81.83-3.03-.2-.31a8.24 8.24 0 01-1.26-4.43c0-4.58 3.72-8.3 8.3-8.3zm-3.1 4.3c-.17 0-.44.06-.67.3-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.6.13.17 1.76 2.8 4.37 3.82 2.17.85 2.61.68 3.08.64.47-.05 1.52-.62 1.74-1.23.21-.6.21-1.13.15-1.24-.07-.1-.25-.17-.52-.3-.27-.14-1.52-.75-1.76-.84-.23-.09-.4-.13-.57.13-.17.25-.66.84-.8 1-.15.17-.3.19-.56.07-.26-.14-1.1-.41-2.1-1.3-.78-.69-1.3-1.55-1.45-1.8-.15-.26-.02-.4.11-.53.12-.12.25-.3.38-.46.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.07-.13-.57-1.38-.78-1.88-.17-.4-.34-.42-.5-.43h-.47z" />
    </svg>
  );
}

export function HouseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-4v-6H9v6H5a1 1 0 01-1-1v-9.5z" />
    </Icon>
  );
}
