import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  createArtwork,
  readArtworks,
  type ArtworkInput,
} from "@/lib/artwork-store";
import { jsonNoStore } from "@/lib/api-response";
import { revalidateArtworkPages } from "@/lib/revalidate-artworks";
import { COOKIE_NAME, verifySessionToken } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return (await verifySessionToken(token)) !== null;
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const artworks = await readArtworks();
  return jsonNoStore(artworks);
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: ArtworkInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  try {
    const artwork = await createArtwork(body);
    revalidateArtworkPages();
    return NextResponse.json(artwork, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "save_failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
