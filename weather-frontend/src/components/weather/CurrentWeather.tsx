"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { Droplets, Wind, Cloud, Sun, Thermometer } from "lucide-react";

import { WeatherData, getWeatherIcon } from "@/lib/weatherApi";

interface CurrentWeatherProps {
  weatherData?: WeatherData | null;
}

export default function CurrentWeather({ weatherData }: CurrentWeatherProps) {
  if (!weatherData) {
    return (
      <Card className="bg-gray-800/20 backdrop-blur-xl border border-gray-700/40 rounded-3xl">
        <CardContent className="p-8 text-center">
          <p className="text-white/60 font-bold">No weather data available</p>
        </CardContent>
      </Card>
    );
  }

  const { city, temperature, condition, humidity, wind, clouds, uvIndex } = weatherData;

  return (
    <Card className="bg-gradient-to-br from-primary/20 via-primary/10 to-transparent backdrop-blur-xl border border-primary/20 rounded-3xl shadow-2xl shadow-primary/5 overflow-hidden">
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em]">
              {city || "Unknown Location"}
            </p>
            <div className="flex items-baseline gap-3">
              <span className="text-6xl md:text-7xl font-black text-white tracking-tighter">
                {Math.round(temperature ?? 0)}°
              </span>
              <span className="text-sm font-medium text-white/70">C</span>
            </div>
            <p className="text-sm font-medium text-white/70 uppercase tracking-wider">
              {weatherData.description}
            </p>
          </div>

          <div className="text-7xl md:text-8xl leading-none filter drop-shadow-2xl opacity-90">
            {condition.toLowerCase().includes('clear') ? '☀️' : condition.toLowerCase().includes('cloud') ? '☁️' : condition.toLowerCase().includes('rain') ? '🌧️' : condition.toLowerCase().includes('snow') ? '❄️' : condition.toLowerCase().includes('storm') ? '⛈️' : '🌤️'}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
            <Droplets className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-[10px] font-black text-white/50 uppercase tracking-wider">Humidity</p>
              <p className="text-sm font-bold text-white">{humidity ?? "--"}%</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
            <Wind className="w-5 h-5 text-cyan-400" />
            <div>
              <p className="text-[10px] font-black text-white/50 uppercase tracking-wider">Wind</p>
              <p className="text-sm font-bold text-white">{wind?.speed ?? "--"} km/h</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
            <Cloud className="w-5 h-5 text-purple-400" />
            <div>
              <p className="text-[10px] font-black text-white/50 uppercase tracking-wider">Cloud Cover</p>
              <p className="text-sm font-bold text-white">{clouds?.all ?? "--"}%</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
            <Sun className="w-5 h-5 text-amber-400" />
            <div>
              <p className="text-[10px] font-black text-white/50 uppercase tracking-wider">UV Index</p>
              <p className="text-sm font-bold text-white">{uvIndex ?? "--"}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
