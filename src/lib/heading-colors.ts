/** Consistent heading colors per section tone */

/** H1/H2 на тёмном фоне — яркий акцент; на светлом — ink */
export function headingAccent(tone: "dark" | "light") {
  return tone === "light" ? "text-ink" : "text-cream-bright";
}

/** Подписи, script, body headings — базовый шампань */
export function headingPrimary(tone: "dark" | "light") {
  return tone === "light" ? "text-ink" : "text-on-dark";
}

export function headingMuted(tone: "dark" | "light") {
  return tone === "light" ? "text-ink-dim" : "text-on-dark-dim";
}
