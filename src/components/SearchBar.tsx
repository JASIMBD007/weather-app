import React, { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Locate, MapPin, Search } from "lucide-react";
import type { GeoResult } from "../types";

export default function SearchBar({
  query,
  suggestions,
  onQueryChange,
  onSubmit,
  onPick,
  onGeolocate,
}: {
  query: string;
  suggestions: GeoResult[];
  onQueryChange: (q: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onPick: (g: GeoResult) => void;
  onGeolocate: () => void;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  return (
    <form onSubmit={onSubmit} className="relative ml-auto flex-1 max-w-xl">
      <div className="flex items-center gap-2 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 px-3 py-2">
        <Search className="w-4 h-4 text-slate-500" />
        <input
          aria-label="Ort suchen"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Ort in Deutschland eingeben (z.B. Sylt, Kiel, München)"
          className="w-full outline-none bg-transparent placeholder:text-slate-400"
        />
        <button
          type="button"
          onClick={onGeolocate}
          title="Meinen Standort verwenden"
          className="p-1.5 rounded-xl hover:bg-slate-100 transition"
        >
          <Locate className="w-5 h-5" />
        </button>
        <button
          type="submit"
          className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          Suchen
        </button>
      </div>
      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            ref={listRef}
            className="absolute mt-2 w-full rounded-xl bg-white shadow-lg ring-1 ring-slate-200 overflow-hidden"
          >
            {suggestions.map((s) => (
              <button
                key={s.id}
                onClick={() => onPick(s)}
                type="button"
                className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2"
              >
                <MapPin className="w-4 h-4 text-rose-500" />
                <span className="font-medium">{s.name}</span>
                <span className="text-slate-500 text-sm">
                  {[s.admin1, s.country].filter(Boolean).join(", ")}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
