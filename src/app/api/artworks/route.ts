import { getVisibleArtworks } from "@/lib/artwork-store";
import { jsonNoStore } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET() {
  const artworks = await getVisibleArtworks();
  console.log("[API /artworks] GET", { count: artworks.length });
  return jsonNoStore(artworks);
}
