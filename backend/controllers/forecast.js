import Forecast from "../models/forecast.js";


// Default coordinates for Kathmandu
const DEFAULT_LAT = 27.7172;
const DEFAULT_LON = 85.3240;

// CREATE new forecast manually
const createForecast = async (req, res) => {
  await Forecast.create(req.body);
  res.send("Forecast data created successfully!");
};

// GET all forecasts
const getForecasts = async (req, res) => {
  const data = await Forecast.find().sort({ createdAt: -1 });
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

// GET forecast by City
const getForecastByCity = async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) {
      return res.status(400).send("City parameter is required");
    }

    // Case-insensitive search for forecasts matching the city
    // Assuming Forecast model has a 'city' field. 
    // We might want to find the latest forecast entry or a list of future forecasts.
    // Based on previous implementation, it seems we return a list.
    const forecasts = await Forecast.find({
      city: { $regex: new RegExp(`^${city}$`, 'i') }
    }).sort({ date: 1 }); // Sort by date ascending

    if (!forecasts || forecasts.length === 0) {
      return res.status(404).send("Forecast data not found for this city");
    }

    res.send({ city: city, list: forecasts });
  } catch (error) {
    console.error("Error retrieving forecast by city:", error);
    res.status(500).send("Error retrieving forecast data");
  }
};

export {
  createForecast,
  getForecasts,
  getForecastById,
  updateForecastById,
  deleteForecastById,
  getForecastByCity,
};