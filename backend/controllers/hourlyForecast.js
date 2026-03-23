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

// GET hourly forecasts by city - fetches from Open-Meteo if not in database
const getHourlyForecastsByCity = async (req, res) => {
    try {
        const { city, hours = 24 } = req.query;
        if (!city) {
            return res.status(400).json({ error: "City parameter is required" });
        }

        // First, try to find existing hourly forecast data in database
        const forecasts = await HourlyForecast.find({
            city: { $regex: new RegExp(`^${city}$`, 'i') }
        }).sort({ date: 1, hour: 1 });

        // If we have existing data, return it
        if (forecasts && forecasts.length > 0) {
            return res.json({ city: city, list: forecasts });
        }

        // If no data in database, fetch from Open-Meteo API
        // First get coordinates for the city using Open-Meteo Geocoding
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        let lat = DEFAULT_LAT;
        let lon = DEFAULT_LON;

        try {
            const geoResponse = await fetch(geoUrl);
            const geoData = await geoResponse.json();

            if (geoData.results && geoData.results.length > 0) {
                lat = geoData.results[0].latitude;
                lon = geoData.results[0].longitude;
            }
        } catch (geoError) {
            console.error("Geocoding error:", geoError);
        }

        // Fetch hourly forecast from Open-Meteo
        const hourlyUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m&timezone=auto&forecast_hours=${hours}`;

        const hourlyResponse = await fetch(hourlyUrl);
        const hourlyData = await hourlyResponse.json();

        if (!hourlyData.hourly) {
            return res.status(404).json({ error: "Hourly forecast data not available for this city" });
        }

        // Map weather codes to conditions
        const weatherCodeMap = {
            0: "Clear", 1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast",
            45: "Fog", 48: "Fog",
            51: "Drizzle", 53: "Drizzle", 55: "Drizzle",
            61: "Rain", 63: "Rain", 65: "Rain",
            71: "Snow", 73: "Snow", 75: "Snow",
            80: "Rain", 81: "Rain", 82: "Rain",
            95: "Thunderstorm", 96: "Thunderstorm", 99: "Thunderstorm"
        };

        const hourly = hourlyData.hourly;
        const forecastsToSave = [];
        const today = new Date().toISOString().split('T')[0];

        for (let i = 0; i < Math.min(hourly.time.length, 48); i++) {
            const dateTime = new Date(hourly.time[i]);
            const date = dateTime.toISOString().split('T')[0];
            const hour = dateTime.getHours();
            const condition = weatherCodeMap[hourly.weather_code[i]] || "Clear";

            const forecastEntry = {
                city: city,
                date: date,
                hour: hour,
                temperature: Math.round(hourly.temperature_2m[i]),
                feels_like: Math.round(hourly.apparent_temperature[i]),
                condition: condition,
                humidity: hourly.relative_humidity_2m[i],
                wind_speed: hourly.wind_speed_10m[i],
                clouds: hourly.cloud_cover[i]
            };

            forecastsToSave.push(forecastEntry);
        }

        // Try to save to database for future reference
        try {
            await HourlyForecast.insertMany(forecastsToSave);
            console.log(`Hourly forecast data saved to database for ${city}`);
        } catch (saveError) {
            console.error("Error saving hourly forecast to database:", saveError);
        }

        res.json({
            city: city,
            list: forecastsToSave
        });

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
