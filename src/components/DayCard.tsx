import { Sun } from "lucide-react";
import wmo from "../weather/wmo";
import { cToF } from "../utils/number";

type Props = {
  date: Date;
  code: number;
  tmax: number;
  tmin: number;
  precip: number;
  unit: "C" | "F";
};

function dayKey(d: Date, tz = "Europe/Berlin") {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export default function DayCard({ date, code, tmax, tmin, precip, unit }: Props) {
  const tz = "Europe/Berlin";
  const Icon = wmo[code]?.Icon || Sun;

  const isToday = dayKey(new Date(), tz) === dayKey(date, tz);

  const label = isToday
    ? "Today"
    : new Intl.DateTimeFormat("en-GB", {
        timeZone: tz,
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
      }).format(date);

  const gradient = isToday
    ? "from-indigo-200 to-sky-200" // darker for today
    : "from-indigo-50 to-sky-50"; // normal
  const ring = isToday ? "ring-2 ring-indigo-400 shadow-md" : "ring-1 ring-slate-200";

  return (
    <div
      className={["rounded-2xl p-3 transition bg-gradient-to-br", gradient, ring].join(" ")}
      aria-current={isToday ? "date" : undefined}
    >
      <div className="flex items-center justify-between">
        <div className={isToday ? "text-sm text-slate-700" : "text-sm text-slate-500"}>{label}</div>
        <Icon className="w-5 h-5 text-indigo-600" />
      </div>

      <div className="mt-2 flex items-end gap-2">
        <div className="text-lg font-semibold">{unit === "C" ? Math.round(tmax) : Math.round(cToF(tmax))}°</div>
        <div className="text-slate-600 text-sm">/{unit === "C" ? Math.round(tmin) : Math.round(cToF(tmin))}°</div>
      </div>

      <div className="text-slate-600 text-sm mt-1">{wmo[code]?.short ?? ""}</div>
      <div className="text-slate-600 text-sm mt-1">{precip?.toFixed(1)} mm</div>
    </div>
  );
}
