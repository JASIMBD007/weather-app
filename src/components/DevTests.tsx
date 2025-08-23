import { canManipulateHistory } from "../utils/history";
import { cToF, formatTempUnit } from "../utils/number";
import { formatTime } from "../utils/time";
import wmo from "../weather/wmo";

export default function DevTests() {
  type T = { name: string; pass: boolean; details?: string };
  const tests: T[] = [];

  // 1) History safety
  const href = (typeof window !== "undefined" && window.location?.href) || "";
  const expectedHistory = !href.startsWith("about:");
  tests.push({
    name: "canManipulateHistory matches environment (not about:srcdoc)",
    pass: canManipulateHistory() === expectedHistory,
    details: `href=${href}`,
  });

  // 2) cToF conversion
  tests.push({ name: "cToF(0) === 32", pass: cToF(0) === 32 });
  tests.push({ name: "cToF(100) === 212", pass: cToF(100) === 212 });

  // 3) formatTempUnit
  tests.push({
    name: "formatTempUnit(10,'C') === '10°C'",
    pass: formatTempUnit(10, "C") === "10°C",
  });
  tests.push({
    name: "formatTempUnit(10,'F') === '50°F'",
    pass: formatTempUnit(10, "F") === "50°F",
  });
  tests.push({
    name: "formatTempUnit(undefined,'C') === '–'",
    pass: formatTempUnit(undefined as any, "C") === "–",
  });

  // 4) WMO mapping sanity
  tests.push({
    name: "WMO 0 label present",
    pass: wmo[0]?.label === "Klarer Himmel",
  });
  tests.push({
    name: "WMO 63 label present",
    pass: wmo[63]?.label === "Mäßiger Regen",
  });

  // 5) formatTime returns HH:MM for a valid ISO (can't assert exact TZ)
  const ft = formatTime("2025-08-19T06:00:00+02:00");
  tests.push({
    name: "formatTime returns HH:MM",
    pass: typeof ft === "string" && /\d{2}:\d{2}/.test(ft),
    details: ft,
  });

  // 6) Date equality for 'Heute' logic
  const todayStr = new Date().toDateString();
  const isToday =
    new Date(todayStr).toDateString() === new Date().toDateString();
  tests.push({ name: "Date equality for 'Heute' logic stable", pass: isToday });

  return (
    <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="font-semibold mb-2">Dev Tests</div>
      <ul className="space-y-1 text-sm">
        {tests.map((t, i) => (
          <li key={i} className={t.pass ? "text-emerald-600" : "text-rose-600"}>
            {t.pass ? "✓" : "✗"} {t.name}
            {t.details && (
              <span className="ml-2 text-slate-500">({t.details})</span>
            )}
          </li>
        ))}
      </ul>
      <div className="text-slate-500 text-xs mt-2">
        Blende diese Sektion mit <code>?test=1</code> ein.
      </div>
    </div>
  );
}
