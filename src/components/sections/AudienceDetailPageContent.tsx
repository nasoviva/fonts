"use client";

import { useState } from "react";
import { ContentImage } from "@/components/ui/ContentImage";
import { SITE_IMAGES } from "@/data/site-images";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import type { AppHref } from "@/i18n/paths";
import { paths } from "@/i18n/paths";
import { Section } from "@/components/ui/Section";
import { CTA_BUTTON_CLASS, CTA_BUTTON_GROUP_CLASS } from "@/lib/cta-button";
import { cn } from "@/lib/cn";

type DetailCta = {
  href: AppHref;
  label: string;
  variant: "solid" | "outline";
};

type AudienceDetailPageContentProps = {
  namespace: "artists" | "collectors";
  imageSrc: string;
  imageOnRight?: boolean;
  ctas: DetailCta[];
};

export function AudienceDetailPageContent({
  namespace,
  imageSrc,
  imageOnRight = true,
  ctas,
}: AudienceDetailPageContentProps) {
  const t = useTranslations(`audience.${namespace}`);
  const tPage = useTranslations("audiencePage");
  const fallbackSrc =
    namespace === "artists"
      ? SITE_IMAGES.audienceArtistsArchive
      : SITE_IMAGES.audienceCollectorsArchive;
  const [src, setSrc] = useState(imageSrc);

  return (
    <Section tone="dark" spacing="compact" className="!pt-28 md:!pt-36">
      <Link
        href={paths.home}
        className="text-meta-label mb-10 inline-block text-cream-dim hover:text-cream-bright"
      >
        ← {tPage("back")}
      </Link>
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div
          className={cn("order-2", imageOnRight ? "lg:order-1" : "lg:order-2")}
        >
          <p className="text-caption text-on-dark">{t("caption")}</p>
          <h1 className="text-subheader mt-2 uppercase tracking-wide text-cream-bright">
            {t("title")}
          </h1>
          <p className="text-body mt-8 text-cream-dim">{t("paragraph1")}</p>
          <p className="text-body mt-4 text-cream-dim">{t("paragraph2")}</p>
          <p className="text-body mt-4 text-cream-dim">{t("paragraph3")}</p>
          <p className="text-body mt-4 text-cream-dim">{t("paragraph4")}</p>
          <div className={`mt-10 ${CTA_BUTTON_GROUP_CLASS}`}>
            {ctas.map((cta) => (
              <Button
                key={cta.label}
                href={cta.href}
                variant={cta.variant}
                className={CTA_BUTTON_CLASS}
              >
                {cta.label}
              </Button>
            ))}
          </div>
        </div>
        <div
          className={cn(
            "relative order-1 aspect-[3/4] w-full max-w-md justify-self-center overflow-hidden rounded-image bg-ink-muted lg:max-w-none",
            imageOnRight ? "lg:order-2" : "lg:order-1",
          )}
        >
          <ContentImage
            key={src}
            src={src}
            alt={t("imageAlt")}
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 80vw, 40vw"
            priority
            onError={() => {
              if (src !== fallbackSrc) {
                console.log("[AudienceDetailPage] image fallback", { namespace });
                setSrc(fallbackSrc);
              }
            }}
          />
        </div>
      </div>
    </Section>
  );
}
