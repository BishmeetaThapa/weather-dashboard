import mongoose from "mongoose";

const WeatherSchema = new mongoose.Schema({
    city: {
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    coordinates: {
        lon: { type: Number, required: true },
        lat: { type: Number, required: true }
    },
    weather: [{
        id: Number,
        main: String,
        description: String,
        icon: String
    }],
    base: String,
    main: {
        temp: { type: Number, required: true },
        feels_like: Number,
        temp_min: Number,
        temp_max: Number,
        pressure: Number,
        humidity: Number,
        sea_level: Number,
        grnd_level: Number
    },
    visibility: Number,
    wind: {
        speed: Number,
        deg: Number,
        gust: Number
    },
    clouds: {
        all: Number
    },
    dt: Number,
    sys: {
        type: { type: Number },
        id: { type: Number },
        country: String,
        sunrise: Number,
        sunset: Number
    },
    timezone: Number,
    cod: Number
}, {
    timestamps: true
});

const Weather = mongoose.model("Weather", WeatherSchema);

export default Weather;

