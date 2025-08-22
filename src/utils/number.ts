export function cToF(c: number) {
  return (c * 9) / 5 + 32;
}
export function formatTempUnit(c: number | undefined, unit: "C" | "F") {
  if (c == null) return "–";
  return unit === "C" ? `${Math.round(c)}°C` : `${Math.round(cToF(c))}°F`;
}
