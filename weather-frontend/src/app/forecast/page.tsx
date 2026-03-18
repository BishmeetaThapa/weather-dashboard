"use client";

import React, { useEffect, useState, useCallback } from "react";
import { fetchWeather, FullWeatherData } from "@/lib/weatherApi";
import SearchBar from "@/components/weather/SearchBar";
import CurrentWeather from "@/components/weather/CurrentWeather";
import HourlyForecast from "@/components/weather/HourlyForecast";
import WeeklyForecast from "@/components/weather/WeeklyForecast";
import WeatherDetails from "@/components/weather/WeatherDetails";
import WeatherBackground from "@/components/weather/WeatherBackground";
import WeatherSkeleton from "@/components/weather/WeatherSkeleton";
import { AlertCircle, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { MainLayout } from "@/components/layout/MainLayout";

export default function ForecastPage() {
  const [weather, setWeather] = useState<FullWeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState("Kathmandu");

  const loadData = useCallback(async (searchCity: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWeather(searchCity);
      setWeather(data);
    } catch (err: any) {
      console.error("Failed to fetch weather:", err);
      setError(err.message || "Failed to load weather data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(city);
  }, [city, loadData]);

  const handleSearch = (newCity: string) => {
    setCity(newCity);
  };

  const currentHour = new Date().getHours();
  const isNight = currentHour >= 18 || currentHour <= 6;

  if (loading && !weather) {
    return (
      <MainLayout pageTitle="Forecasting Intelligence">
        <WeatherBackground condition="Clear" isNight={isNight} />
        <WeatherSkeleton />
      </MainLayout>
    );
  }

  return (
    <MainLayout pageTitle="Atmospheric Forecast">
      <div className="font-sans text-white bg-gray-900 min-h-screen">
        <WeatherBackground
          condition={weather?.condition || "Clear"}
          isNight={isNight}
        />

        <main className="max-w-7xl mx-auto px-4 py-8 md:py-12 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key="search"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <SearchBar onSearch={handleSearch} />
            </motion.div>
          </AnimatePresence>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto mt-10 p-6 bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-3xl text-center"
            >
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Oops! Something went wrong</h3>
              <p className="text-white/60 mb-6">{error}</p>
              <button
                onClick={() => loadData(city)}
                className="flex items-center gap-2 mx-auto px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/20"
              >
                <RefreshCw size={18} />
                Try Again
              </button>
            </motion.div>
          )}

          {weather && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 mt-4">
              {/* Left Column: Current & Details */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="md:col-span-8 space-y-8"
              >
                <CurrentWeather data={weather} />

                <div className="space-y-4">
                  <HourlyForecast hourly={weather.hourly} />
                  <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider ml-2">Extra Insights</h3>
                  <WeatherDetails data={weather} />
                </div>
              </motion.div>

              {/* Right Column: Weekly Forecast */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="md:col-span-4"
              >
                <WeeklyForecast daily={weather.daily} />

                {/* Premium Promo / Info Card */}
                <div className="mt-8 p-6 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden relative group">
                  <div className="relative z-10">
                    <h4 className="text-lg font-bold text-white mb-2">Weather Intelligence</h4>
                    <p className="text-white/60 text-sm leading-relaxed">
                      Analyzing real-time atmospheric vectors for extreme precision in {weather.city}.
                    </p>
                  </div>
                  <div className="absolute -right-4 -bottom-4 opacity-10 transform group-hover:scale-110 transition-transform duration-700">
                    <RefreshCw size={120} className="text-white" />
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </main>
      </div>
    </MainLayout>
  );
}
