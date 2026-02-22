import "dotenv/config";
import express from "express";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";
import { geoDataRouter } from "./routes/geoData.routes.js";

const app = express();
app.use(express.json());

// Bonus: rate limit only the geo routes (helpful for external API fetch usage)
const geoLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 30,           // 30 requests/min per IP
  standardHeaders: true,
  legacyHeaders: false
});

app.use("/api/geo-data", geoLimiter, geoDataRouter);

app.get("/health", (req, res) => res.json({ success: true }));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

const PORT = process.env.PORT || 5050;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ Missing MONGODB_URI in environment variables");
  process.exit(1);
}

await connectDB(MONGODB_URI);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});