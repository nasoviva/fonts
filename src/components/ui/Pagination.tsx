"use client";

import { cn } from "@/lib/cn";

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  prevLabel: string;
  nextLabel: string;
  pageLabel: string;
  className?: string;
};

export function Pagination({
  page,
  totalPages,
  onPageChange,
  prevLabel,
  nextLabel,
  pageLabel,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const go = (next: number) => {
    const clamped = Math.min(Math.max(1, next), totalPages);
    if (clamped !== page) {
      console.log("[Pagination] page change", { from: page, to: clamped });
      onPageChange(clamped);
    }
  };

  return (
    <nav
      className={cn("mt-12 flex flex-wrap items-center justify-center gap-4", className)}
      aria-label="Pagination"
    >
      <button
        type="button"
        onClick={() => go(page - 1)}
        disabled={page <= 1}
        className="rounded-full border hairline-dark px-5 py-2.5 text-meta-label text-cream-dim transition-colors hover:bg-cream/5 hover:text-cream disabled:pointer-events-none disabled:opacity-40"
      >
        {prevLabel}
      </button>

      <span className="text-meta-label min-w-[6rem] text-center text-cream-faint">
        {pageLabel}
      </span>

      <button
        type="button"
        onClick={() => go(page + 1)}
        disabled={page >= totalPages}
        className="rounded-full border hairline-dark px-5 py-2.5 text-meta-label text-cream-dim transition-colors hover:bg-cream/5 hover:text-cream disabled:pointer-events-none disabled:opacity-40"
      >
        {nextLabel}
      </button>
    </nav>
  );
}
