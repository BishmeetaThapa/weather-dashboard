import Forecast from "../models/forecast.js";

// Default coordinates for Kathmandu
const DEFAULT_LAT = 27.7172;
const DEFAULT_LON = 85.3240;

// CREATE new forecast manually
const createForecast = async (req, res) => {
  await Forecast.create(req.body);
  res.send("Forecast data created successfully!");
};

// GET all forecasts or by city query param
const getForecasts = async (req, res) => {
  const { city } = req.query;
  let data;
  if (city) {
    data = await Forecast.find({
      city: { $regex: new RegExp(`^${city}$`, 'i') }
    }).sort({ createdAt: -1 });
  } else {
    data = await Forecast.find().sort({ createdAt: -1 });
  }
  res.send(data);
};

// GET forecast by ID
const getForecastById = async (req, res) => {
  const forecast = await Forecast.findById(req.params.id);
  res.send(forecast);
};

// UPDATE forecast by ID
const updateForecastById = async (req, res) => {
  await Forecast.findByIdAndUpdate(req.params.id, req.body);
  res.send("Forecast data updated successfully!");
};

// DELETE forecast by ID
const deleteForecastById = async (req, res) => {
  await Forecast.findByIdAndDelete(req.params.id);
  res.send("Forecast data deleted successfully!");
};

// GET forecast by City - fetches from Open-Meteo if not in database
const getForecastByCity = async (req, res) => {
  try {
    const { city, days = 7 } = req.query;
    if (!city) {
      return res.status(400).send("City parameter is required");
    }

    // First, try to find existing forecast data in database
    const forecasts = await Forecast.find({
      city: { $regex: new RegExp(`^${city}$`, 'i') }
    }).sort({ date: 1 });

    // If we have existing data, return it
    if (forecasts && forecasts.length > 0) {
      return res.send({ city: city, list: forecasts });
    }

    // If no data in database, fetch from Open-Meteo API
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

    // Fetch 7-day forecast from Open-Meteo
    const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=${days}`;

    const forecastResponse = await fetch(forecastUrl);
    const forecastData = await forecastResponse.json();

    if (!forecastData.daily) {
      return res.status(404).send("Forecast data not available for this city");
    }

    // Convert Open-Meteo data to our format and save to database
    const daily = forecastData.daily;
    const weatherConditions = {
      0: "Clear",
      1: "Mainly Clear",
      2: "Partly Cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing Rime Fog",
      51: "Light Drizzle",
      53: "Moderate Drizzle",
      55: "Dense Drizzle",
      61: "Slight Rain",
      63: "Moderate Rain",
      65: "Heavy Rain",
      71: "Slight Snow",
      73: "Moderate Snow",
      75: "Heavy Snow",
      80: "Slight Rain Showers",
      81: "Moderate Rain Showers",
      82: "Violent Rain Showers",
      95: "Thunderstorm",
      96: "Thunderstorm with Hail",
      99: "Thunderstorm with Heavy Hail"
    };

    const forecastsToSave = [];

    for (let i = 0; i < daily.time.length; i++) {
      const date = new Date(daily.time[i]);
      const condition = weatherConditions[daily.weather_code[i]] || "Clear";

      const forecastEntry = {
        city: city,
        date: date.toISOString().split('T')[0],
        temperature: Math.round((daily.temperature_2m_max[i] + daily.temperature_2m_min[i]) / 2),
        weather: condition,
        description: condition,
        icon: getWeatherIcon(condition)
      };

      forecastsToSave.push(forecastEntry);
    }

    // Save to database
    try {
      await Forecast.insertMany(forecastsToSave);
      console.log(`Forecast data saved to database for ${city}`);
    } catch (saveError) {
      console.error("Error saving forecast to database:", saveError);
    }

    res.send({
      city: city,
      list: forecastsToSave.map(f => ({
        ...f,
        _id: Math.random().toString(),
        day: new Date(f.date).toLocaleDateString('en-US', { weekday: 'short' })
      }))
    });

  } catch (error) {
    console.error("Error retrieving forecast by city:", error);
    res.status(500).send("Error retrieving forecast data");
  }
};

// Helper function to get weather icon based on condition
function getWeatherIcon(condition) {
  const cond = condition.toLowerCase();
  if (cond.includes('clear') || cond.includes('sunny')) return 'sun';
  if (cond.includes('cloud') || cond.includes('overcast')) return 'cloud';
  if (cond.includes('rain') || cond.includes('drizzle')) return 'cloud-rain';
  if (cond.includes('snow')) return 'cloud-snow';
  if (cond.includes('thunder') || cond.includes('storm')) return 'zap';
  if (cond.includes('fog') || cond.includes('mist')) return 'cloud-fog';
  return 'cloud';
}

export {
  createForecast,
  getForecasts,
  getForecastById,
  updateForecastById,
  deleteForecastById,
  getForecastByCity,
};
