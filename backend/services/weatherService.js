import axios from "axios";
import HourlyForecast from "../models/HourlyForecast.js";

// OpenWeatherMap API configuration
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || "YOUR_API_KEY";
const OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";

/**
 * Fetch hourly forecast from OpenWeatherMap and save to database
 * @param {string} city - City name
 * @param {number} cnt - Number of hours to fetch (default 24)
 */
const fetchAndSaveHourlyForecast = async (city, cnt = 24) => {
    try {
        console.log(`Fetching hourly forecast for ${city}...`);

        // Fetch forecast from OpenWeatherMap
        const response = await axios.get(`${OPENWEATHER_BASE_URL}/forecast`, {
            params: {
                q: city,
                cnt: cnt,
                appid: OPENWEATHER_API_KEY,
                units: "metric",
            },
        });

        const forecastList = response.data.list;

        if (!forecastList || forecastList.length === 0) {
            throw new Error("No forecast data received from OpenWeatherMap");
        }

        // Transform and save hourly forecasts
        const hourlyForecasts = forecastList.map((item) => {
            const date = new Date(item.dt * 1000);
            return {
                city: city,
                date: new Date(date.setHours(0, 0, 0, 0)), // Normalize to midnight
                hour: date.getHours(),
                temperature: Math.round(item.main.temp),
                feels_like: Math.round(item.main.feels_like),
                condition: item.weather[0].main,
                description: item.weather[0].description,
                icon: getIconName(item.weather[0].main),
                humidity: item.main.humidity,
                wind_speed: Math.round(item.wind.speed * 3.6), // Convert m/s to km/h
                clouds: item.clouds.all,
                precipitation: item.pop ? Math.round(item.pop * 100) : 0, // Probability of precipitation
            };
        });

        // Delete existing forecasts for this city
        await HourlyForecast.deleteMany({
            city: { $regex: new RegExp(`^${city}$`, "i") },
        });

        // Insert new forecasts
        const savedForecasts = await HourlyForecast.insertMany(hourlyForecasts);

        console.log(
            `Successfully saved ${savedForecasts.length} hourly forecasts for ${city}`
        );

        return {
            success: true,
            city: city,
            count: savedForecasts.length,
            data: savedForecasts,
        };
    } catch (error) {
        console.error("Error fetching hourly forecast:", error.message);
        throw new Error(`Failed to fetch hourly forecast: ${error.message}`);
    }
};

/**
 * Fetch hourly forecast for multiple cities
 * @param {string[]} cities - Array of city names
 */
const fetchHourlyForecastForCities = async (cities) => {
    const results = [];

    for (const city of cities) {
        try {
            const result = await fetchAndSaveHourlyForecast(city);
            results.push({ city, success: true, count: result.count });
        } catch (error) {
            results.push({ city, success: false, error: error.message });
        }
    }

    return results;
};

/**
 * Get weather icon name based on condition
 */
const getIconName = (condition) => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes("clear")) return "sun";
    if (conditionLower.includes("cloud")) return "cloud";
    if (conditionLower.includes("rain")) return "cloud-rain";
    if (conditionLower.includes("snow")) return "cloud-snow";
    if (conditionLower.includes("thunder")) return "zap";
    if (conditionLower.includes("drizzle")) return "cloud-rain";
    if (conditionLower.includes("mist") || conditionLower.includes("fog"))
        return "cloud";
    return "cloud";
};

export {
    fetchAndSaveHourlyForecast,
    fetchHourlyForecastForCities,
    getIconName,
};
