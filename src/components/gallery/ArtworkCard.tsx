import { LocaleRouteLink } from "@/components/navigation/LocaleRouteLink";
import { ContentImage } from "@/components/ui/ContentImage";
import { useCategoryLabel, useAuthorLabel } from "@/contexts/TaxonomyContext";
import { cn } from "@/lib/cn";
import {
  type Artwork,
  getLocalized,
} from "@/data/artworks";

type ArtworkCardProps = {
  artwork: Artwork;
  locale: string;
  className?: string;
  /** Первые карточки на экране — грузим сразу, остальные lazy. */
  priority?: boolean;
};

export function ArtworkCard({
  artwork,
  locale,
  className,
  priority = false,
}: ArtworkCardProps) {
  const categoryLabel = useCategoryLabel(artwork.categoryId, locale);
  const authorLabel = useAuthorLabel(artwork.authorId, locale);

  const title = getLocalized(artwork.title, locale);
  const description = getLocalized(artwork.description, locale);

  return (
    <LocaleRouteLink
      href={`/artwork/${artwork.slug}`}
      className={cn("group block min-w-0 text-on-dark", className)}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-image bg-ink-muted">
        <ContentImage
          src={artwork.images[0]}
          alt={title}
          fill
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="mt-4 min-w-0">
        <h3 className="text-subheader truncate text-lg uppercase leading-tight text-on-dark">
          {title}
        </h3>
        <p className="text-meta-label mt-1 truncate text-cream-faint">
          {categoryLabel}
        </p>
      </div>
      <p className="text-body mt-1 line-clamp-2 text-sm text-cream-faint">
        {description}
      </p>
      <p className="text-meta-label mt-1 truncate text-cream-faint">
        {authorLabel}
      </p>
    </LocaleRouteLink>
  );
}
