import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { TaxonomyManager } from "@/components/admin/TaxonomyManager";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminTaxonomyPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.taxonomy");

  return (
    <div className="container-site py-10 md:py-14">
      <h1 className="text-display mb-2 text-2xl text-cream-bright sm:text-3xl">
        {t("title")}
      </h1>
      <p className="text-body mb-10 max-w-2xl text-cream-dim">{t("subtitle")}</p>
      <TaxonomyManager />
    </div>
  );
}
