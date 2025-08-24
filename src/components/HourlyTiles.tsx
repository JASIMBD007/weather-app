import React from "react";
import { Sun as SunIcon, Moon as MoonIcon } from "lucide-react";
import wmo from "../weather/wmo";
import { formatTempUnit } from "../utils/number";

export type HourlyTileItem = {
  time: Date;
  tempC: number;
  precip: number;
  wind: number;
  code: number;
  isDay?: boolean;
};

function resolveIcon(code: number, isDay?: boolean) {
  if (isDay === false && (code === 0 || code === 1 || code === 2)) return MoonIcon;
  return wmo[code]?.Icon || (isDay === false ? MoonIcon : SunIcon);
}

function isSameHour(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate() &&
    a.getHours() === b.getHours()
  );
}

export default function HourlyTiles({
  items,
  unit,
  responsive = false,
}: {
  items: HourlyTileItem[];
  unit: "C" | "F";
  responsive?: boolean;
}) {
  if (!items?.length) return null;

  const containerClass = responsive
    ? "flex gap-2 overflow-x-auto pb-1 md:grid md:overflow-visible md:pb-0 md:gap-3 md:grid-cols-[repeat(auto-fit,minmax(120px,1fr))]"
    : "grid gap-2 grid-cols-[repeat(auto-fit,minmax(120px,1fr))]";

  const now = new Date();

  return (
    <div className="rounded-2xl bg-white/70 ring-1 ring-slate-200 p-3">
      <div className="font-medium mb-2">Hourly overview (today)</div>

      <div className={containerClass}>
        {items.map((h, idx) => {
          const Icon = resolveIcon(h.code, h.isDay);
          const t = h.time.toLocaleTimeString("en-GB", { hour: "2-digit" });
          const currentHour = isSameHour(h.time, now);

          const gradient = currentHour
            ? h.isDay === false
              ? "from-slate-100 to-indigo-100"
              : "from-indigo-100 to-sky-100"
            : h.isDay === false
            ? "from-slate-50 to-indigo-50/30"
            : "from-indigo-50 to-sky-50";

          const ring = currentHour ? "ring-2 ring-indigo-300 shadow-md" : "ring-1 ring-slate-200";

          return (
            <div
              key={idx}
              className={[
                "rounded-2xl px-2 py-2 text-center hover:shadow-sm transition",
                "bg-gradient-to-br",
                gradient,
                ring,
              ].join(" ")}
              aria-current={currentHour ? "time" : undefined}
              title={h.time.toLocaleString()}
            >
              <div className={currentHour ? "text-xs text-slate-700" : "text-xs text-slate-500"}>{t}</div>
              <Icon className="w-5 h-5 text-indigo-600 mx-auto mt-0.5" />
              <div className="text-sm font-semibold mt-0.5">{formatTempUnit(h.tempC, unit)}</div>
              <div className={currentHour ? "text-[11px] text-slate-600" : "text-[11px] text-slate-500"}>
                {Math.round(h.wind)} km/h · {h.precip.toFixed(1)} mm
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
