import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { TaxonomyProvider } from "@/contexts/TaxonomyContext";
import { routing, type Locale } from "@/i18n/routing";
import { loadTaxonomy } from "@/lib/taxonomy";
import { buildSiteJsonLd } from "@/lib/seo-json-ld";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";

type SiteLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function SiteLayout({ children, params }: SiteLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    return null;
  }

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "meta" });
  const footer = await getTranslations({ locale, namespace: "footer" });
  const taxonomy = await loadTaxonomy();

  const jsonLd = buildSiteJsonLd({
    locale: locale as Locale,
    siteName: t("siteName"),
    personName: t("personName"),
    jobTitle: t("jobTitle"),
    description: t("description"),
    email: footer("emailAddress"),
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      <Header />
      <TaxonomyProvider taxonomy={taxonomy}>
        <main>{children}</main>
      </TaxonomyProvider>
      <Footer />
    </>
  );
}
