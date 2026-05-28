import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/cn";
import { isExternalImageSrc } from "@/lib/image-src";

export type ContentImageProps = Omit<ImageProps, "src" | "alt" | "priority"> & {
  src: string;
  alt: string;
  /** Above-the-fold: без lazy, высокий приоритет загрузки. */
  priority?: boolean;
};

/**
 * Изображение с зарезервированным местом (родитель с aspect-ratio),
 * lazy ниже сгиба, optimizer для локальных /uploads и /images.
 */
export function ContentImage({
  src,
  alt,
  priority = false,
  className,
  quality,
  ...rest
}: ContentImageProps) {
  const srcPath = src.split("?")[0];
  const external = isExternalImageSrc(srcPath);

  return (
    <Image
      key={srcPath}
      src={external ? src : srcPath}
      alt={alt}
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      unoptimized={external}
      quality={external ? undefined : (quality ?? 80)}
      className={cn(className)}
      {...rest}
    />
  );
}
