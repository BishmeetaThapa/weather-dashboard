import { Router } from "express";
import {
    createHourlyForecast,
    createBulkHourlyForecasts,
    getAllHourlyForecasts,
    getHourlyForecastById,
    getHourlyForecastsByCity,
    getHourlyForecastsByCityAndDate,
    getHourlyForecasts24h,
    updateHourlyForecastById,
    deleteHourlyForecastById,
    deleteHourlyForecastsByCity,
} from "../controllers/hourlyForecast.js";
import { fetchAndSaveHourlyForecast } from "../services/weatherService.js";
import adminAuth from "../middleware/auth.js";

const hourlyForecastRouter = Router();

// Public routes
// GET hourly forecasts by city - /api/hourly-forecast/city?city=Kathmandu
hourlyForecastRouter.get("/city", getHourlyForecastsByCity);

// GET hourly forecasts by city and specific date - /api/hourly-forecast/city/Kathmandu?date=2024-01-15
hourlyForecastRouter.get("/city/:city", getHourlyForecastsByCityAndDate);

// GET hourly forecasts for next 24 hours - /api/hourly-forecast/24h?city=Kathmandu
hourlyForecastRouter.get("/24h", getHourlyForecasts24h);

// Fetch from OpenWeatherMap and save to database - /api/hourly-forecast/sync?city=Kathmandu
hourlyForecastRouter.get("/sync", async (req, res) => {
    try {
        const { city } = req.query;
        if (!city) {
            return res.status(400).json({ error: "City parameter is required" });
        }
        const result = await fetchAndSaveHourlyForecast(city);
        res.json(result);
    } catch (error) {
        console.error("Error syncing hourly forecast:", error);
        res.status(500).json({ error: error.message });
    }
});

// Protected routes (require admin authentication)
// GET all hourly forecasts
hourlyForecastRouter.get("/", getAllHourlyForecasts);

// GET hourly forecast by ID
hourlyForecastRouter.get("/:id", getHourlyForecastById);

// POST create single hourly forecast (public - no auth required)
hourlyForecastRouter.post("/", createHourlyForecast);

// POST create multiple hourly forecasts (bulk) (public - no auth required)
hourlyForecastRouter.post("/bulk", createBulkHourlyForecasts);

// Protected routes (require admin authentication)
// PUT update hourly forecast by ID
hourlyForecastRouter.put("/:id", adminAuth, updateHourlyForecastById);

// DELETE hourly forecast by ID
hourlyForecastRouter.delete("/:id", adminAuth, deleteHourlyForecastById);

// DELETE all hourly forecasts for a city
hourlyForecastRouter.delete("/city/:city", adminAuth, deleteHourlyForecastsByCity);

export default hourlyForecastRouter;
