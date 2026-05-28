"use client";

import { Section } from "@/components/ui/Section";
import { Link, usePathname } from "@/i18n/navigation";
import {
  getCaptionInlineStyle,
  HERO_FONT_VARIANTS,
  type HeroFontVariant,
} from "@/lib/hero-font-preview-fonts";
import { cn } from "@/lib/cn";
import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";

type HeroPreviewCopy = {
  caption: string;
  title: string;
  description: string;
};

function HeroFontPreviewLocaleToggle({
  pathname,
  locale,
}: {
  pathname: string;
  locale: string;
}) {
  return (
    <span className="text-meta-label inline-flex shrink-0 items-center gap-1 rounded-full border border-white/20 px-3 py-1.5">
      <Link
        href={pathname}
        locale="en"
        className={cn(
          "transition-colors hover:text-cream",
          locale === "en" ? "text-cream" : "text-cream-faint",
        )}
      >
        EN
      </Link>
      <span className="text-cream-faint">/</span>
      <Link
        href={pathname}
        locale="ru"
        className={cn(
          "transition-colors hover:text-cream",
          locale === "ru" ? "text-cream" : "text-cream-faint",
        )}
      >
        RU
      </Link>
    </span>
  );
}

function HeroFontPreviewBlock({
  variant,
  copy,
  isFirst,
}: {
  variant: HeroFontVariant;
  copy: HeroPreviewCopy;
  isFirst: boolean;
}) {
  const caption = variant.swapLines ? copy.title : copy.caption;
  const title = variant.swapLines ? copy.caption : copy.title;

  return (
    <Section
      id={variant.id}
      tone="dark"
      spacing="compact"
      className={cn(!isFirst && "border-t border-white/10", isFirst && "!pt-12")}
    >
      <p className="text-meta-label mb-8 text-cream-faint">{variant.label}</p>

      <div className="flex flex-col items-center text-center">
        <h1 className="max-w-5xl">
          {!variant.hideCaption && (
            <span className="block text-on-dark" style={getCaptionInlineStyle(variant)}>
              {caption}
            </span>
          )}
          <span
            className={cn(
              "text-display block text-cream-bright",
              !variant.hideCaption && "mt-3 md:mt-4",
            )}
          >
            {title}
          </span>
        </h1>

        <p className="text-body mt-8 max-w-xl tracking-wide text-cream-dim md:max-w-2xl lg:max-w-3xl">
          {copy.description}
        </p>
      </div>
    </Section>
  );
}

/** Next: /en/hero-font-preview · /ru/hero-font-preview · Статика: /hero-font-preview.html */
export function HeroFontPreview() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("hero");

  const copy: HeroPreviewCopy = {
    caption: t("caption"),
    title: t("title"),
    description: t("description"),
  };

  useEffect(() => {
    console.log("[HeroFontPreview] locale:", locale, {
      caption: copy.caption,
      title: copy.title,
    });
  }, [locale, copy.caption, copy.title]);

  return (
    <>
      <Section tone="dark" spacing="tight" className="border-b border-white/10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <nav className="flex flex-wrap gap-2" aria-label="Варианты шрифтов">
            {HERO_FONT_VARIANTS.map((variant) => (
              <a
                key={variant.id}
                href={`#${variant.id}`}
                className="rounded-full border border-white/20 px-3 py-1.5 text-xs text-cream-dim transition-colors hover:border-cream-dim hover:text-cream"
              >
                {variant.label}
              </a>
            ))}
          </nav>
          <HeroFontPreviewLocaleToggle pathname={pathname} locale={locale} />
        </div>
      </Section>

      {HERO_FONT_VARIANTS.map((variant, index) => (
        <HeroFontPreviewBlock
          key={variant.id}
          variant={variant}
          copy={copy}
          isFirst={index === 0}
        />
      ))}
    </>
  );
}
