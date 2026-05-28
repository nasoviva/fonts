"use client";

import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";

const OPEN_QUOTE = "\u00AB";
const CLOSE_QUOTE = "\u00BB";

export function QuoteSection() {
  const t = useTranslations("quote");

  return (
    <Section tone="light" spacing="compact">
      <blockquote className="mx-auto max-w-3xl text-center">
        <p className="text-lead text-ink">
          {OPEN_QUOTE}
          {"\u00A0"}
          {t("text")}
          {"\u00A0"}
          {CLOSE_QUOTE}
        </p>
      </blockquote>
    </Section>
  );
}
