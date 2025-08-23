import { BERLIN_TZ } from "../constants";
import type {
  DailyForecastResponse,
  GeoResult,
  HourlyForecast,
  SelectedPlace,
} from "../types";

export async function searchGermanyCities(name: string): Promise<GeoResult[]> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    name
  )}&count=8&language=de&format=json`;
  const res = await fetch(url);
  const data = await res.json();
  const results: GeoResult[] = (data?.results || []).filter(
    (r: GeoResult) => r.country_code === "DE"
  );
  return results;
}

export async function reverseGeocodeDE(
  lat: number,
  lon: number
): Promise<GeoResult | undefined> {
  const url = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=de&format=json&count=1`;
  const res = await fetch(url);
  const data = await res.json();
  const best: GeoResult | undefined = data?.results?.[0];
  return best?.country_code === "DE" ? best : undefined;
}

export async function fetchDailyForecast(
  lat: number,
  lon: number
): Promise<DailyForecastResponse["daily"]> {
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
  url.searchParams.set("timezone", BERLIN_TZ);
  url.searchParams.set("forecast_days", "10");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Fehler beim Laden der Vorhersage");
  const data: DailyForecastResponse = await res.json();
  return data.daily;
}

export function toSelectedPlace(
  place: GeoResult | SelectedPlace
): SelectedPlace {
  if ("id" in place) {
    return {
      name: place.name,
      displayName: [place.name, place.admin1].filter(Boolean).join(", "),
      latitude: place.latitude,
      longitude: place.longitude,
    };
  }
  return place;
}

export async function fetchHourlyForecast(
  lat: number,
  lon: number
): Promise<HourlyForecast> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set(
    "hourly",
    [
      "temperature_2m",
      "precipitation",
      "wind_speed_10m",
      "wind_gusts_10m",
      "weathercode",
      "is_day",
    ].join(",")
  );
  url.searchParams.set("windspeed_unit", "kmh");
  url.searchParams.set("timezone", "Europe/Berlin");
  url.searchParams.set("forecast_days", "2");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Fehler beim Laden der Stundenwerte");
  const data = await res.json();
  return data.hourly as HourlyForecast;
}
