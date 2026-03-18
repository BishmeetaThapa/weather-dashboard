import mongoose from "mongoose";

const hourlyForecastSchema = new mongoose.Schema(
    {
        city: {
            type: String,
            required: true,
            index: true,
        },
        date: {
            type: Date,
            required: true,
        },
        hour: {
            type: Number,
            required: true,
            min: 0,
            max: 23,
        },
        temperature: {
            type: Number,
            required: true,
        },
        feels_like: {
            type: Number,
        },
        condition: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        icon: {
            type: String,
        },
        humidity: {
            type: Number,
        },
        wind_speed: {
            type: Number,
        },
        clouds: {
            type: Number,
        },
        precipitation: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Create index for efficient queries
hourlyForecastSchema.index({ city: 1, date: 1, hour: 1 });

const HourlyForecast = mongoose.model("HourlyForecast", hourlyForecastSchema);

export default HourlyForecast;
