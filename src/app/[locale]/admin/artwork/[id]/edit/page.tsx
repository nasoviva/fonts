import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getArtworkById } from "@/lib/artwork-store";
import { ArtworkForm } from "@/components/admin/ArtworkForm";

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function EditArtworkPage({ params }: PageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.form");

  const artwork = await getArtworkById(id);
  if (!artwork) notFound();

  return (
    <div className="container-site py-12 md:py-16">
      <h1 className="text-display mb-12 text-3xl text-cream-bright">{t("editTitle")}</h1>
      <ArtworkForm
        key={artwork.id}
        mode="edit"
        artworkId={artwork.id}
        initial={{
          title: artwork.title,
          description: artwork.description,
          images: artwork.images,
          categoryId: artwork.categoryId,
          authorId: artwork.authorId,
          hidden: artwork.hidden,
        }}
      />
    </div>
  );
}
