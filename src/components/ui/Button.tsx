import { cn } from "@/lib/cn";
import { HashLink } from "@/components/navigation/HashLink";
import { LocaleRouteLink } from "@/components/navigation/LocaleRouteLink";
import type { AppHref } from "@/i18n/paths";
import type { ComponentPropsWithoutRef } from "react";

function isHashHref(
  href: AppHref,
): href is { pathname: "/"; hash: string } {
  return (
    typeof href === "object" &&
    href !== null &&
    "hash" in href &&
    typeof (href as { hash?: string }).hash === "string"
  );
}

type Variant = "solid" | "outline" | "solid-dark" | "outline-dark";

const variants: Record<Variant, string> = {
  solid:
    "border-cream bg-cream text-ink hover:border-cream-muted hover:bg-cream-muted",
  outline:
    "border-cream/35 bg-transparent text-cream hover:border-cream-bright/50 hover:bg-cream-bright/8 hover:text-cream-bright",
  "solid-dark":
    "border-ink bg-ink text-cream hover:border-ink-soft hover:bg-ink-soft hover:text-cream-bright",
  "outline-dark":
    "border-ink/20 bg-transparent text-ink hover:border-ink/30 hover:bg-black/5",
};

type ButtonProps = {
  variant?: Variant;
  href?: AppHref;
  children: React.ReactNode;
  className?: string;
} & ComponentPropsWithoutRef<"button">;

export function Button({
  variant = "solid",
  href,
  children,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex h-12 min-w-[11rem] items-center justify-center rounded-full border px-8 text-meta-label leading-none transition-colors duration-200 box-border",
    variants[variant],
    className
  );

  if (href) {
    if (isHashHref(href)) {
      return (
        <HashLink hash={href.hash} className={classes}>
          {children}
        </HashLink>
      );
    }
    if (typeof href !== "string") {
      console.warn("[Button] unexpected href", href);
      return null;
    }
    return (
      <LocaleRouteLink href={href} className={classes}>
        {children}
      </LocaleRouteLink>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
