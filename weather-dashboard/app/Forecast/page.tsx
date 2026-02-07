// components/SevenDayForecast.jsx
"use client";
import { useState } from "react";

interface WeatherItem {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  weather: Array<{
    icon: string;
    description: string;
  }>;
}

export default function SevenDayForecast() {
  // Mock 7-day forecast data
  const [forecast] = useState<WeatherItem[]>([
    { dt: 1, dt_txt: "2026-02-07 12:00:00", main: { temp: 22, humidity: 65 }, wind: { speed: 3.5 }, weather: [{ icon: "01d", description: "clear sky" }] },
    { dt: 2, dt_txt: "2026-02-08 12:00:00", main: { temp: 24, humidity: 60 }, wind: { speed: 4.0 }, weather: [{ icon: "02d", description: "few clouds" }] },
    { dt: 3, dt_txt: "2026-02-09 12:00:00", main: { temp: 23, humidity: 62 }, wind: { speed: 3.2 }, weather: [{ icon: "03d", description: "scattered clouds" }] },
    { dt: 4, dt_txt: "2026-02-10 12:00:00", main: { temp: 21, humidity: 70 }, wind: { speed: 4.5 }, weather: [{ icon: "10d", description: "light rain" }] },
    { dt: 5, dt_txt: "2026-02-11 12:00:00", main: { temp: 25, humidity: 58 }, wind: { speed: 3.0 }, weather: [{ icon: "01d", description: "sunny" }] },
    { dt: 6, dt_txt: "2026-02-12 12:00:00", main: { temp: 26, humidity: 55 }, wind: { speed: 3.8 }, weather: [{ icon: "02d", description: "partly cloudy" }] },
    { dt: 7, dt_txt: "2026-02-13 12:00:00", main: { temp: 24, humidity: 63 }, wind: { speed: 4.1 }, weather: [{ icon: "04d", description: "broken clouds" }] },
  ]);

  return (
    <div className="overflow-x-auto py-4">
      <div className="flex space-x-4 px-4">
        {forecast.map((day) => {
          const weatherInfo = day.weather[0];
          return (
            <div
              key={day.dt}
              className="bg-white/20 backdrop-blur-md p-4 rounded-xl shadow-lg min-w-[140px] text-center hover:scale-105 transition-transform"
            >
              <p className="font-semibold text-gray-700">
                {new Date(day.dt_txt).toLocaleDateString("en-GB", { weekday: "short" })}
              </p>
              <img
                src={`http://openweathermap.org/img/wn/${weatherInfo.icon}@2x.png`}
                alt={weatherInfo.description}
                className="mx-auto w-16 h-16"
              />
              <p className="text-2xl font-bold text-gray-800">{Math.round(day.main.temp)}°C</p>
              <p className="capitalize text-gray-600">{weatherInfo.description}</p>
              <p className="text-sm text-gray-500">
                💧 {day.main.humidity}% | 🌬 {day.wind.speed} m/s
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}