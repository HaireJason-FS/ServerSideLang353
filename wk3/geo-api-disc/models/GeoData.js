import mongoose from "mongoose";

const GeoDataSchema = new mongoose.Schema(
  {
    source: { type: String, default: "open-meteo" },

    // GeoJSON Point (required for geospatial indexing / queries)
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        required: true
      },
      coordinates: {
        // [longitude, latitude]
        type: [Number],
        required: true,
        validate: {
          validator: (arr) =>
            Array.isArray(arr) &&
            arr.length === 2 &&
            arr.every((n) => typeof n === "number" && Number.isFinite(n)),
          message: "coordinates must be [lon, lat] numbers"
        }
      }
    },

    // A “when was this measurement/data relevant” timestamp
    observedAt: { type: Date, default: Date.now },

    // Store the raw API payload (flexible)
    payload: { type: mongoose.Schema.Types.Mixed, required: true },

    // Optional label you can use later in the week (e.g., “home”, “jobsite-1”)
    label: { type: String, default: "" }
  },
  { timestamps: true }
);

// Enables $near queries and other geo filters
GeoDataSchema.index({ location: "2dsphere" });

export const GeoData = mongoose.model("GeoData", GeoDataSchema);