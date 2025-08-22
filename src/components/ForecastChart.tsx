import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cToF } from "../utils/number";

export default function ForecastChart({
  data,
  unit,
}: {
  data: Array<{ label: string; tmaxC: number; tminC: number }>;
  unit: "C" | "F";
}) {
  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="tmax" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="tmin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis
            width={40}
            tickFormatter={(v) =>
              unit === "C" ? `${Math.round(v)}°` : `${Math.round(cToF(v))}°`
            }
          />
          <Tooltip
            formatter={(value: any, name: string) => {
              if (name === "tmaxC" || name === "tminC") {
                const c = Number(value);
                return unit === "C"
                  ? `${Math.round(c)}°C`
                  : `${Math.round(cToF(c))}°F`;
              }
              return value;
            }}
            labelFormatter={(label: string) => label}
          />
          <Area
            type="monotone"
            dataKey="tmaxC"
            name="max"
            stroke="#4f46e5"
            fill="url(#tmax)"
          />
          <Area
            type="monotone"
            dataKey="tminC"
            name="min"
            stroke="#06b6d4"
            fill="url(#tmin)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
