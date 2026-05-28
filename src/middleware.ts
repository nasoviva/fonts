import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { COOKIE_NAME, verifySessionToken } from "./lib/admin-session";

const intlMiddleware = createMiddleware(routing);

const ADMIN_PROTECTED =
  /^\/(en|ru)\/admin\/(dashboard|taxonomy|artwork(\/.*)?)$/;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Публичные страницы — только i18n, без проверки сессии (стабильнее RSC-навигация)
  if (!pathname.includes("/admin")) {
    return intlMiddleware(request);
  }

  const localeMatch = pathname.match(/^\/(en|ru)\/admin\/?$/);
  const isProtected = ADMIN_PROTECTED.test(pathname);

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);
  const isAuthenticated = session !== null;

  if (localeMatch && isAuthenticated) {
    const locale = localeMatch[1];
    return NextResponse.redirect(
      new URL(`/${locale}/admin/dashboard`, request.url),
    );
  }

  if (isProtected && !isAuthenticated) {
    const locale = pathname.match(/^\/(en|ru)/)?.[1] ?? routing.defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}/admin`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/",
    "/(en|ru)/:path*",
    // Без префикса локали (/gallery) — перенаправить через next-intl
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
