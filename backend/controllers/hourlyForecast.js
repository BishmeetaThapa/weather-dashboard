import HourlyForecast from "../models/HourlyForecast.js";

// Default coordinates for Kathmandu
const DEFAULT_LAT = 27.7172;
const DEFAULT_LON = 85.3240;

// CREATE new hourly forecast manually
const createHourlyForecast = async (req, res) => {
    try {
        const hourlyForecast = await HourlyForecast.create(req.body);
        res.status(201).json(hourlyForecast);
    } catch (error) {
        console.error("Error creating hourly forecast:", error);
        res.status(500).json({ error: "Error creating hourly forecast data" });
    }
};

// CREATE multiple hourly forecasts (bulk insert)
const createBulkHourlyForecasts = async (req, res) => {
    try {
        const { forecasts } = req.body;
        if (!forecasts || !Array.isArray(forecasts)) {
            return res.status(400).json({ error: "Forecasts array is required" });
        }
        const hourlyForecasts = await HourlyForecast.insertMany(forecasts);
        res.status(201).json({
            message: "Hourly forecasts created successfully",
            count: hourlyForecasts.length,
            data: hourlyForecasts
        });
    } catch (error) {
        console.error("Error creating bulk hourly forecasts:", error);
        res.status(500).json({ error: "Error creating hourly forecast data" });
    }
};

// GET all hourly forecasts
const getAllHourlyForecasts = async (req, res) => {
    try {
        const data = await HourlyForecast.find().sort({ date: 1, hour: 1 });
        res.json(data);
    } catch (error) {
        console.error("Error retrieving hourly forecasts:", error);
        res.status(500).json({ error: "Error retrieving hourly forecast data" });
    }
};

// GET hourly forecast by ID
const getHourlyForecastById = async (req, res) => {
    try {
        const forecast = await HourlyForecast.findById(req.params.id);
        if (!forecast) {
            return res.status(404).json({ error: "Hourly forecast not found" });
        }
        res.json(forecast);
    } catch (error) {
        console.error("Error retrieving hourly forecast:", error);
        res.status(500).json({ error: "Error retrieving hourly forecast data" });
    }
};

// GET hourly forecasts by city
const getHourlyForecastsByCity = async (req, res) => {
    try {
        const { city } = req.query;
        if (!city) {
            return res.status(400).json({ error: "City parameter is required" });
        }

        const forecasts = await HourlyForecast.find({
            city: { $regex: new RegExp(`^${city}$`, 'i') }
        }).sort({ date: 1, hour: 1 });

        if (!forecasts || forecasts.length === 0) {
            return res.status(404).json({ error: "Hourly forecast data not found for this city" });
        }

        res.json({ city: city, list: forecasts });
    } catch (error) {
        console.error("Error retrieving hourly forecast by city:", error);
        res.status(500).json({ error: "Error retrieving hourly forecast data" });
    }
};

// GET hourly forecasts by city and date
const getHourlyForecastsByCityAndDate = async (req, res) => {
    try {
        const { city } = req.params;
        const { date } = req.query;

        if (!city) {
            return res.status(400).json({ error: "City parameter is required" });
        }

        let query = {
            city: { $regex: new RegExp(`^${city}$`, 'i') }
        };

        if (date) {
            const targetDate = new Date(date);
            const nextDay = new Date(targetDate);
            nextDay.setDate(nextDay.getDate() + 1);

            query.date = {
                $gte: targetDate,
                $lt: nextDay
            };
        }

        const forecasts = await HourlyForecast.find(query).sort({ hour: 1 });

        if (!forecasts || forecasts.length === 0) {
            return res.status(404).json({ error: "Hourly forecast data not found" });
        }

        res.json({ city: city, date: date, list: forecasts });
    } catch (error) {
        console.error("Error retrieving hourly forecast by city and date:", error);
        res.status(500).json({ error: "Error retrieving hourly forecast data" });
    }
};

// GET hourly forecasts for next 24 hours
const getHourlyForecasts24h = async (req, res) => {
    try {
        const { city } = req.query;

        if (!city) {
            return res.status(400).json({ error: "City parameter is required" });
        }

        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(23, 59, 59, 999);

        const forecasts = await HourlyForecast.find({
            city: { $regex: new RegExp(`^${city}$`, 'i') },
            date: {
                $gte: now,
                $lte: tomorrow
            }
        }).sort({ date: 1, hour: 1 });

        if (!forecasts || forecasts.length === 0) {
            return res.status(404).json({ error: "No hourly forecast data available for the next 24 hours" });
        }

        res.json({ city: city, list: forecasts });
    } catch (error) {
        console.error("Error retrieving 24h hourly forecast:", error);
        res.status(500).json({ error: "Error retrieving hourly forecast data" });
    }
};

// UPDATE hourly forecast by ID
const updateHourlyForecastById = async (req, res) => {
    try {
        const forecast = await HourlyForecast.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!forecast) {
            return res.status(404).json({ error: "Hourly forecast not found" });
        }

        res.json({ message: "Hourly forecast updated successfully", data: forecast });
    } catch (error) {
        console.error("Error updating hourly forecast:", error);
        res.status(500).json({ error: "Error updating hourly forecast data" });
    }
};

// DELETE hourly forecast by ID
const deleteHourlyForecastById = async (req, res) => {
    try {
        const forecast = await HourlyForecast.findByIdAndDelete(req.params.id);

        if (!forecast) {
            return res.status(404).json({ error: "Hourly forecast not found" });
        }

        res.json({ message: "Hourly forecast deleted successfully" });
    } catch (error) {
        console.error("Error deleting hourly forecast:", error);
        res.status(500).json({ error: "Error deleting hourly forecast data" });
    }
};

// DELETE all hourly forecasts for a city
const deleteHourlyForecastsByCity = async (req, res) => {
    try {
        const { city } = req.params;

        if (!city) {
            return res.status(400).json({ error: "City parameter is required" });
        }

        const result = await HourlyForecast.deleteMany({
            city: { $regex: new RegExp(`^${city}$`, 'i') }
        });

        res.json({
            message: "Hourly forecasts deleted successfully",
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error("Error deleting hourly forecasts:", error);
        res.status(500).json({ error: "Error deleting hourly forecast data" });
    }
};

export {
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
};
