"use client";

import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function DirectionsSection() {
  const t = useTranslations("directions");
  const items = ["item1", "item2", "item3", "item4"] as const;

  return (
    <Section tone="dark" spacing="compact">
      <SectionHeading
        caption={t("caption")}
        title={t("title")}
        subtitle={t("intro")}
        subtitleClassName="md:max-w-3xl lg:max-w-4xl"
      />
      <ul className="mx-auto mt-4 grid max-w-3xl gap-6 md:grid-cols-2 md:gap-8">
        {items.map((key) => (
          <li key={key} className="border-t hairline-dark pt-6">
            <h3 className="text-subheader text-sm uppercase tracking-wide text-cream-bright">
              {t(`${key}Title`)}
            </h3>
            <p className="text-body mt-3 text-cream-dim">{t(`${key}Text`)}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
