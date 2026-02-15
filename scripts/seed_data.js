const axios = require('axios');

const weatherData = {
    city: "Kathmandu",
    country: "NP",
    coordinates: { lat: 27.7172, lon: 85.324 },
    weather: [{ id: 800, main: "Clear", description: "Clear Sky", icon: "01d" }],
    base: "stations",
    main: {
        temp: 22,
        feels_like: 24,
        temp_min: 20,
        temp_max: 25,
        pressure: 1015,
        humidity: 45,
    },
    visibility: 10000,
    wind: { speed: 5.5, deg: 120 },
    clouds: { all: 10 },
    dt: Math.floor(Date.now() / 1000),
    sys: { country: "NP", sunrise: 1629852000, sunset: 1629900000 },
    timezone: 20700,
    id: 1283240,
    cod: 200,
};

const forecastData = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
        city: "Kathmandu",
        date: date,
        temperature: 20 + Math.random() * 5,
        weather: "Clear",
        description: i % 2 === 0 ? "Sunny" : "Partly Cloudy",
        icon: i % 2 === 0 ? "sun" : "cloud-sun",
    };
});

async function seed() {
    try {
        console.log("Seeding Weather...");
        await axios.post('http://localhost:5000/api/weather', weatherData);
        console.log("Weather seeded!");

        console.log("Seeding Forecast...");
        for (const day of forecastData) {
            await axios.post('http://localhost:5000/api/forecast', day);
        }
        console.log("Forecast seeded!");

        // Verify
        console.log("Verifying Weather...");
        const weatherRes = await axios.get('http://localhost:5000/api/weather/city/fetch?city=Kathmandu');
        console.log("Weather Data:", weatherRes.data ? "Found" : "Not Found");

        console.log("Verifying Forecast...");
        const forecastRes = await axios.get('http://localhost:5000/api/forecast/city/fetch?city=Kathmandu');
        console.log("Forecast Data:", forecastRes.data ? "Found" : "Not Found");

    } catch (error) {
        console.error("Error seeding data:", error.message);
        if (error.response) {
            console.error("Response data:", error.response.data);
        }
    }
}

seed();
