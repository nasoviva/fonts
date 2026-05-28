import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { readArtworks } from "@/lib/artwork-store";
import { COOKIE_NAME, verifySessionToken } from "@/lib/admin-session";
import { readTaxonomy, writeTaxonomy } from "@/lib/taxonomy-store";
import type { TaxonomyData } from "@/lib/taxonomy-types";

async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return (await verifySessionToken(token)) !== null;
}

async function findUsage(data: TaxonomyData): Promise<string | null> {
  const categoryIds = new Set(data.categories.map((c) => c.id));
  const authorIds = new Set(data.authors.map((a) => a.id));
  const artworks = await readArtworks();

  for (const artwork of artworks) {
    if (!categoryIds.has(artwork.categoryId)) {
      return `category "${artwork.categoryId}" is used by artwork "${artwork.slug}"`;
    }
    if (!authorIds.has(artwork.authorId)) {
      return `author "${artwork.authorId}" is used by artwork "${artwork.slug}"`;
    }
  }
  return null;
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const taxonomy = await readTaxonomy();
  return NextResponse.json(taxonomy);
}

export async function PUT(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: TaxonomyData;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const usageError = await findUsage(body);
  if (usageError) {
    return NextResponse.json({ error: "in_use", message: usageError }, { status: 409 });
  }

  try {
    await writeTaxonomy(body);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const raw = e instanceof Error ? e.message : "validation_failed";
    try {
      const details = JSON.parse(raw);
      return NextResponse.json(
        { error: "validation_failed", details },
        { status: 400 },
      );
    } catch {
      return NextResponse.json({ error: raw }, { status: 400 });
    }
  }
}
