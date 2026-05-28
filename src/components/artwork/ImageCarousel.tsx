"use client";

import { ContentImage } from "@/components/ui/ContentImage";
import { useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/cn";

type ImageCarouselProps = {
  images: string[];
  alt: string;
};

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      className={className}
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      className={className}
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const goTo = useCallback(
    (next: number) => {
      setIndex((next + images.length) % images.length);
    },
    [images.length]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") goTo(index - 1);
      if (e.key === "ArrowRight") goTo(index + 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, goTo]);

  function handleTouchStart(e: React.TouchEvent) {
    setTouchStart(e.touches[0].clientX);
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goTo(diff > 0 ? index + 1 : index - 1);
    }
    setTouchStart(null);
  }

  if (images.length === 0) return null;

  const hasMultiple = images.length > 1;

  return (
    <div className="flex flex-col gap-4">
      <div
        className="relative aspect-[4/5] w-full overflow-hidden rounded-image bg-ink-muted md:aspect-[3/4]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <ContentImage
          src={images[index]}
          alt={`${alt} — ${index + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>

      {hasMultiple && (
        <div className="flex items-center gap-3 md:gap-4">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            className="shrink-0 p-1 text-cream-dim transition-colors hover:text-cream-bright"
            aria-label="Previous image"
          >
            <ChevronLeft />
          </button>

          <div className="flex min-w-0 flex-1 justify-center gap-2 overflow-x-auto pb-1">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setIndex(i)}
                className={cn(
                  "relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-ink-muted transition-all md:h-20 md:w-[4.5rem]",
                  i === index
                    ? "opacity-100 ring-1 ring-cream-bright"
                    : "opacity-35 hover:opacity-55"
                )}
                aria-label={`Image ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
              >
                <ContentImage
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="72px"
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => goTo(index + 1)}
            className="shrink-0 p-1 text-cream-dim transition-colors hover:text-cream-bright"
            aria-label="Next image"
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
