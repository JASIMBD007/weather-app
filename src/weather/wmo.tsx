// src/weather/wmo.ts
import { Droplets, Sun } from "lucide-react";
import { CloudIcon, SnowIcon, StormIcon } from "./icons";

// WMO weather code mapping: English description + icon component
export type WmoEntry = {
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  short: string;
};

const wmo: Record<number, WmoEntry> = {
  0: { label: "Clear sky", Icon: Sun, short: "Clear" },
  1: { label: "Mostly clear", Icon: Sun, short: "Mostly clear" },
  2: { label: "Partly cloudy", Icon: Sun, short: "Partly cloudy" },
  3: { label: "Cloudy", Icon: CloudIcon, short: "Cloudy" },
  45: { label: "Fog", Icon: CloudIcon, short: "Fog" },
  48: { label: "Depositing rime fog", Icon: CloudIcon, short: "Fog" },
  51: { label: "Light drizzle", Icon: Droplets, short: "Drizzle" },
  53: { label: "Moderate drizzle", Icon: Droplets, short: "Drizzle" },
  55: { label: "Dense drizzle", Icon: Droplets, short: "Drizzle" },
  61: { label: "Light rain", Icon: Droplets, short: "Rain" },
  63: { label: "Moderate rain", Icon: Droplets, short: "Rain" },
  65: { label: "Heavy rain", Icon: Droplets, short: "Rain" },
  66: { label: "Light freezing rain", Icon: Droplets, short: "Frz. rain" },
  67: { label: "Heavy freezing rain", Icon: Droplets, short: "Frz. rain" },
  71: { label: "Light snowfall", Icon: SnowIcon, short: "Snow" },
  73: { label: "Moderate snowfall", Icon: SnowIcon, short: "Snow" },
  75: { label: "Heavy snowfall", Icon: SnowIcon, short: "Snow" },
  77: { label: "Snow grains", Icon: SnowIcon, short: "Snow" },
  80: { label: "Light rain showers", Icon: Droplets, short: "Showers" },
  81: { label: "Moderate rain showers", Icon: Droplets, short: "Showers" },
  82: { label: "Violent rain showers", Icon: Droplets, short: "Showers" },
  85: { label: "Light snow showers", Icon: SnowIcon, short: "Snow sh." },
  86: { label: "Heavy snow showers", Icon: SnowIcon, short: "Snow sh." },
  95: { label: "Thunderstorm", Icon: StormIcon, short: "Storm" },
  96: { label: "Thunderstorm (light hail)", Icon: StormIcon, short: "Storm" },
  99: { label: "Thunderstorm (heavy hail)", Icon: StormIcon, short: "Storm" },
};

export default wmo;
