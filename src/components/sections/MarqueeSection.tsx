"use client";

import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";

export function MarqueeSection() {
  const t = useTranslations("marquee");
  const text = `${t("text")} `.repeat(6);

  return (
    <Section tone="light" spacing="tight" fullWidth className="overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        <span className="text-display px-8 text-ink">{text}</span>
        <span className="text-display px-8 text-ink" aria-hidden>
          {text}
        </span>
      </div>
    </Section>
  );
}
