import type { Metadata } from "next";
import { HeroFontPreview } from "@/components/preview/HeroFontPreview";

export const metadata: Metadata = {
  title: "Hero — сравнение шрифтов",
  robots: { index: false, follow: false },
};

export default function HeroFontPreviewPage() {
  return <HeroFontPreview />;
}
