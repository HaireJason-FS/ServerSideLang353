import express from "express";
import { createGeoData, getGeoData, getGeoDataById } from "../controllers/geoData.controller.js";

export const geoDataRouter = express.Router();

geoDataRouter.get("/", getGeoData);
geoDataRouter.post("/", createGeoData);
geoDataRouter.get("/:id", getGeoDataById);