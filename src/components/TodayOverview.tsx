import { Droplets, Moon, Sun, Wind } from "lucide-react";
import InfoRow from "./InfoRow";
import wmo from "../weather/wmo";
import { formatTempUnit } from "../utils/number";
import { formatTime } from "../utils/time";

function uvCategory(uv: number) {
  if (uv >= 11) return "Extreme";
  if (uv >= 8) return "Very high";
  if (uv >= 6) return "High";
  if (uv >= 3) return "Moderate";
  return "Low";
}

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
    uv_index_max?: number[];
    uv_index_clear_sky_max?: number[];
  };
  unit: "C" | "F";
}) {
  const code = today.wcode ?? 0;
  const Icon = wmo[code]?.Icon || Sun;

  const uvRaw =
    daily.uv_index_max?.[0] ??
    daily.uv_index_clear_sky_max?.[0] ??
    null;

  const uvText =
    uvRaw == null ? "UV —" : `UV ${Math.round(uvRaw)} (${uvCategory(uvRaw)})`;

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
        {wmo[today.wcode]?.label || "Forecast"}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <InfoRow
          icon={<Droplets className="w-4 h-4" />}
          value={`${today.precip?.toFixed(1) ?? 0} mm`}
        />
        <InfoRow
          icon={<Wind className="w-4 h-4" />}
          value={`${daily.wind_speed_10m_max[0]?.toFixed(0) ?? 0} km/h`}
        />
        <InfoRow
          icon={<Sun className="w-4 h-4" />}
          value={formatTime(daily.sunrise[0])}
        />
        <InfoRow
          icon={<Moon className="w-4 h-4" />}
          value={formatTime(daily.sunset[0])}
        />
        <InfoRow
          icon={<Sun className="w-4 h-4" />}
          value={uvText}
        />
      </div>
    </div>
  );
}
