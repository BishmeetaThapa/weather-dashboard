"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { fetchWeather, FullWeatherData } from "@/lib/weatherApi";
import SearchBar from "@/components/weather/SearchBar";
import CurrentWeather from "@/components/weather/CurrentWeather";
import HourlyForecast from "@/components/weather/HourlyForecast";
import WeeklyForecast from "@/components/weather/WeeklyForecast";
import WeatherDetails from "@/components/weather/WeatherDetails";
import WeatherBackground from "@/components/weather/WeatherBackground";
import WeatherSkeleton from "@/components/weather/WeatherSkeleton";
import { AlertCircle, RefreshCw, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { MainLayout } from "@/components/layout/MainLayout";

const REFRESH_INTERVAL = 2 * 60 * 1000; // 2 minutes

export default function ForecastPage() {
  const searchParams = useSearchParams();
  const initialCity = searchParams.get("city") || "Kathmandu";

  const [weather, setWeather] = useState<FullWeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState(initialCity);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const loadData = useCallback(async (searchCity: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWeather(searchCity);
      setWeather(data);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error("Failed to fetch weather:", err);
      setError(err.message || "Failed to load weather data.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    loadData(city);
  }, [city, loadData]);

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(() => {
        loadData(city);
      }, REFRESH_INTERVAL);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRefresh, city, loadData]);

  const handleSearch = (newCity: string) => {
    setCity(newCity);
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(prev => !prev);
  };

  const formatLastUpdated = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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

          {/* Auto-refresh toggle and last updated */}
          <div className="flex items-center justify-between mt-4 mb-6">
            {lastUpdated && (
              <span className="flex items-center gap-2 text-sm text-white/40">
                <Clock size={14} />
                Updated: {formatLastUpdated(lastUpdated)}
              </span>
            )}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={toggleAutoRefresh}
                className={`p-2 rounded-xl transition-all ${autoRefresh
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-white/10 text-white/40"
                  }`}
                title={autoRefresh ? "Auto-refresh ON (2 min)" : "Auto-refresh OFF"}
              >
                <RefreshCw size={16} className={autoRefresh ? "animate-pulse" : ""} />
              </button>
            </div>
          </div>

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
                <CurrentWeather weatherData={weather} />

                <div className="space-y-4">
                  <HourlyForecast hourlyData={weather.hourly} />
                  <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider ml-2">Extra Insights</h3>
                  <WeatherDetails weatherData={weather} />
                </div>
              </motion.div>

              {/* Right Column: Weekly Forecast */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="md:col-span-4"
              >
                <WeeklyForecast dailyData={weather.daily} />

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
