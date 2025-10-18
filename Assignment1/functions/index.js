/* eslint-env node */
/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/https");
const logger = require("firebase-functions/logger");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10, region: "australia-southeast2" });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const API_KEY = "9bfe649dc3524c9aa0c55559251710";
const BASE_URL = "https://api.weatherapi.com/v1/current.json";

function normalizeWeatherApi(data) {
  return {
    lastUpdatedEpoch: data?.current?.last_updated_epoch,
    tempC: data?.current?.temp_c,
    isDay: data?.current?.is_day === 1,
  };
}

exports.getMelbourneWeather = onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).send("");

  try {
    const params = new URLSearchParams({ key: API_KEY, q: "Melbourne,AU", aqi: "no" });
    const response = await fetch(`${BASE_URL}?${params.toString()}`);
    if (!response.ok) {
      const text = await response.text();
      logger.error("WeatherAPI error", { status: response.status, body: text });
      return res.status(502).json({ error: "Upstream weather API error", status: response.status });
    }
    const json = await response.json();
    return res.status(200).json(normalizeWeatherApi(json));
  } catch (err) {
    logger.error("getMelbourneWeather failed", err);
    return res.status(500).json({ error: "Internal error fetching weather" });
  }
});
