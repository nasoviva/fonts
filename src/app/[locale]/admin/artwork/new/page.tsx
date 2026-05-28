import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { ArtworkForm } from "@/components/admin/ArtworkForm";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function NewArtworkPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.form");

  return (
    <div className="container-site py-12 md:py-16">
      <h1 className="text-display mb-12 text-3xl text-cream-bright">{t("createTitle")}</h1>
      <ArtworkForm mode="create" />
    </div>
  );
}
