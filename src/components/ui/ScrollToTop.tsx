"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

type ScrollToTopProps = {
  label: string;
};

export function ScrollToTop({ label }: ScrollToTopProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    console.log("[ScrollToTop] listener attached");
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full",
        "border hairline-dark bg-ink/90 text-cream-bright backdrop-blur-md",
        "transition-opacity hover:bg-ink-soft",
      )}
      onClick={() => {
        console.log("[ScrollToTop] click");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
