"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Artwork } from "@/data/artworks";
import { subscribeArtworksUpdated } from "@/lib/artworks-sync";

type UseArtworksOptions = {
  admin?: boolean;
  /** Данные с сервера — без пустого экрана до первого fetch. */
  initialArtworks?: Artwork[];
};

export function useArtworksData({
  admin = false,
  initialArtworks,
}: UseArtworksOptions = {}) {
  const [artworks, setArtworks] = useState<Artwork[] | null>(
    initialArtworks ?? null,
  );
  const [loading, setLoading] = useState(initialArtworks === undefined);
  const [error, setError] = useState<string | null>(null);
  const revisionRef = useRef(0);

  const load = useCallback(async () => {
    const revision = ++revisionRef.current;
    setLoading(true);
    setError(null);
    try {
      const url = admin ? "/api/admin/artworks" : "/api/artworks";
      const res = await fetch(`${url}?_=${Date.now()}`, { cache: "no-store" });
      if (!res.ok) throw new Error("load_failed");
      const json = (await res.json()) as Artwork[];
      if (revision !== revisionRef.current) return;
      setArtworks(json);
      console.log("[useArtworksData] loaded", { admin, count: json.length });
    } catch {
      if (revision !== revisionRef.current) return;
      setError("load_failed");
      setArtworks([]);
    } finally {
      if (revision === revisionRef.current) setLoading(false);
    }
  }, [admin]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    return subscribeArtworksUpdated(() => {
      console.log("[useArtworksData] admin changed, reload");
      load();
    });
  }, [load]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        console.log("[useArtworksData] tab visible, reload");
        load();
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [load]);

  return { artworks, loading, error, reload: load, setArtworks };
}
