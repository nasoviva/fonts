/** Внешние URL — без серверного optimizer Next (избегаем 500 на Wikimedia и т.п.). */
export function isExternalImageSrc(src: string): boolean {
  return src.startsWith("http://") || src.startsWith("https://");
}
