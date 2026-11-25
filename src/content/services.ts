import type { ComponentType, SVGProps } from "react";
import {
  BabyIcon,
  BroomIcon,
  ChefHatIcon,
  HeartHandsIcon,
  UsersIcon,
} from "@/components/ui/icons";

/**
 * The service catalogue holds only structure: the URL slug, the icon and the
 * display order. Every piece of copy lives in the message catalogues under
 * `services.<slug>`, so adding a language never means touching this file.
 *
 * The five services mirror what customers in Riyadh actually search for:
 * شغالة بالشهر, مدربات تنظيف, مربية أطفال, طباخات and العناية بكبار السن.
 *
 * To add a service: add an entry here and the matching block to both
 * src/messages/ar.json and src/messages/en.json. The parity test fails if one
 * language is missing.
 */
export type ServiceSlug = (typeof services)[number]["slug"];

export type Service = {
  slug: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  /** Shown on the homepage overview; the rest only on the services pages. */
  featured: boolean;
};

export const services = [
  { slug: "monthly-housemaid", icon: UsersIcon, featured: true },
  { slug: "trained-cleaners", icon: BroomIcon, featured: true },
  { slug: "nanny", icon: BabyIcon, featured: true },
  { slug: "cooks", icon: ChefHatIcon, featured: true },
  { slug: "elderly-care", icon: HeartHandsIcon, featured: true },
] as const satisfies readonly Service[];

export const featuredServices = services.filter((service) => service.featured);

export function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

export const serviceSlugs = services.map((service) => service.slug);

/** The headline service: the term most Riyadh customers search for. */
export const primaryServiceSlug: ServiceSlug = "monthly-housemaid";
