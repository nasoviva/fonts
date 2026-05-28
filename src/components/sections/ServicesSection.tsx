"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { headingAccent } from "@/lib/heading-colors";
import { cn } from "@/lib/cn";
import {
  SERVICE_CARD_BUTTON_CLASS,
  SERVICE_CARD_BUTTON_GROUP_CLASS,
} from "@/lib/cta-button";
import { paths, type AppHref } from "@/i18n/paths";

export function ServicesSection() {
  const t = useTranslations("services");

  return (
    <Section tone="dark" spacing="compact" className="!pt-12 md:!pt-16">
      <div className="mb-8 text-center md:mb-10">
        <p className="text-hero-script text-on-dark">{t("sectionScript")}</p>
        <h2 className={cn("text-display mt-1 md:mt-2", headingAccent("dark"))}>
          {t("sectionTitle")}
        </h2>
      </div>
      <div className="mt-10 grid gap-8 md:grid-cols-2 md:gap-10">
        <ServiceCard
          id="artists"
          title={t("artists.title")}
          description={t("artists.description")}
          moreLabel={t("more")}
          moreHref={paths.artists}
          actions={[
            {
              label: t("artists.cta"),
              href: paths.contact,
              variant: "outline-dark",
            },
          ]}
        />
        <ServiceCard
          id="collectors"
          title={t("collectors.title")}
          description={t("collectors.description")}
          moreLabel={t("more")}
          moreHref={paths.collectors}
          actions={[
            {
              label: t("collectors.cta"),
              href: paths.gallery,
              variant: "outline-dark",
            },
          ]}
        />
      </div>
    </Section>
  );
}

type CardAction = {
  label: string;
  href: AppHref;
  variant: "solid-dark" | "outline-dark";
};

function ServiceCard({
  id,
  title,
  description,
  moreLabel,
  moreHref,
  actions,
}: {
  id: string;
  title: string;
  description: string;
  moreLabel: string;
  moreHref: AppHref;
  actions: CardAction[];
}) {
  return (
    <article
      id={id}
      className="scroll-mt-28 flex flex-col items-center rounded-card bg-cream px-8 py-10 text-center text-ink md:scroll-mt-32 md:px-12 md:py-12"
    >
      <h3 className="text-subheader uppercase text-ink">{title}</h3>
      <p className="text-body mt-6 max-w-sm text-ink-dim">{description}</p>
      <div className={`mt-8 ${SERVICE_CARD_BUTTON_GROUP_CLASS}`}>
        <Button
          href={moreHref}
          variant="solid-dark"
          className={SERVICE_CARD_BUTTON_CLASS}
        >
          {moreLabel}
        </Button>
        {actions.map((action) => (
          <Button
            key={action.label}
            href={action.href}
            variant={action.variant}
            className={SERVICE_CARD_BUTTON_CLASS}
          >
            {action.label}
          </Button>
        ))}
      </div>
    </article>
  );
}
