"use client";
import { useState } from "react";

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
}

// Mock weather data for multiple cities in Nepal
const mockNepalWeather: WeatherData[] = [
  { name: "Kathmandu", main: { temp: 22, humidity: 65 }, weather: [{ description: "clear sky", icon: "01d" }], wind: { speed: 3.5 } },
  { name: "Pokhara", main: { temp: 25, humidity: 70 }, weather: [{ description: "few clouds", icon: "02d" }], wind: { speed: 4.2 } },
  { name: "Lalitpur", main: { temp: 21, humidity: 68 }, weather: [{ description: "scattered clouds", icon: "03d" }], wind: { speed: 3.0 } },
  { name: "Bhaktapur", main: { temp: 20, humidity: 66 }, weather: [{ description: "mist", icon: "50d" }], wind: { speed: 2.5 } },
  { name: "Biratnagar", main: { temp: 28, humidity: 60 }, weather: [{ description: "haze", icon: "50d" }], wind: { speed: 3.8 } },
  { name: "Janakpur", main: { temp: 29, humidity: 58 }, weather: [{ description: "sunny", icon: "01d" }], wind: { speed: 2.9 } },
  { name: "Chitwan", main: { temp: 27, humidity: 72 }, weather: [{ description: "light rain", icon: "10d" }], wind: { speed: 4.5 } },
  { name: "Dharan", main: { temp: 26, humidity: 65 }, weather: [{ description: "few clouds", icon: "02d" }], wind: { speed: 3.2 } },
  { name: "Butwal", main: { temp: 28, humidity: 64 }, weather: [{ description: "clear sky", icon: "01d" }], wind: { speed: 3.7 } },
  { name: "Hetauda", main: { temp: 25, humidity: 67 }, weather: [{ description: "scattered clouds", icon: "03d" }], wind: { speed: 3.0 } },
];

export default function NepalWeatherDashboard() {
  const [weatherData] = useState<WeatherData[]>(mockNepalWeather);

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {weatherData.map((weather) => {
        const weatherInfo = weather.weather[0];
        return (
          <div
            key={weather.name}
            className="bg-white/20 backdrop-blur-md p-4 rounded-lg shadow-md w-64"
          >
            <h2 className="text-xl font-semibold mb-2">{weather.name}</h2>
            <div className="flex items-center space-x-4">
              <img
                src={`http://openweathermap.org/img/wn/${weatherInfo.icon}@2x.png`}
                alt={weatherInfo.description}
                className="w-16 h-16"
              />
              <div>
                <p className="text-2xl font-bold">{Math.round(weather.main.temp)}°C</p>
                <p className="capitalize">{weatherInfo.description}</p>
                <p className="text-sm text-gray-500">
                  Humidity: {weather.main.humidity}% | Wind: {weather.wind.speed} m/s
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}