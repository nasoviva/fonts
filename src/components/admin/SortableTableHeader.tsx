"use client";

import { cn } from "@/lib/cn";

export type SortDirection = "asc" | "desc";

type SortableTableHeaderProps = {
  label: string;
  active: boolean;
  direction: SortDirection;
  onSort: () => void;
  className?: string;
  sortAscLabel: string;
  sortDescLabel: string;
};

export function SortableTableHeader({
  label,
  active,
  direction,
  onSort,
  className,
  sortAscLabel,
  sortDescLabel,
}: SortableTableHeaderProps) {
  const ariaSort = active
    ? direction === "asc"
      ? "ascending"
      : "descending"
    : "none";

  return (
    <th className={className} aria-sort={ariaSort}>
      <button
        type="button"
        onClick={onSort}
        className="text-meta-label group inline-flex items-center gap-1.5 text-left transition-colors hover:text-cream"
        aria-label={
          active
            ? direction === "asc"
              ? sortDescLabel
              : sortAscLabel
            : sortAscLabel
        }
      >
        <span>{label}</span>
        <span className="inline-flex flex-col leading-none text-cream-faint">
          <ChevronUp active={active && direction === "asc"} />
          <ChevronDown active={active && direction === "desc"} />
        </span>
      </button>
    </th>
  );
}

function ChevronUp({ active }: { active: boolean }) {
  return (
    <svg
      width="10"
      height="6"
      viewBox="0 0 10 6"
      className={cn("-mb-0.5", active ? "text-cream" : "text-cream-faint/50 group-hover:text-cream-dim")}
      aria-hidden
    >
      <path d="M1 5L5 1L9 5" fill="none" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

function ChevronDown({ active }: { active: boolean }) {
  return (
    <svg
      width="10"
      height="6"
      viewBox="0 0 10 6"
      className={cn("-mt-0.5", active ? "text-cream" : "text-cream-faint/50 group-hover:text-cream-dim")}
      aria-hidden
    >
      <path d="M1 1L5 5L9 1" fill="none" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}
