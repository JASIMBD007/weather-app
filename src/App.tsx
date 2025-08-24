import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import WeatherHeader from "./components/WeatherHeader";
import RecentChips from "./components/RecentChips";
import TodayOverview from "./components/TodayOverview";
import ForecastChart from "./components/ForecastChart";
import TilesGrid from "./components/TilesGrid";
import Skeleton from "./components/Skeleton";
import EmptyState from "./components/EmptyState";
import DevTests from "./components/DevTests";
import HourlyTiles from "./components/HourlyTiles";
import useDebounced from "./hooks/useDebounced";
import { enShortFmt } from "./utils/date";
import { safeReplaceState } from "./utils/history";
import { RECENTS_KEY } from "./constants";
import {
  fetchDailyForecast,
  fetchHourlyForecast,
  reverseGeocodeDE,
  searchGermanyCities,
  toSelectedPlace,
} from "./services/openMeteo";
import type { DailyForecastResponse, GeoResult, HourlyForecast, SelectedPlace } from "./types";

const DEFAULT_PLACE: SelectedPlace = {
  name: "Berlin",
  displayName: "Berlin",
  latitude: 52.52,
  longitude: 13.405,
};

export default function App() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounced(query, 300);
  const [suggestions, setSuggestions] = useState<GeoResult[]>([]);
  const [selected, setSelected] = useState<SelectedPlace | null>(null);
  const [daily, setDaily] = useState<DailyForecastResponse["daily"] | null>(null);
  const [hourly, setHourly] = useState<HourlyForecast | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<"C" | "F">("C");
  const [recents, setRecents] = useState<SelectedPlace[]>(() => {
    try {
      const raw = localStorage.getItem(RECENTS_KEY);
      return raw ? (JSON.parse(raw) as SelectedPlace[]) : [];
    } catch {
      return [];
    }
  });

  const year = new Date().getFullYear();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const q = debouncedQuery.trim();
      if (q.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const results = await searchGermanyCities(q);
        if (!cancelled) setSuggestions(results);
      } catch {
        if (!cancelled) setSuggestions([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("q");
      if (q) setQuery(q);
    } catch {
      /* noop */
    }
  }, []);

  const bootRef = useRef(false);
  const handlePick = useCallback(async (place: GeoResult | SelectedPlace) => {
    const sp = toSelectedPlace(place);

    // Select & reset UI state
    setSelected(sp);
    setQuery(sp.name);
    setSuggestions([]);
    setError(null);

    // Update URL
    try {
      const params = new URLSearchParams(window.location.search);
      params.set("q", sp.name);
      safeReplaceState(`${window.location.pathname}?${params.toString()}`);
    } catch {
      /* noop */
    }

    setRecents((prev) => {
      const next = [sp, ...prev.filter((r) => r.name !== sp.name)].slice(0, 6);
      try {
        localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
      } catch {
        /* noop */
      }
      return next;
    });

    // Fetch data
    setLoading(true);
    try {
      const [dailyData, hourlyData] = await Promise.all([
        fetchDailyForecast(sp.latitude, sp.longitude),
        fetchHourlyForecast(sp.latitude, sp.longitude),
      ]);
      setDaily(dailyData);
      setHourly(hourlyData);
    } catch (e: any) {
      setError(e?.message || "Unexpected error");
      setDaily(null);
      setHourly(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (bootRef.current) return;
    bootRef.current = true;

    (async () => {
      let q: string | null = null;
      try {
        const params = new URLSearchParams(window.location.search);
        q = params.get("q");
      } catch {
        /* noop */
      }

      if (q && q.trim().length >= 2) {
        try {
          const results = await searchGermanyCities(q.trim());
          if (results?.length) {
            await handlePick(results[0]);
            return;
          }
        } catch {
          /* fall through to default */
        }
      }
      await handlePick(DEFAULT_PLACE);
    })();
  }, [handlePick]);

  useEffect(() => {
    if (!selected) return;
    if (query !== selected.name) setQuery(selected.name);
    if (suggestions.length) setSuggestions([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (suggestions.length > 0) handlePick(suggestions[0]);
    },
    [handlePick, suggestions]
  );

  const handleRemoveRecent = useCallback((name: string) => {
    setRecents((prev) => {
      const next = prev.filter((r) => r.name !== name);
      try {
        localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
      } catch {
        /* noop */
      }
      return next;
    });
  }, []);

  const handleGeolocate = useCallback(() => {
    if (!navigator.geolocation) return;
    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const best = await reverseGeocodeDE(latitude, longitude);
          if (best) {
            await handlePick(best);
          } else {
            setError("Location is not in Germany. Please search for a German city.");
          }
        } catch (e: any) {
          setError("Geolocation failed.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setLoading(false);
        setError("Location access denied.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, [handlePick]);

  const refreshSelected = useCallback(() => {
    if (!selected) return;
    handlePick(selected);
  }, [handlePick, selected]);

  const chartData = useMemo(() => {
    if (!daily)
      return [] as Array<{ date: Date; label: string; tmaxC: number; tminC: number; wcode: number; precip: number }>;
    return daily.time.map((t, i) => ({
      date: new Date(t),
      label: enShortFmt.format(new Date(t)),
      tmaxC: daily.temperature_2m_max[i],
      tminC: daily.temperature_2m_min[i],
      wcode: daily.weathercode[i],
      precip: daily.precipitation_sum[i],
    }));
  }, [daily]);

  const today = chartData[0];

  const hourlyToday = useMemo(() => {
    if (!hourly)
      return [] as Array<{ time: Date; tempC: number; precip: number; wind: number; code: number; isDay?: boolean }>;

    const now = new Date();
    const floorNow = new Date(now);
    floorNow.setMinutes(0, 0, 0);

    const items = hourly.time.map((iso, i) => ({
      time: new Date(iso),
      tempC: hourly.temperature_2m[i],
      precip: hourly.precipitation[i],
      wind: hourly.wind_speed_10m[i],
      code: hourly.weathercode[i],
      isDay: hourly.is_day?.[i] === 1,
    }));

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const todayHours = items.filter((x) => x.time >= floorNow && x.time <= endOfDay);
    const take = todayHours.length ? todayHours : items.slice(0, 12);

    return take.slice(0, 16);
  }, [hourly]);

  const showTests = useMemo(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get("test") === "1";
    } catch {
      return false;
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 to-indigo-50 text-slate-800">
      <WeatherHeader
        query={query}
        suggestions={suggestions}
        onQueryChange={setQuery}
        onSubmit={handleSubmit}
        onPick={handlePick}
        onGeolocate={handleGeolocate}
        unit={unit}
        onUnitChange={setUnit}
        onRefresh={refreshSelected}
        selectedDisplay={selected ? selected.displayName || selected.name : null}
      />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6">
        <RecentChips recents={recents} onPick={handlePick} onDelete={handleRemoveRecent} />

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
          <div className="lg:col-span-2">
            <div className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 p-5 h-full">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold">Today's overview</h2>
              </div>

              {loading && <Skeleton height={260} />}

              {!loading && daily && today && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <TodayOverview
                    today={{ tmaxC: today.tmaxC, tminC: today.tminC, wcode: today.wcode, precip: today.precip }}
                    daily={daily}
                    unit={unit}
                  />

                  <div className="md:col-span-2 p-2">
                    <h3 className="font-medium mb-2">10-day forecast (°{unit})</h3>
                    <ForecastChart data={chartData} unit={unit} />
                  </div>

                  <div className="md:col-span-3">
                    <HourlyTiles items={hourlyToday} unit={unit} />
                  </div>
                </div>
              )}

              {!loading && !daily && <EmptyState />}

              {error && <div className="mt-4 text-rose-600 text-sm">{error}</div>}
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-slate-50 to-indigo-50/20 shadow-sm ring-1 ring-slate-200 p-5">
            <h3 className="text-lg font-semibold mb-3">Daily Overview</h3>
            {loading && <Skeleton height={400} />}
            {!loading && daily && <TilesGrid daily={daily} unit={unit} />}
          </div>
        </section>

        {showTests && <DevTests />}
      </main>

      <footer className="mt-auto max-w-6xl w-full mx-auto px-4 py-8 text-slate-500 text-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            © {year} <span className="font-medium">Jasim Uddin</span>. All rights reserved.
          </div>
          <div>
            Data source:{" "}
            <a className="underline" href="https://open-meteo.com/" target="_blank" rel="noreferrer">
              Open-Meteo
            </a>
            . Only places within Germany are suggested.
          </div>
        </div>
      </footer>
    </div>
  );
}
