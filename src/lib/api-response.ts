import { NextResponse } from "next/server";

/** JSON без кэширования — актуальные данные после изменений в админке. */
export function jsonNoStore<T>(data: T, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  return NextResponse.json(data, { ...init, headers });
}
