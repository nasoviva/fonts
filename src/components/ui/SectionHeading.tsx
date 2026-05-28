"use client";

import { cn } from "@/lib/cn";
import { headingAccent, headingMuted, headingPrimary } from "@/lib/heading-colors";

type SectionHeadingProps = {
  caption?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
  subtitleClassName?: string;
};

export function SectionHeading({
  caption,
  title,
  subtitle,
  align = "center",
  tone = "dark",
  className,
  subtitleClassName,
}: SectionHeadingProps) {
  const captionColor = headingPrimary(tone);
  const titleColor = headingAccent(tone);
  const muted = headingMuted(tone);

  return (
    <div
      className={cn(
        "mb-8 md:mb-10",
        align === "center" && "text-center",
        className
      )}
    >
      {caption && (
        <p className={cn("text-caption mb-1", captionColor)}>{caption}</p>
      )}
      <h2 className={cn("text-display", titleColor)}>{title}</h2>
      {subtitle && (
        <p
          className={cn(
            "text-body mt-6 max-w-2xl text-pretty",
            align === "center" && "mx-auto",
            muted,
            subtitleClassName,
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
