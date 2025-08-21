import React from "react";
import type { SelectedPlace } from "../types";



function WeatherChip({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
return (
<button onClick={onClick} className="px-3 py-1 rounded-full bg-white shadow ring-1 ring-slate-200 hover:bg-slate-50">
{children}
</button>
);
}


export default function RecentChips({ recents, onPick }: { recents: SelectedPlace[]; onPick: (r: SelectedPlace) => void }) {
if (!recents.length) return null;
return (
<div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
<span className="text-slate-500">Zuletzt gesucht:</span>
{recents.map((r) => (
<WeatherChip key={`${r.name}-${r.latitude}`} onClick={() => onPick(r)}>
{r.displayName || r.name}
</WeatherChip>
))}
</div>
);
}