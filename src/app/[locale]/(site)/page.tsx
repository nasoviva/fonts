import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/sections/HeroSection";
import { QuoteSection } from "@/components/sections/QuoteSection";
import { DirectionsSection } from "@/components/sections/DirectionsSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { PortfolioPreviewSection } from "@/components/sections/PortfolioPreviewSection";
import { MarqueeSection } from "@/components/sections/MarqueeSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { getPortfolioPreviewArtworks } from "@/lib/artwork-preview";
import { getPublicArtworks } from "@/lib/artwork-public";
import { readArtworks } from "@/lib/artwork-store";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const allArtworks = await readArtworks();
  const visibleArtworks = getPublicArtworks(allArtworks);

  return (
    <>
      <HeroSection />
      <QuoteSection />
      <DirectionsSection />
      <AboutSection imageOnRight />
      <ServicesSection />
      <PortfolioPreviewSection
        initialArtworks={visibleArtworks}
        initialPreview={getPortfolioPreviewArtworks(allArtworks, locale, 4)}
      />
      <MarqueeSection />
      <ContactSection />
    </>
  );
}
