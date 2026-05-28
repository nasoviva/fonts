import type { ComponentProps } from "react";
import { Link } from "./navigation";

/** Тип ссылок для next-intl (с учётом локали и hash). */
export type AppHref = ComponentProps<typeof Link>["href"];

export const paths = {
  home: "/" as const,
  gallery: "/gallery" as const,
  artists: "/artists" as const,
  collectors: "/collectors" as const,
  contact: { pathname: "/" as const, hash: "contact" },
} satisfies Record<string, AppHref>;
