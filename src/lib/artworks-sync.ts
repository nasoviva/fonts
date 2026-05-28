/** Ключ в localStorage — синхронизация между вкладками (админка ↔ галерея). */
export const ARTWORKS_SYNC_STORAGE_KEY = "artworks-updated-at";

export const ARTWORKS_UPDATED_EVENT = "artworks-updated";

/** Вызвать после сохранения/удаления/скрытия в админке — галерея перезагрузит список. */
export function notifyArtworksUpdated(): void {
  if (typeof window === "undefined") return;
  const at = String(Date.now());
  localStorage.setItem(ARTWORKS_SYNC_STORAGE_KEY, at);
  window.dispatchEvent(new CustomEvent(ARTWORKS_UPDATED_EVENT, { detail: { at } }));
  console.log("[Artworks] notifyArtworksUpdated", { at });
}

export function subscribeArtworksUpdated(onUpdate: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const onEvent = () => {
    console.log("[Artworks] sync event received");
    onUpdate();
  };

  const onStorage = (e: StorageEvent) => {
    if (e.key === ARTWORKS_SYNC_STORAGE_KEY) onUpdate();
  };

  window.addEventListener(ARTWORKS_UPDATED_EVENT, onEvent);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(ARTWORKS_UPDATED_EVENT, onEvent);
    window.removeEventListener("storage", onStorage);
  };
}
