import type { ComponentType } from "react";
import type { SVGProps } from "react";
import {
  BabyIcon,
  BroomIcon,
  ChefHatIcon,
  HeartHandsIcon,
  SparkleIcon,
  UsersIcon,
} from "@/components/ui/icons";

/**
 * The service catalogue holds only structure: the URL slug, the icon and the
 * display order. Every piece of copy lives in the message catalogues under
 * `services.<slug>`, so adding a language never means touching this file.
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
  { slug: "full-time-maid", icon: UsersIcon, featured: true },
  { slug: "part-time-cleaning", icon: BroomIcon, featured: true },
  { slug: "deep-cleaning", icon: SparkleIcon, featured: true },
  { slug: "nanny", icon: BabyIcon, featured: true },
  { slug: "elderly-care", icon: HeartHandsIcon, featured: true },
  { slug: "cooking", icon: ChefHatIcon, featured: true },
] as const satisfies readonly Service[];

export const featuredServices = services.filter((service) => service.featured);

export function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

export const serviceSlugs = services.map((service) => service.slug);
