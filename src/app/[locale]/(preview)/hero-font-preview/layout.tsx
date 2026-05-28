import { heroFontPreviewFontClassName } from "@/lib/hero-font-preview-fonts";

type LayoutProps = {
  children: React.ReactNode;
};

/** Без header/footer — только превью шрифтов. */
export default function HeroFontPreviewLayout({ children }: LayoutProps) {
  return (
    <>
      <div
        className={`min-h-screen bg-ink text-cream antialiased ${heroFontPreviewFontClassName}`}
      >
        <main className="py-8 md:py-12">{children}</main>
      </div>
    </>
  );
}
