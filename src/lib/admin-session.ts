const COOKIE_NAME = "admin_session";
const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 days

export { COOKIE_NAME, SESSION_MAX_AGE_SEC };

type SessionPayload = {
  email: string;
  exp: number;
};

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (secret && secret.length >= 16) return secret;
  if (process.env.NODE_ENV === "development") {
    return "dev-admin-session-secret-min-16";
  }
  throw new Error("ADMIN_SESSION_SECRET must be set (min 16 characters)");
}

async function hmacSign(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Buffer.from(sig).toString("base64url");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSessionToken(email: string): Promise<string> {
  const payload: SessionPayload = {
    email,
    exp: Date.now() + SESSION_MAX_AGE_SEC * 1000,
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = await hmacSign(payloadB64, getSecret());
  return `${payloadB64}.${sig}`;
}

export async function verifySessionToken(
  token: string | undefined,
): Promise<SessionPayload | null> {
  if (!token) return null;

  const dot = token.lastIndexOf(".");
  if (dot === -1) return null;

  const payloadB64 = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  try {
    const expected = await hmacSign(payloadB64, getSecret());
    if (!timingSafeEqual(sig, expected)) return null;

    const payload = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf8"),
    ) as SessionPayload;

    if (!payload.email || typeof payload.exp !== "number") return null;
    if (payload.exp < Date.now()) return null;

    return payload;
  } catch {
    return null;
  }
}

export function getAdminCredentials(): { email: string; password: string } {
  const email = process.env.ADMIN_EMAIL ?? "admin@artistproducer.com";
  const password = process.env.ADMIN_PASSWORD ?? "change-me";
  return { email, password };
}
