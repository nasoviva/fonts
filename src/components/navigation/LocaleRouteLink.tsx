"use client";

import type { ReactNode } from "react";
import { useLocale } from "next-intl";
import { cn } from "@/lib/cn";

type LocaleRouteLinkProps = {
  /** Путь без локали, например `/gallery` или `/artwork/slug`. */
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
};

/** Обычная ссылка с локалью — полная навигация, без сбойного RSC-prefetch. */
export function LocaleRouteLink({
  href,
  className,
  children,
  onClick,
}: LocaleRouteLinkProps) {
  const locale = useLocale();
  const path = href.startsWith("/")
    ? `/${locale}${href}`
    : `/${locale}/${href}`;

  return (
    <a href={path} className={cn(className)} onClick={onClick}>
      {children}
    </a>
  );
}
