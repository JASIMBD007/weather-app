import React from "react";
import { Sun as SunIcon } from "lucide-react";
import wmo from "../weather/wmo";
import { formatTempUnit } from "../utils/number";

export type HourlyTileItem = {
  time: Date;
  tempC: number;
  precip: number;
  wind: number;
  code: number;
};

export default function HourlyTiles({
  items,
  unit,
  // if you ever want horizontal scroll on phones, set responsive to true
  responsive = false,
}: {
  items: HourlyTileItem[];
  unit: "C" | "F";
  responsive?: boolean;
}) {
  if (!items?.length) return null;

  // grid that wraps (default) — no scrollbar
  // if responsive=true: scroll on small screens, wrap from md+
  const containerClass = responsive
    ? "flex gap-2 overflow-x-auto pb-1 md:grid md:overflow-visible md:pb-0 md:gap-3 md:grid-cols-[repeat(auto-fit,minmax(120px,1fr))]"
    : "grid gap-2 grid-cols-[repeat(auto-fit,minmax(120px,1fr))]";

  return (
    <div className="rounded-2xl bg-white/70 ring-1 ring-slate-200 p-3">
      <div className="font-medium mb-2">Stundenüberblick (heute)</div>

      <div className={containerClass}>
        {items.map((h, idx) => {
          const Icon = wmo[h.code]?.Icon || SunIcon;
          const t = h.time.toLocaleTimeString("de-DE", { hour: "2-digit" });
          return (
            <div
              key={idx}
              className="rounded-xl ring-1 ring-slate-200 bg-white px-2 py-2 text-center"
            >
              <div className="text-xs text-slate-500">{t}</div>
              <Icon className="w-5 h-5 text-indigo-600 mx-auto mt-0.5" />
              <div className="text-sm font-semibold mt-0.5">
                {formatTempUnit(h.tempC, unit)}
              </div>
              <div className="text-[11px] text-slate-500">
                {Math.round(h.wind)} km/h · {h.precip.toFixed(1)} mm
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
