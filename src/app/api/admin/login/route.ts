import { NextResponse } from "next/server";
import {
  COOKIE_NAME,
  SESSION_MAX_AGE_SEC,
  createSessionToken,
  getAdminCredentials,
} from "@/lib/admin-session";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";
  const creds = getAdminCredentials();

  console.log("[Admin API] login attempt", { email });

  if (email !== creds.email.toLowerCase() || password !== creds.password) {
    console.log("[Admin API] login failed", { email });
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  const token = await createSessionToken(email);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SEC,
  });

  console.log("[Admin API] login success", { email });
  return res;
}
