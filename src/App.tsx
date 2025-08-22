import React, { useEffect, useMemo, useState } from "react";
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
import { deShortFmt } from "./utils/date";
import { safeReplaceState } from "./utils/history";
import { RECENTS_KEY } from "./constants";
import {
  fetchDailyForecast,
  fetchHourlyForecast,
  reverseGeocodeDE,
  searchGermanyCities,
  toSelectedPlace,
} from "./services/openMeteo";
import type {
  DailyForecastResponse,
  GeoResult,
  HourlyForecast,
  SelectedPlace,
} from "./types";

export default function GermanyWeatherApp() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounced(query, 300);
  const [suggestions, setSuggestions] = useState<GeoResult[]>([]);
  const [selected, setSelected] = useState<SelectedPlace | null>(null);
  const [daily, setDaily] = useState<DailyForecastResponse["daily"] | null>(
    null
  );
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

  // Suggestions (DE only)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!debouncedQuery || debouncedQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const results = await searchGermanyCities(debouncedQuery);
        if (!cancelled) setSuggestions(results);
      } catch {
        if (!cancelled) setSuggestions([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  // Parse ?q=… on load
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("q");
      if (q) setQuery(q);
    } catch {}
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (suggestions.length > 0) handlePick(suggestions[0]);
  }

  async function handlePick(place: GeoResult | SelectedPlace) {
    const sp = toSelectedPlace(place);

    setSelected(sp);
    setQuery(sp.name);
    setSuggestions([]);
    setError(null);

    // update URL
    try {
      const params = new URLSearchParams(window.location.search);
      params.set("q", sp.name);
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      safeReplaceState(newUrl);
    } catch {}

    // persist recents
    const nextRecents = [
      sp,
      ...recents.filter((r) => r.name !== sp.name),
    ].slice(0, 6);
    setRecents(nextRecents);
    try {
      localStorage.setItem(RECENTS_KEY, JSON.stringify(nextRecents));
    } catch {}

    await fetchForecast(sp.latitude, sp.longitude);
  }

  async function fetchForecast(lat: number, lon: number) {
    setLoading(true);
    try {
      const [dailyData, hourlyData] = await Promise.all([
        fetchDailyForecast(lat, lon),
        fetchHourlyForecast(lat, lon),
      ]);
      setDaily(dailyData);
      setHourly(hourlyData);
    } catch (e: any) {
      setError(e?.message || "Unerwarteter Fehler");
      setDaily(null);
      setHourly(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleGeolocate() {
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
            setError(
              "Standort liegt nicht in Deutschland. Bitte eine deutsche Stadt suchen."
            );
          }
        } catch (e: any) {
          setError("Geolokalisierung fehlgeschlagen.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setLoading(false);
        setError("Zugriff auf Standort verweigert.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  // 10-day chart data
  const chartData = useMemo(() => {
    if (!daily)
      return [] as Array<{
        date: Date;
        label: string;
        tmaxC: number;
        tminC: number;
        wcode: number;
        precip: number;
      }>;
    const de = deShortFmt;
    return daily.time.map((t, i) => ({
      date: new Date(t),
      label: de.format(new Date(t)),
      tmaxC: daily.temperature_2m_max[i],
      tminC: daily.temperature_2m_min[i],
      wcode: daily.weathercode[i],
      precip: daily.precipitation_sum[i],
    }));
  }, [daily]);

  const today = chartData[0];

  // Hourly items for today (or next hours if late)
  const hourlyToday = useMemo(() => {
    if (!hourly)
      return [] as Array<{
        time: Date;
        tempC: number;
        precip: number;
        wind: number;
        code: number;
      }>;
    const now = new Date();
    const items = hourly.time.map((iso, i) => ({
      time: new Date(iso),
      tempC: hourly.temperature_2m[i],
      precip: hourly.precipitation[i],
      wind: hourly.wind_speed_10m[i],
      code: hourly.weathercode[i],
    }));
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    const todayHours = items.filter((x) => x.time >= now && x.time <= endOfDay);
    const take = todayHours.length ? todayHours : items.slice(0, 12);
    return take.slice(0, 16);
  }, [hourly]);

  // Dev panel toggle
  const showTests = (() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get("test") === "1";
    } catch {
      return false;
    }
  })();

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-indigo-50 text-slate-800">
      <WeatherHeader
        query={query}
        suggestions={suggestions}
        onQueryChange={setQuery}
        onSubmit={handleSubmit}
        onPick={handlePick}
        onGeolocate={handleGeolocate}
        unit={unit}
        onUnitChange={setUnit}
        onRefresh={() =>
          selected && fetchForecast(selected.latitude, selected.longitude)
        }
        selectedDisplay={
          selected ? selected.displayName || selected.name : null
        }
      />

      <main className="max-w-6xl mx-auto px-4 py-6">
        <RecentChips recents={recents} onPick={(r) => handlePick(r)} />

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
          {/* LEFT big card */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 p-5 h-full">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold">Tagesüberblick</h2>
              </div>

              {loading && <Skeleton height={260} />}

              {!loading && daily && today && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Left: overview (1 col) */}
                  <TodayOverview
                    today={{
                      tmaxC: today.tmaxC,
                      tminC: today.tminC,
                      wcode: today.wcode,
                      precip: today.precip,
                    }}
                    daily={daily}
                    unit={unit}
                  />

                  {/* Right: chart (2 cols) */}
                  <div className="md:col-span-2 p-2">
                    <h3 className="font-medium mb-2">
                      10-Tage-Vorschau (°{unit})
                    </h3>
                    <ForecastChart data={chartData} unit={unit} />
                  </div>

                  {/* BELOW BOTH: hourly tiles span all 3 cols */}
                  <div className="md:col-span-3">
                    <HourlyTiles items={hourlyToday} unit={unit} />
                  </div>
                </div>
              )}

              {!loading && !daily && <EmptyState />}

              {error && (
                <div className="mt-4 text-rose-600 text-sm">{error}</div>
              )}
            </div>
          </div>

          {/* RIGHT tiles card */}
          <div className="rounded-3xl bg-gradient-to-br from-slate-50 to-indigo-50/20 shadow-sm ring-1 ring-slate-200 p-5">
            <h3 className="text-lg font-semibold mb-3">Tageskacheln</h3>
            {loading && <Skeleton height={400} />}
            {!loading && daily && <TilesGrid daily={daily} unit={unit} />}
          </div>
        </section>

        {showTests && <DevTests />}
      </main>

      <footer className="max-w-6xl mx-auto px-4 py-8 text-slate-500 text-sm">
        Datenquelle:{" "}
        <a
          className="underline"
          href="https://open-meteo.com/"
          target="_blank"
          rel="noreferrer"
        >
          Open-Meteo
        </a>
        . Nur Orte innerhalb Deutschlands werden vorgeschlagen.
      </footer>
    </div>
  );
}
