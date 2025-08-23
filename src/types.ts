export interface GeoResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country_code: string;
  country: string;
  admin1?: string; // state/region
  admin2?: string;
  population?: number;
}

export interface HourlyForecast {
  time: string[];
  temperature_2m: number[];
  precipitation: number[];
  wind_speed_10m: number[];
  wind_gusts_10m: number[];
  weathercode: number[];
}

export interface DailyForecastResponse {
  daily: {
    time: string[];
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    sunrise: string[];
    sunset: string[];
    wind_speed_10m_max: number[];
    wind_gusts_10m_max: number[];

    // NEW (all optional: Open-Meteo returns them if requested)
    apparent_temperature_max?: number[];
    apparent_temperature_min?: number[];
    precipitation_probability_max?: number[];
    rain_sum?: number[];
    showers_sum?: number[];
    snowfall_sum?: number[];
    uv_index_max?: number[];
    uv_index_clear_sky_max?: number[];
    sunshine_duration?: number[]; // seconds
    daylight_duration?: number[]; // seconds
    wind_direction_10m_dominant?: number[]; // degrees
  };
  hourly?: HourlyForecast;
  timezone: string;
}

export interface SelectedPlace {
  name: string;
  displayName: string; // e.g. "München, Bayern"
  latitude: number;
  longitude: number;
}
