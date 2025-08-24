import type { DailyForecastResponse, GeoResult, HourlyForecast, SelectedPlace } from "../types";

export async function searchGermanyCities(name: string): Promise<GeoResult[]> {
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=8&addressdetails=1&q=${encodeURIComponent(
    name
  )}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "weather-surfer/1.0 (your-email@example.com)",
      Accept: "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to search places");
  const data = (await res.json()) as Array<any>;

  return data.map((r) => {
    const name = r.name || (typeof r.display_name === "string" ? r.display_name.split(",")[0] : "Unknown");
    const addr = r.address || {};
    return {
      id: Number(r.place_id),
      name,
      latitude: parseFloat(r.lat),
      longitude: parseFloat(r.lon),
      country_code: (addr.country_code || "").toUpperCase(),
      country: addr.country || "",
      admin1: addr.state || addr.region || addr.province || addr.county || undefined,
      admin2: addr.county || addr.municipality || addr.city || undefined,
      population: undefined,
    } as GeoResult;
  });
}

export async function reverseGeocodeDE(lat: number, lon: number): Promise<GeoResult | undefined> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&lat=${lat}&lon=${lon}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "weather-surfer/1.0 (your-email@example.com)",
      Accept: "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to reverse geocode");
  const r = await res.json();

  if (!r || !r.lat || !r.lon) return undefined;
  const addr = r.address || {};
  const name = r.name || (typeof r.display_name === "string" ? r.display_name.split(",")[0] : "Unknown");

  return {
    id: Number(r.place_id || Date.now()),
    name,
    latitude: parseFloat(r.lat),
    longitude: parseFloat(r.lon),
    country_code: (addr.country_code || "").toUpperCase(),
    country: addr.country || "",
    admin1: addr.state || addr.region || addr.province || addr.county || undefined,
    admin2: addr.county || addr.municipality || addr.city || undefined,
    population: undefined,
  } as GeoResult;
}

export async function fetchDailyForecast(lat: number, lon: number): Promise<DailyForecastResponse["daily"]> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set(
    "daily",
    [
      "weathercode",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_sum",
      "sunrise",
      "sunset",
      "wind_speed_10m_max",
      "wind_gusts_10m_max",
    ].join(",")
  );
  url.searchParams.set("forecast_days", "10");
  url.searchParams.set("timezone", "auto");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to load daily forecast");
  const data: DailyForecastResponse = await res.json();
  return data.daily;
}

export async function fetchHourlyForecast(lat: number, lon: number): Promise<HourlyForecast> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set(
    "hourly",
    ["temperature_2m", "precipitation", "wind_speed_10m", "wind_gusts_10m", "weathercode", "is_day"].join(",")
  );
  url.searchParams.set("windspeed_unit", "kmh");
  url.searchParams.set("forecast_days", "2");
  url.searchParams.set("timezone", "auto");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to load hourly forecast");
  const data = await res.json();
  return data.hourly as HourlyForecast;
}

export function toSelectedPlace(place: GeoResult | SelectedPlace): SelectedPlace {
  if ("id" in place) {
    return {
      name: place.name,
      displayName: [place.name, place.admin1, place.country].filter(Boolean).join(", "),
      latitude: place.latitude,
      longitude: place.longitude,
    };
  }
  return place;
}
