import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { SITE_IMAGES } from "@/data/site-images";

const OPEN_GRAPH_LOCALE: Record<Locale, string> = {
  en: "en_US",
  ru: "ru_RU",
};

export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;

  return "http://localhost:3000";
}

export function localizedPath(locale: string, path = ""): string {
  const normalized = path.startsWith("/") ? path : path ? `/${path}` : "";
  if (!normalized || normalized === "/") return `/${locale}`;
  return `/${locale}${normalized}`;
}

export function absoluteUrl(path: string): string {
  return `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildLanguageAlternates(path = ""): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = absoluteUrl(localizedPath(locale, path));
  }
  languages["x-default"] = absoluteUrl(
    localizedPath(routing.defaultLocale, path),
  );
  return { languages };
}

export type PageMetadataInput = {
  locale: string;
  path?: string;
  title: string;
  description: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  noIndex?: boolean;
};

export function buildPageMetadata(input: PageMetadataInput): Metadata {
  const locale = input.locale as Locale;
  const path = input.path ?? "";
  const canonical = absoluteUrl(localizedPath(locale, path));
  const ogImage = input.ogImage ?? absoluteUrl(SITE_IMAGES.producerPortrait);
  const alternateLocales = routing.locales
    .filter((l) => l !== locale)
    .map((l) => OPEN_GRAPH_LOCALE[l]);

  return {
    metadataBase: new URL(getSiteUrl()),
    title: input.title,
    description: input.description,
    keywords: input.keywords,
    alternates: {
      canonical,
      ...buildLanguageAlternates(path),
    },
    openGraph: {
      type: input.ogType ?? "website",
      locale: OPEN_GRAPH_LOCALE[locale] ?? locale,
      alternateLocale: alternateLocales,
      url: canonical,
      title: input.ogTitle ?? input.title,
      description: input.ogDescription ?? input.description,
      siteName: input.title.split("—")[0]?.trim() ?? input.title,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: input.ogTitle ?? input.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: input.ogTitle ?? input.title,
      description: input.ogDescription ?? input.description,
      images: [ogImage],
    },
    robots: input.noIndex
      ? { index: false, follow: false, nocache: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}

export function defaultOgImage(): string {
  return absoluteUrl(SITE_IMAGES.producerPortrait);
}
