import { notFound } from "next/navigation";

/**
 * Catch-all inside the locale segment. Without it, an unknown path such as
 * `/ar/unknown` would fall through to the global 404 and lose both the locale
 * layout and the translated copy.
 */
export default function CatchAllPage() {
  notFound();
}
