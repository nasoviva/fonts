"use client";

import { useEffect, useState } from "react";
import { ContentImage } from "@/components/ui/ContentImage";
import { SITE_IMAGES } from "@/data/site-images";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import type { AppHref } from "@/i18n/paths";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/cn";

type AudienceDetailSectionProps = {
  id: string;
  namespace: "artists" | "collectors";
  imageSrc: string;
  imageOnRight?: boolean;
  ctaHref: AppHref;
  ctaVariant?: "solid" | "outline";
};

export function AudienceDetailSection({
  id,
  namespace,
  imageSrc,
  imageOnRight = true,
  ctaHref,
  ctaVariant = "solid",
}: AudienceDetailSectionProps) {
  const t = useTranslations(`audience.${namespace}`);
  const fallbackSrc =
    namespace === "artists"
      ? SITE_IMAGES.audienceArtistsArchive
      : SITE_IMAGES.audienceCollectorsArchive;
  const [src, setSrc] = useState(imageSrc);

  useEffect(() => {
    setSrc(imageSrc);
    console.log("[AudienceDetail] image set", { namespace, imageSrc });
  }, [imageSrc, namespace]);

  return (
    <Section tone="dark" spacing="compact">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div
          className={cn("order-2", imageOnRight ? "lg:order-1" : "lg:order-2")}
        >
          <div id={id} className="scroll-mt-24 md:scroll-mt-28" aria-hidden />
          <p className="text-caption text-on-dark">{t("caption")}</p>
          <h2 className="text-subheader mt-2 uppercase tracking-wide text-cream-bright">
            {t("title")}
          </h2>
          <p className="text-body mt-8 text-cream-dim">{t("paragraph1")}</p>
          <p className="text-body mt-4 text-cream-dim">{t("paragraph2")}</p>
          <p className="text-body mt-4 text-cream-dim">{t("paragraph3")}</p>
          <p className="text-body mt-4 text-cream-dim">{t("paragraph4")}</p>
          <div className="mt-10">
            <Button
              href={ctaHref}
              variant={ctaVariant === "outline" ? "outline" : "solid"}
            >
              {t("cta")}
            </Button>
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
            onError={() => {
              if (src !== fallbackSrc) {
                console.log("[AudienceDetail] image fallback to archive", {
                  namespace,
                });
                setSrc(fallbackSrc);
              }
            }}
          />
        </div>
      </div>
    </Section>
  );
}
