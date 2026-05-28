"use client";

import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/forms/ContactForm";

export function ContactSection() {
  const t = useTranslations("contact");

  return (
    <Section tone="light" spacing="compact">
      <div
        id="contact"
        className="scroll-mt-24 md:scroll-mt-28"
        aria-hidden
      />
      <SectionHeading
        caption={t("caption")}
        title={t("title")}
        subtitle={t("description")}
        tone="light"
        className="mb-4 md:mb-6"
      />
      <ContactForm tone="light" />
    </Section>
  );
}
