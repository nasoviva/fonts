import type { CSSProperties } from "react";
import {
  Bad_Script,
  Cormorant_Garamond,
  Great_Vibes,
  Marck_Script,
  Poiret_One,
  Roboto,
} from "next/font/google";

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-preview-great-vibes",
});

const poiretOne = Poiret_One({
  subsets: ["latin", "cyrillic"],
  weight: "400",
  variable: "--font-preview-poiret-one",
});

const cormorantItalic = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["300"],
  style: ["italic"],
  variable: "--font-preview-cormorant",
});

const roboto = Roboto({
  subsets: ["latin", "cyrillic"],
  weight: ["300"],
  style: ["italic"],
  variable: "--font-preview-roboto",
});

const badScript = Bad_Script({
  subsets: ["latin", "cyrillic"],
  weight: "400",
  variable: "--font-preview-bad-script",
});

const marckScript = Marck_Script({
  subsets: ["latin", "cyrillic"],
  weight: "400",
  variable: "--font-preview-marck-script",
});

export const heroFontPreviewFontClassName = [
  greatVibes.variable,
  poiretOne.variable,
  cormorantItalic.variable,
  roboto.variable,
  badScript.variable,
  marckScript.variable,
].join(" ");

export type HeroFontVariant = {
  id: string;
  label: string;
  fontFamily: string;
  fontWeight: number;
  fontStyle?: "normal" | "italic";
  swapLines?: boolean;
  hideCaption?: boolean;
  textTransform?: "none" | "uppercase";
  letterSpacing?: string;
};

export const HERO_FONT_VARIANTS: HeroFontVariant[] = [
  {
    id: "great-vibes",
    label: "Great Vibes",
    fontFamily: "var(--font-preview-great-vibes), cursive",
    fontWeight: 400,
  },
  {
    id: "great-vibes-swapped",
    label: "Great Vibes (swap)",
    fontFamily: "var(--font-preview-great-vibes), cursive",
    fontWeight: 400,
    swapLines: true,
  },
  {
    id: "poiret-one",
    label: "Poiret One",
    fontFamily: 'var(--font-preview-poiret-one), "Poiret One", sans-serif',
    fontWeight: 400,
    letterSpacing: "0.06em",
  },
  {
    id: "cormorant-garamond",
    label: "Cormorant Garamond",
    fontFamily:
      'var(--font-preview-cormorant), var(--font-cormorant), "Cormorant Garamond", Georgia, serif',
    fontWeight: 300,
    fontStyle: "italic",
  },
  {
    id: "roboto",
    label: "Roboto",
    fontFamily: 'var(--font-preview-roboto), "Roboto", system-ui, sans-serif',
    fontWeight: 300,
    fontStyle: "italic",
    letterSpacing: "0.04em",
  },
  {
    id: "bad-script",
    label: "Bad Script",
    fontFamily: 'var(--font-preview-bad-script), "Bad Script", cursive',
    fontWeight: 400,
  },
  {
    id: "marck-script",
    label: "Marck Script",
    fontFamily: 'var(--font-preview-marck-script), "Marck Script", cursive',
    fontWeight: 400,
  },
  {
    id: "no-name",
    label: "Без имени",
    fontFamily: "inherit",
    fontWeight: 400,
    hideCaption: true,
  },
];

export function getCaptionInlineStyle(variant: HeroFontVariant): CSSProperties {
  return {
    fontFamily: variant.fontFamily,
    fontSize: "var(--text-hero-script-size)",
    fontWeight: variant.fontWeight,
    fontStyle: variant.fontStyle ?? "normal",
    lineHeight: 1.08,
    letterSpacing: variant.letterSpacing ?? "0.03em",
    textTransform: variant.textTransform ?? "none",
    display: "inline-block",
  };
}
