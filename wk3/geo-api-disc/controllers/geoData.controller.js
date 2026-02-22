import { GeoData } from "../models/GeoData.js";

/**
 * Helper: basic lat/lon validation
 */
function parseLatLon(req) {
  const lat = req.query.lat !== undefined ? Number(req.query.lat) : undefined;
  const lon = req.query.lon !== undefined ? Number(req.query.lon) : undefined;

  if (lat === undefined || lon === undefined) return { lat: undefined, lon: undefined };

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return { error: "lat and lon must be valid numbers" };
  }
  if (lat < -90 || lat > 90) return { error: "lat must be between -90 and 90" };
  if (lon < -180 || lon > 180) return { error: "lon must be between -180 and 180" };

  return { lat, lon };
}

/**
 * GET /api/geo-data
 * - If lat/lon provided: fetch live geospatial data from Open-Meteo and return it
 * - Otherwise: list stored data from MongoDB with optional filters
 *
 * Optional filters for stored listing:
 *  - start, end (ISO date strings): filter by observedAt range
 *  - nearLat, nearLon, radiusKm: geospatial "near" filter
 */
export async function getGeoData(req, res) {
  try {
    const { lat, lon, error } = parseLatLon(req);

    // CASE A: Live API fetch (requirement 3a)
    if (lat !== undefined && lon !== undefined) {
      if (error) return res.status(400).json({ success: false, message: error });

      const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${encodeURIComponent(lat)}` +
        `&longitude=${encodeURIComponent(lon)}` +
        `&current=temperature_2m,wind_speed_10m` +
        `&timezone=auto`;

      const apiRes = await fetch(url);
      if (!apiRes.ok) {
        const text = await apiRes.text();
        return res.status(502).json({
          success: false,
          message: "Geospatial API request failed",
          status: apiRes.status,
          details: text.slice(0, 500)
        });
      }

      const data = await apiRes.json();
      return res.json({ success: true, mode: "live", data });
    }

    // CASE B: List stored docs (requirement 3c)
    const { start, end, nearLat, nearLon, radiusKm } = req.query;

    const filter = {};

    // Date range filter
    if (start || end) {
      filter.observedAt = {};
      if (start) filter.observedAt.$gte = new Date(start);
      if (end) filter.observedAt.$lte = new Date(end);
    }

    // Optional geo "near" filter
    if (nearLat !== undefined && nearLon !== undefined) {
      const nLat = Number(nearLat);
      const nLon = Number(nearLon);
      const rKm = radiusKm !== undefined ? Number(radiusKm) : 10;

      if (![nLat, nLon, rKm].every((n) => Number.isFinite(n))) {
        return res.status(400).json({
          success: false,
          message: "nearLat, nearLon, and radiusKm must be valid numbers"
        });
      }

      filter.location = {
        $near: {
          $geometry: { type: "Point", coordinates: [nLon, nLat] },
          $maxDistance: rKm * 1000
        }
      };
    }

    const docs = await GeoData.find(filter).sort({ observedAt: -1 }).limit(500);
    return res.json({ success: true, mode: "stored", count: docs.length, data: docs });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * POST /api/geo-data
 * Accept geospatial data and store in MongoDB (requirement 3b)
 *
 * Expected body (example):
 * {
 *   "lat": 30.8327,
 *   "lon": -83.2785,
 *   "observedAt": "2026-02-22T12:00:00.000Z",
 *   "payload": {...},
 *   "label": "valdosta"
 * }
 */
export async function createGeoData(req, res) {
  try {
    const { lat, lon, payload, observedAt, label, source } = req.body || {};

    const nLat = Number(lat);
    const nLon = Number(lon);

    if (!Number.isFinite(nLat) || !Number.isFinite(nLon)) {
      return res.status(400).json({ success: false, message: "lat and lon are required numbers" });
    }
    if (nLat < -90 || nLat > 90) {
      return res.status(400).json({ success: false, message: "lat must be between -90 and 90" });
    }
    if (nLon < -180 || nLon > 180) {
      return res.status(400).json({ success: false, message: "lon must be between -180 and 180" });
    }
    if (payload === undefined) {
      return res.status(400).json({ success: false, message: "payload is required" });
    }

    const doc = await GeoData.create({
      source: source || "manual",
      location: { type: "Point", coordinates: [nLon, nLat] },
      observedAt: observedAt ? new Date(observedAt) : new Date(),
      payload,
      label: label || ""
    });

    return res.status(201).json({
      success: true,
      message: "Geo data saved",
      id: doc._id
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * GET /api/geo-data/:id
 * Retrieve a specific entry by MongoDB ID (requirement 3d)
 */
export async function getGeoDataById(req, res) {
  try {
    const { id } = req.params;

    const doc = await GeoData.findById(id);
    if (!doc) {
      return res.status(404).json({ success: false, message: "Geo data not found" });
    }

    return res.json({ success: true, data: doc });
  } catch (err) {
    // CastError happens when id is not a valid ObjectId
    const status = err.name === "CastError" ? 400 : 500;
    return res.status(status).json({ success: false, message: err.message });
  }
}