import type { ReactNode } from "react";

type FeatureCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
};

/** Non-interactive counterpart to ServiceCard, used for value propositions. */
export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="flex flex-col gap-3">
      <span
        className="flex size-12 items-center justify-center rounded-card bg-sand-100 text-2xl text-sand-600"
        aria-hidden="true"
      >
        {icon}
      </span>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-sm leading-relaxed text-ink-500">{description}</p>
    </div>
  );
}
