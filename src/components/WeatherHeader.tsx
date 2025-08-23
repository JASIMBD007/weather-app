import React from "react";
import { RefreshCw, Sun, Calendar as CalendarIcon, MapPin } from "lucide-react";

import { enLongFmt } from "../utils/date";
import type { GeoResult } from "../types";
import SearchBar from "./SearchBar";
import UnitToggle from "./UnitToggle";

export default function WeatherHeader({
  query,
  suggestions,
  onQueryChange,
  onSubmit,
  onPick,
  onGeolocate,
  unit,
  onUnitChange,
  onRefresh,
  selectedDisplay,
}: {
  query: string;
  suggestions: GeoResult[];
  onQueryChange: (q: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onPick: (g: GeoResult) => void;
  onGeolocate: () => void;
  unit: "C" | "F";
  onUnitChange: (u: "C" | "F") => void;
  onRefresh: () => void;
  selectedDisplay?: string | null;
}) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
        <div className="flex items-center gap-2 font-semibold text-xl">
          <Sun className="w-6 h-6 text-amber-500" />
          <span>Weather Surfer</span>
        </div>

        <SearchBar
          query={query}
          suggestions={suggestions}
          onQueryChange={onQueryChange}
          onSubmit={onSubmit}
          onPick={onPick}
          onGeolocate={onGeolocate}
        />

        <div className="flex items-center gap-2 ml-3">
          <UnitToggle unit={unit} setUnit={onUnitChange} />
          <button
            onClick={onRefresh}
            className="p-2 rounded-xl hover:bg-slate-100"
            title="Refresh"
            aria-label="Refresh forecast"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {selectedDisplay && (
        <div className="max-w-6xl mx-auto px-4 pb-2 flex items-center justify-between text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-500" />
            {selectedDisplay}
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            {enLongFmt.format(new Date())}
          </div>
        </div>
      )}
    </header>
  );
}
