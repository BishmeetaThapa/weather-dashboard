import { Router } from "express";
import {
  getWeather,
  getWeatherById,
  createWeather,
  updateWeatherById,
  deleteWeatherById,
  getWeatherByCity
} from "../controllers/weather.js";
import adminAuth from "../middleware/auth.js";

const weatherRouter = Router();

weatherRouter.get("/city/fetch", getWeatherByCity);
weatherRouter.get("/:city", getWeatherByCity);
weatherRouter.post("/", adminAuth, createWeather);
weatherRouter.get("/", getWeather);
weatherRouter.get("/:id", getWeatherById);
weatherRouter.put("/:id", adminAuth, updateWeatherById);
weatherRouter.delete("/:id", adminAuth, deleteWeatherById);

export default weatherRouter;