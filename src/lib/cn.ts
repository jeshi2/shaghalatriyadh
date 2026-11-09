type ClassValue = string | false | null | undefined;

/**
 * Minimal class-name joiner. The project does not need `clsx`/`tailwind-merge`
 * because variants are resolved through explicit maps rather than by merging
 * conflicting utility classes.
 */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
