import { Sun } from "lucide-react";
import wmo from "../weather/wmo";
import { cToF } from "../utils/number";

export default function DayCard({
  date,
  code,
  tmax,
  tmin,
  precip,
  unit,
}: {
  date: Date;
  code: number;
  tmax: number;
  tmin: number;
  precip: number;
  unit: "C" | "F";
}) {
  const Icon = wmo[code]?.Icon || Sun;
  const isToday = new Date().toDateString() === date.toDateString();
  const de = new Intl.DateTimeFormat("de-DE", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });
  return (
    <div
      className={[
        "rounded-2xl ring-1 ring-slate-200 p-3 bg-white shadow-sm",
        isToday ? "ring-2 ring-indigo-400" : "",
      ].join(" ")}
    >
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">
          {isToday ? "Heute" : de.format(date)}
        </div>
        <Icon className="w-5 h-5 text-indigo-600" />
      </div>
      <div className="mt-2 flex items-end gap-2">
        <div className="text-lg font-semibold">
          {unit === "C" ? Math.round(tmax) : Math.round(cToF(tmax))}°
        </div>
        <div className="text-slate-500 text-sm">
          /{unit === "C" ? Math.round(tmin) : Math.round(cToF(tmin))}°
        </div>
      </div>
      <div className="text-slate-500 text-sm mt-1">
        {wmo[code]?.short ?? ""}
      </div>
      <div className="text-slate-500 text-sm mt-1">{precip?.toFixed(1)} mm</div>
    </div>
  );
}
