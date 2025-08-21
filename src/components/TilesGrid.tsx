import React from "react";

import DayCard from "./DayCard";
import type { DailyForecastResponse } from "../types";


export default function TilesGrid({ daily, unit }: { daily: DailyForecastResponse["daily"]; unit: "C" | "F" }) {
return (
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3">
{daily.time.map((t, i) => (
<div key={t} className="[animation-duration:400ms] animate-in fade-in slide-in-from-bottom-1">
<DayCard
date={new Date(t)}
code={daily.weathercode[i]}
tmax={daily.temperature_2m_max[i]}
tmin={daily.temperature_2m_min[i]}
precip={daily.precipitation_sum[i]}
unit={unit}
/>
</div>
))}
</div>
);
}