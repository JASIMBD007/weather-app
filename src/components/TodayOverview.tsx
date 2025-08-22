import { Droplets, Moon, Sun, Wind } from "lucide-react";
import InfoRow from "./InfoRow";

import wmo from "../weather/wmo";
import { formatTempUnit } from "../utils/number";
import { formatTime } from "../utils/time";

export default function TodayOverview({
  today,
  daily,
  unit,
}: {
  today: { tmaxC: number; tminC: number; wcode: number; precip: number };
  daily: {
    sunrise: string[];
    sunset: string[];
    wind_speed_10m_max: number[];
  };
  unit: "C" | "F";
}) {
  const code = today.wcode ?? 0;
  const Icon = wmo[code]?.Icon || Sun;
  return (
    <div className="flex flex-col justify-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-sky-50">
      <div className="flex items-center gap-3">
        <Icon className="w-10 h-10 text-indigo-600" />
        <div>
          <div className="text-2xl font-bold">
            {formatTempUnit(today.tmaxC, unit)}
          </div>
          <div className="text-slate-500">max</div>
        </div>
        <div>
          <div className="text-2xl font-bold">
            {formatTempUnit(today.tminC, unit)}
          </div>
          <div className="text-slate-500">min</div>
        </div>
      </div>
      <div className="text-slate-600">
        {wmo[today.wcode]?.label || "Vorhersage"}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <InfoRow
          icon={<Droplets className="w-4 h-4" />}
          label="Niederschlag"
          value={`${today.precip?.toFixed(1) ?? 0} mm`}
        />
        <InfoRow
          icon={<Wind className="w-4 h-4" />}
          label="Wind (max)"
          value={`${daily.wind_speed_10m_max[0]?.toFixed(0) ?? 0} km/h`}
        />
        <InfoRow
          icon={<Sun className="w-4 h-4" />}
          label="Sonnenaufgang"
          value={formatTime(daily.sunrise[0])}
        />
        <InfoRow
          icon={<Moon className="w-4 h-4" />}
          label="Sonnenuntergang"
          value={formatTime(daily.sunset[0])}
        />
      </div>
    </div>
  );
}
