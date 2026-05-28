"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations, useLocale } from "next-intl";
import { HashLink } from "@/components/navigation/HashLink";
import { Link, usePathname } from "@/i18n/navigation";
import { paths, type AppHref } from "@/i18n/paths";
import { cn } from "@/lib/cn";

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const links = [
    { kind: "route" as const, href: paths.home, label: t("home") },
    { kind: "route" as const, href: paths.artists, label: t("artists") },
    { kind: "route" as const, href: paths.collectors, label: t("collectors") },
    { kind: "hash" as const, hash: "contact", label: t("contact") },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 border-b hairline-dark bg-ink/90 text-on-dark backdrop-blur-md",
          open ? "z-[70]" : "z-50"
        )}
      >
        <div className="container-site flex h-16 items-center justify-end md:h-20">
          <nav className="hidden items-center gap-8 lg:flex">
            {links.map((link) => (
              <NavItem
                key={link.label}
                link={link}
                pathname={pathname}
              />
            ))}
            <LocaleToggle pathname={pathname} locale={locale} />
          </nav>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center text-cream lg:hidden"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </header>

      {mounted &&
        open &&
        createPortal(
          <MobileMenu
            links={links}
            pathname={pathname}
            locale={locale}
            onClose={close}
          />,
          document.body
        )}
    </>
  );
}

function MobileMenu({
  links,
  pathname,
  locale,
  onClose,
}: {
  links: HeaderLink[];
  pathname: string;
  locale: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[55] lg:hidden" role="dialog" aria-modal="true">
      {/* Backdrop — full screen, behind panel */}
      <div
        className="absolute inset-0 cursor-pointer bg-ink/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Menu panel — below header */}
      <nav
        className="relative z-10 mt-16 border-b hairline-dark bg-ink px-6 py-8 text-on-dark shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <ul className="flex flex-col items-end gap-5">
          {links.map((link) => (
            <li key={link.label}>
              <MobileNavItem link={link} onClose={onClose} />
            </li>
          ))}
          <li>
            <LocaleToggle
              pathname={pathname}
              locale={locale}
              onNavigate={onClose}
            />
          </li>
        </ul>
      </nav>
    </div>
  );
}

function MenuIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      aria-hidden
    >
      <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      aria-hidden
    >
      <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function LocaleToggle({
  pathname,
  locale,
  onNavigate,
}: {
  pathname: string;
  locale: string;
  onNavigate?: () => void;
}) {
  return (
    <span className="text-meta-label inline-flex items-center gap-1">
      <Link
        href={pathname}
        locale="en"
        onClick={onNavigate}
        className={cn(
          "transition-colors hover:text-cream",
          locale === "en" ? "text-cream" : "text-cream-faint"
        )}
      >
        EN
      </Link>
      <span className="text-cream-faint">/</span>
      <Link
        href={pathname}
        locale="ru"
        onClick={onNavigate}
        className={cn(
          "transition-colors hover:text-cream",
          locale === "ru" ? "text-cream" : "text-cream-faint"
        )}
      >
        RU
      </Link>
    </span>
  );
}

type HeaderLink =
  | { kind: "route"; href: AppHref; label: string }
  | { kind: "hash"; hash: string; label: string };

function navLinkClass(active: boolean) {
  return cn(
    "text-meta-label relative transition-colors hover:text-cream-bright",
    active ? "text-cream" : "text-cream-dim",
  );
}

function NavItem({
  link,
  pathname,
}: {
  link: HeaderLink;
  pathname: string;
}) {
  if (link.kind === "hash") {
    return (
      <HashLink hash={link.hash} className={navLinkClass(false)}>
        {link.label}
      </HashLink>
    );
  }

  const active =
    pathname === link.href || (link.href === "/" && pathname === "/");

  return (
    <Link
      href={link.href}
      prefetch={false}
      className={navLinkClass(active)}
    >
      {link.label}
      {active && (
        <span className="absolute -bottom-1 left-0 h-px w-full bg-cream" />
      )}
    </Link>
  );
}

function MobileNavItem({
  link,
  onClose,
}: {
  link: HeaderLink;
  onClose: () => void;
}) {
  if (link.kind === "hash") {
    return (
      <HashLink
        hash={link.hash}
        className="text-meta-label block py-1 text-cream"
        onClick={onClose}
      >
        {link.label}
      </HashLink>
    );
  }

  return (
    <Link
      href={link.href}
      prefetch={false}
      className="text-meta-label block py-1 text-cream"
      onClick={onClose}
    >
      {link.label}
    </Link>
  );
}
