import mongoose from "mongoose";

const forecastSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    temperature: {
      type: Number,
    },
    weather: {
      type: String,
    },
    description: {
      type: String,
    },
    icon: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Forecast = mongoose.model("Forecast", forecastSchema);

export default Forecast;