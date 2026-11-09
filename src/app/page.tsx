import { business } from "@/config/business";

export default function HomePage() {
  return (
    <main className="container-content flex flex-1 flex-col justify-center gap-4 py-24">
      <p className="text-sm font-semibold tracking-wide text-brand-700 uppercase">
        {business.address.city}, {business.address.country}
      </p>
      <h1 className="text-4xl font-bold sm:text-5xl">{business.legalNameAr}</h1>
      <p className="max-w-prose text-lg text-ink-500">
        Project foundation is in place. Bilingual routing, the design system and
        the service pages are added in the following milestones.
      </p>
    </main>
  );
}
