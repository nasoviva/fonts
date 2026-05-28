import { NextResponse } from "next/server";
import { readTaxonomy } from "@/lib/taxonomy-store";

export async function GET() {
  const taxonomy = await readTaxonomy();
  return NextResponse.json(taxonomy);
}
