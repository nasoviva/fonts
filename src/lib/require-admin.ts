import { cookies } from "next/headers";
import { COOKIE_NAME, verifySessionToken } from "@/lib/admin-session";

export async function requireAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);
  if (!session) return null;
  return session;
}
