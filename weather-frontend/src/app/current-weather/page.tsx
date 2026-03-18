"use client";

import { useEffect, useState, useCallback } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { fetchWeather, WeatherData } from "@/lib/weatherApi";
import { WeatherAdminPanel } from "@/components/weather/WeatherAdminPanel";
import CurrentWeather from "@/components/weather/CurrentWeather";
import WeatherDetails from "@/components/weather/WeatherDetails";
import WeatherBackground from "@/components/weather/WeatherBackground";
import { AlertCircle, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CurrentWeatherPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWeather("Kathmandu");
      setWeather(data);
    } catch (err: any) {
      console.error("Failed to fetch weather:", err);
      setError(
        err.message ||
        "Unable to connect to the backend. Please ensure the server is running."
      );
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  const currentHour = new Date().getHours();
  const isNight = currentHour >= 18 || currentHour <= 6;

  if (loading && !weather) {
    return (
      <MainLayout pageTitle="Loading Weather...">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/10 border-t-primary"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout pageTitle="Current Meteorology">
      <WeatherBackground
        condition={weather?.condition || "Clear"}
        isNight={isNight}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-6 space-y-10">
        <AnimatePresence mode="wait">
          {error && !weather ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-gray-800/20 backdrop-blur-xl border border-gray-700/40 rounded-3xl">
                <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                  <div className="p-3 bg-red-500/20 rounded-full text-red-400">
                    <AlertCircle className="w-8 h-8" />
                  </div>

                  <div>
                    <h3 className="font-bold text-xl text-white">
                      Unable to load weather data
                    </h3>

                    <p className="text-white/60 mt-1 max-w-md">{error}</p>
                  </div>

                  <button
                    onClick={getData}
                    className="mt-3 flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/80 transition"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retry
                  </button>
                </CardContent>
              </Card>

              <div className="mt-8">
                <WeatherAdminPanel onDataAdded={getData} />
              </div>
            </motion.div>
          ) : weather ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <CurrentWeather data={weather} />
                </div>

                <div>
                  <WeatherDetails data={weather} />
                </div>
              </div>

              <div className="pt-8 border-t border-white/10">
                <h3 className="text-sm font-black text-white/60 uppercase tracking-widest mb-6">
                  Data Administration
                </h3>

                <WeatherAdminPanel onDataAdded={getData} />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
}