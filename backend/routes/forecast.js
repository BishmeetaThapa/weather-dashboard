import { Router } from "express";
import {
  createForecast,
  getForecasts,
  getForecastById,
  updateForecastById,
  deleteForecastById,
  getForecastByCity,
} from "../controllers/forecast.js";
import adminAuth from "../middleware/auth.js";

const forecastRouter = Router();

// Fetch from OpenWeather
forecastRouter.get("/city/fetch", getForecastByCity); // /forecast/city/fetch?city=Kathmandu&days=5

// CRUD routes
forecastRouter.post("/", adminAuth, createForecast);
forecastRouter.get("/", getForecasts);
forecastRouter.get("/:id", getForecastById);
forecastRouter.put("/:id", adminAuth, updateForecastById);
forecastRouter.delete("/:id", adminAuth, deleteForecastById);

export default forecastRouter;
