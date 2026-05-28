"use client";

import { useState } from "react";
import { ContentImage } from "@/components/ui/ContentImage";
import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { ThreadsIcon } from "@/components/ui/SocialIcons";
import { SITE_IMAGES } from "@/data/site-images";
import { cn } from "@/lib/cn";

type AboutSectionProps = {
  imageOnRight?: boolean;
};

export function AboutSection({ imageOnRight = true }: AboutSectionProps) {
  const t = useTranslations("about");
  const [portraitSrc, setPortraitSrc] = useState(SITE_IMAGES.producerPortrait);

  return (
    <Section tone="dark" id="about" spacing="compact">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div
          className={cn("order-2", imageOnRight ? "lg:order-1" : "lg:order-2")}
        >
          <p className="text-caption text-on-dark">{t("caption")}</p>
          <h2 className="text-subheader mt-2 uppercase tracking-wide text-cream-bright">
            {t("title")}
          </h2>
          <p className="text-body mt-8 text-cream-dim">{t("paragraph1")}</p>
          <p className="text-body mt-4 text-cream-dim">{t("paragraph2")}</p>
          <a
            href={t("threadsUrl")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-meta-label mt-8 inline-flex items-center gap-2 text-cream-dim hover:text-cream-bright"
          >
            <ThreadsIcon />
            {t("threads")}
          </a>
        </div>
        <div
          className={cn(
            "relative order-1 aspect-[3/4] w-full max-w-md justify-self-center overflow-hidden rounded-image bg-ink-muted lg:max-w-none",
            imageOnRight ? "lg:order-2" : "lg:order-1",
          )}
        >
          <ContentImage
            key={portraitSrc}
            src={portraitSrc}
            alt={t("imageAlt")}
            fill
            className="object-cover object-top"
            sizes="(max-width: 1024px) 80vw, 40vw"
            priority
            onError={() => {
              console.log("[About] portrait load failed", portraitSrc);
            }}
          />
        </div>
      </div>
    </Section>
  );
}
