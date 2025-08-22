export function formatTime(iso: string | undefined) {
  if (!iso) return "–";
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return "–";
  }
}
