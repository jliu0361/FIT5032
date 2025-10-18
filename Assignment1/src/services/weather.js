const API_KEY = "9bfe649dc3524c9aa0c55559251710";
const BASE_URL = "https://api.weatherapi.com/v1/current.json";

function normalizeWeatherApi(data) {
  return {
    location: data?.location?.name || "Melbourne",
    lastUpdatedEpoch: data?.current?.last_updated_epoch,
    lastUpdated: data?.current?.last_updated,
    tempC: data?.current?.temp_c,
    tempF: data?.current?.temp_f,
    isDay: data?.current?.is_day === 1,
    conditionText: data?.current?.condition?.text,
    icon: data?.current?.condition?.icon,
  };
}

export async function fetchMelbourneWeather() {
  const params = new URLSearchParams({ key: API_KEY, q: "Melbourne,AU", aqi: "no" });
  const url = `${BASE_URL}?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Weather request failed: ${res.status}`);
  }
  const data = await res.json();
  return normalizeWeatherApi(data);
}

