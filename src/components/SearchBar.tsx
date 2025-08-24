import React, { useEffect, useRef, useState } from "react";
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
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (activeIndex >= suggestions.length) setActiveIndex(0);
  }, [suggestions, activeIndex]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!suggestions.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      if (open && suggestions[activeIndex]) {
        e.preventDefault();
        onPick(suggestions[activeIndex]);
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  return (
    <form onSubmit={onSubmit} className="relative ml-auto flex-1 max-w-xl" role="search" aria-label="Place search">
      <div className="flex items-center gap-2 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 px-3 py-2">
        <Search className="w-4 h-4 text-slate-500" aria-hidden="true" />
        <input
          ref={inputRef}
          aria-label="Search place"
          aria-autocomplete="list"
          aria-expanded={open && suggestions.length > 0}
          aria-controls="place-suggestions"
          value={query}
          onChange={(e) => {
            onQueryChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => suggestions.length && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 100)} // allow click
          onKeyDown={handleKeyDown}
          placeholder='Search any place (e.g., "Lisbon", "Bali", "New York")'
          className="w-full outline-none bg-transparent placeholder:text-slate-400"
          autoComplete="off"
          enterKeyHint="search"
          type="search"
        />
        <button
          type="button"
          onClick={onGeolocate}
          title="Use my location"
          className="p-1.5 rounded-xl hover:bg-slate-100 transition"
          aria-label="Use my location"
        >
          <Locate className="w-5 h-5" aria-hidden="true" />
        </button>
        <button
          type="submit"
          className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          Search
        </button>
      </div>

      <AnimatePresence>
        {open && suggestions.length > 0 && (
          <motion.div
            id="place-suggestions"
            role="listbox"
            aria-label="Place suggestions"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            ref={listRef}
            className="absolute mt-2 w-full rounded-xl bg-white shadow-lg ring-1 ring-slate-200 overflow-hidden z-20"
          >
            {suggestions.map((s, i) => {
              const selected = i === activeIndex;
              return (
                <button
                  key={`${s.id}-${i}`}
                  role="option"
                  aria-selected={selected}
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseDown={(e) => e.preventDefault()} // keep focus until click handled
                  onClick={() => {
                    onPick(s);
                    setOpen(false);
                  }}
                  type="button"
                  className={[
                    "w-full text-left px-3 py-2 flex items-center gap-2 transition",
                    selected ? "bg-slate-50" : "hover:bg-slate-50",
                  ].join(" ")}
                >
                  <MapPin className="w-4 h-4 text-rose-500" aria-hidden="true" />
                  <span className="font-medium">{s.name}</span>
                  <span className="text-slate-500 text-sm">{[s.admin1, s.country].filter(Boolean).join(", ")}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
