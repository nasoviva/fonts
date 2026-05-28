"use client";

import type { ReactNode } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

type HashLinkProps = {
  hash: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
};

/** Якорь на главной — скролл без RSC-fetch (избегает Failed to fetch в dev). */
export function HashLink({ hash, children, className, onClick }: HashLinkProps) {
  const pathname = usePathname();
  const onHome = pathname === "/";

  function scrollToHash() {
    const el = document.getElementById(hash);
    if (!el) return;

    const headerOffset = window.matchMedia("(min-width: 768px)").matches
      ? 120
      : 104;
    const top =
      el.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    window.history.replaceState(null, "", `#${hash}`);
    console.log("[HashLink] scroll", { hash, onHome, top });
  }

  if (onHome) {
    return (
      <a
        href={`#${hash}`}
        className={cn(className)}
        onClick={(e) => {
          e.preventDefault();
          scrollToHash();
          onClick?.();
        }}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={{ pathname: "/", hash }}
      className={cn(className)}
      prefetch={false}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
