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

// GET weather by City - fetches from Open-Meteo if not in database
const getWeatherByCity = async (req, res) => {
  try {
    const city = req.params.city || req.query.city;
    if (!city) {
      return res.status(400).send("City parameter is required");
    }

    // First, try to find existing weather data in database
    let weather = await Weather.findOne({
      city: { $regex: new RegExp(`^${city}$`, 'i') }
    }).sort({ createdAt: -1 });

    // If we have existing data within 30 minutes, return it
    if (weather) {
      const dataAge = Date.now() - new Date(weather.createdAt).getTime();
      if (dataAge < 30 * 60 * 1000) { // 30 minutes
        return res.send(weather);
      }
    }

    // If no data in database or data is too old, fetch from Open-Meteo API
    // First get coordinates for the city using Open-Meteo Geocoding
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

    let lat = DEFAULT_LAT;
    let lon = DEFAULT_LON;
    let foundCity = city;

    try {
      const geoResponse = await fetch(geoUrl);
      const geoData = await geoResponse.json();

      if (geoData.results && geoData.results.length > 0) {
        lat = geoData.results[0].latitude;
        lon = geoData.results[0].longitude;
        foundCity = geoData.results[0].name;
      }
    } catch (geoError) {
      console.error("Geocoding error:", geoError);
      // Use default coordinates
    }

    // Fetch current weather from Open-Meteo
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m&timezone=auto`;

    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    if (!weatherData.current) {
      return res.status(404).send("Weather data not available for this city");
    }

    const current = weatherData.current;

    // Map weather code to condition
    const weatherCodeMap = {
      0: { main: "Clear", description: "Clear sky" },
      1: { main: "Clouds", description: "Mainly clear" },
      2: { main: "Clouds", description: "Partly cloudy" },
      3: { main: "Clouds", description: "Overcast" },
      45: { main: "Mist", description: "Fog" },
      48: { main: "Mist", description: "Depositing rime fog" },
      51: { main: "Drizzle", description: "Light drizzle" },
      53: { main: "Drizzle", description: "Moderate drizzle" },
      55: { main: "Drizzle", description: "Dense drizzle" },
      61: { main: "Rain", description: "Slight rain" },
      63: { main: "Rain", description: "Moderate rain" },
      65: { main: "Rain", description: "Heavy rain" },
      71: { main: "Snow", description: "Slight snow" },
      73: { main: "Snow", description: "Moderate snow" },
      75: { main: "Snow", description: "Heavy snow" },
      80: { main: "Rain", description: "Slight rain showers" },
      81: { main: "Rain", description: "Moderate rain showers" },
      82: { main: "Rain", description: "Violent rain showers" },
      95: { main: "Thunderstorm", description: "Thunderstorm" },
      96: { main: "Thunderstorm", description: "Thunderstorm with slight hail" },
      99: { main: "Thunderstorm", description: "Thunderstorm with heavy hail" }
    };

    const weatherInfo = weatherCodeMap[current.weather_code] || { main: "Clouds", description: "Unknown" };

    // Create weather object in our format
    const weatherObj = {
      city: foundCity,
      country: "Unknown",
      coordinates: { lat, lon },
      weather: [
        {
          id: current.weather_code,
          main: weatherInfo.main,
          description: weatherInfo.description,
          icon: getWeatherIcon(weatherInfo.main)
        }
      ],
      main: {
        temp: current.temperature_2m,
        feels_like: current.apparent_temperature,
        temp_min: current.temperature_2m - 3,
        temp_max: current.temperature_2m + 3,
        pressure: current.pressure_msl || current.surface_pressure,
        humidity: current.relative_humidity_2m
      },
      wind: {
        speed: current.wind_speed_10m,
        deg: current.wind_direction_10m
      },
      clouds: {
        all: current.cloud_cover
      },
      visibility: 10000,
      uvIndex: 0,
      sunrise: "6:00 AM",
      sunset: "6:00 PM",
      dt: Math.floor(Date.now() / 1000),
      cod: 200,
      createdAt: new Date()
    };

    // Try to save to database (don't fail if it doesn't work)
    try {
      const newWeather = await Weather.create(weatherObj);
      weather = newWeather;
    } catch (saveError) {
      console.error("Error saving weather to database:", saveError);
    }

    res.send(weather);

  } catch (error) {
    console.error("Error retrieving weather by city:", error);
    res.status(500).send("Error retrieving weather data");
  }
};

// Helper function to get weather icon based on condition
function getWeatherIcon(condition) {
  const cond = condition.toLowerCase();
  if (cond.includes('clear') || cond.includes('sunny')) return '01d';
  if (cond.includes('cloud') || cond.includes('overcast')) return '03d';
  if (cond.includes('rain') || cond.includes('drizzle')) return '10d';
  if (cond.includes('snow')) return '13d';
  if (cond.includes('thunder') || cond.includes('storm')) return '11d';
  if (cond.includes('fog') || cond.includes('mist')) return '50d';
  return '01d';
}

export { createWeather, getWeather, getWeatherById, updateWeatherById, deleteWeatherById, getWeatherByCity };