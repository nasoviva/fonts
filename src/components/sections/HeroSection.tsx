"use client";

import { useState } from "react";
import { ContentImage } from "@/components/ui/ContentImage";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SITE_IMAGES } from "@/data/site-images";
import { paths } from "@/i18n/paths";

export function HeroSection() {
  const t = useTranslations("hero");
  const [heroSrc, setHeroSrc] = useState<string>(SITE_IMAGES.heroMain);

  return (
    <Section tone="dark" spacing="compact" className="!pt-28 md:!pt-36">
      <div className="flex flex-col items-center text-center">
        <h1 className="max-w-5xl">
          <span className="text-hero-script block text-on-dark">{t("caption")}</span>
          <span className="text-display mt-3 block text-cream-bright md:mt-4">
            {t("title")}
          </span>
        </h1>

        <p className="text-body mt-8 max-w-xl tracking-wide text-cream-dim md:max-w-2xl lg:max-w-3xl">
          {t("description")}
        </p>

        <div className="mt-10 flex w-full max-w-md flex-col items-stretch gap-3 sm:mx-auto sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-4">
          <Button
            href={paths.contact}
            variant="solid"
            className="min-w-[13rem] shrink-0 whitespace-nowrap px-6 sm:min-w-[12.5rem]"
          >
            {t("ctaContact")}
          </Button>
          <Button
            href={paths.gallery}
            variant="outline"
            className="min-w-[13rem] shrink-0 whitespace-nowrap px-6 sm:min-w-[12.5rem]"
          >
            {t("ctaGallery")}
          </Button>
        </div>

        <div className="relative mt-14 aspect-[21/9] w-full max-w-5xl overflow-hidden rounded-image bg-ink-muted md:mt-20">
          <ContentImage
            src={heroSrc}
            alt=""
            fill
            className="object-cover object-center"
            priority
            sizes="(max-width: 1024px) 100vw, 80rem"
            onError={() => {
              if (heroSrc === SITE_IMAGES.heroMain) {
                setHeroSrc(SITE_IMAGES.heroMainRemote);
              } else if (heroSrc !== SITE_IMAGES.heroMainFallback) {
                setHeroSrc(SITE_IMAGES.heroMainFallback);
              }
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent"
            aria-hidden
          />
        </div>
      </div>
    </Section>
  );
}
