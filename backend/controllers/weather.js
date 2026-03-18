import Weather from "../models/Weather.js";
import { fetchAndSaveHourlyForecast } from "../services/weatherService.js";


// Default coordinates for Kathmandu
const DEFAULT_LAT = 27.7172;
const DEFAULT_LON = 85.3240;

// CREATE new weather and automatically fetch hourly forecast
const createWeather = async (req, res) => {
  try {
    // Create weather data
    const weather = await Weather.create(req.body);

    // Get city name from the created weather data
    const city = req.body.city || (req.body.location && req.body.location.city);

    if (city) {
      // Automatically fetch and save hourly forecast from OpenWeatherMap
      try {
        await fetchAndSaveHourlyForecast(city, 24);
        console.log(`Hourly forecast automatically created for ${city}`);
      } catch (hourlyError) {
        console.error(`Failed to fetch hourly forecast for ${city}:`, hourlyError.message);
        // Don't fail the request if hourly forecast fails
      }
    }

    res.send("Weather data created successfully!");
  } catch (error) {
    console.error("Error creating weather:", error);
    res.status(500).send("Error creating weather data");
  }
};

// Helper function to calculate distance using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

// GET all weather from DB (with optional coordinate sorting)
const getWeather = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    let data = await Weather.find().lean().sort({ createdAt: -1 });

    if (lat && lon && data.length > 0) {
      const userLat = parseFloat(lat);
      const userLon = parseFloat(lon);

      // Calculate distance for each node and sort
      data = data.map(node => {
        const distance = calculateDistance(userLat, userLon, node.coordinates.lat, node.coordinates.lon);
        return { ...node, distance };
      }).sort((a, b) => a.distance - b.distance);
    }

    res.send(data);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).send("Error retrieving weather data");
  }
};

// GET weather by ID
const getWeatherById = async (req, res) => {
  const weather = await Weather.findById(req.params.id);
  res.send(weather);
};

// UPDATE weather by ID
const updateWeatherById = async (req, res) => {
  await Weather.findByIdAndUpdate(req.params.id, req.body);
  res.send("Weather data updated successfully!");
};

// DELETE weather by ID
const deleteWeatherById = async (req, res) => {
  await Weather.findByIdAndDelete(req.params.id);
  res.send("Weather data deleted successfully!");
};

// GET weather by City
const getWeatherByCity = async (req, res) => {
  try {
    const city = req.params.city || req.query.city;
    if (!city) {
      return res.status(400).send("City parameter is required");
    }

    // Case-insensitive search
    const weather = await Weather.findOne({
      city: { $regex: new RegExp(`^${city}$`, 'i') }
    }).sort({ createdAt: -1 });

    if (!weather) {
      return res.status(404).send("Weather data not found for this city");
    }

    res.send(weather);
  } catch (error) {
    console.error("Error retrieving weather by city:", error);
    res.status(500).send("Error retrieving weather data");
  }
};

export { createWeather, getWeather, getWeatherById, updateWeatherById, deleteWeatherById, getWeatherByCity };