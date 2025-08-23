export function formatTime(iso?: string, locale = "en-GB") {
  if (!iso) return "–";
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" }).format(d);
  } catch {
    return "–";
  }
}
