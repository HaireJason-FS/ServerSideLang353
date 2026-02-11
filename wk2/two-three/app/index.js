const express = require("express");
const morgan = require("morgan");
const app = express();
const routeHandler = require("./routes/routindex", "./routes/authorRoutes");

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running", success: true });
});

app.use("/api/v1", routeHandler);

module.exports = app;