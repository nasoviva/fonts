import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  deleteArtwork,
  getArtworkById,
  setArtworkFeaturedOnHome,
  setArtworkHidden,
  updateArtwork,
  type ArtworkInput,
} from "@/lib/artwork-store";
import { revalidateArtworkPages } from "@/lib/revalidate-artworks";
import { COOKIE_NAME, verifySessionToken } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return (await verifySessionToken(token)) !== null;
}

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  let body: Partial<ArtworkInput> & {
    hidden?: boolean;
    featuredOnHome?: boolean;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  try {
    if (body.hidden !== undefined && Object.keys(body).length === 1) {
      const artwork = await setArtworkHidden(id, body.hidden);
      revalidateArtworkPages();
      return NextResponse.json(artwork);
    }

    if (
      body.featuredOnHome !== undefined &&
      Object.keys(body).length === 1
    ) {
      const artwork = await setArtworkFeaturedOnHome(id, body.featuredOnHome);
      revalidateArtworkPages();
      return NextResponse.json(artwork);
    }

    const existing = await getArtworkById(id);
    if (!existing) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const artwork = await updateArtwork(id, body);
    revalidateArtworkPages();
    return NextResponse.json(artwork);
  } catch (e) {
    const message = e instanceof Error ? e.message : "save_failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    await deleteArtwork(id);
    revalidateArtworkPages();
    console.log("[API admin/artworks] DELETE ok", { id });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "delete_failed";
    if (message === "not_found") {
      return NextResponse.json({ error: message }, { status: 404 });
    }
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
