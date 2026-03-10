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
      // fetchWeather now returns FullWeatherData, we just need the WeatherData part or can use it all
      const data = await fetchWeather("Kathmandu");
      setWeather(data);
    } catch (err: any) {
      console.error("Failed to fetch weather:", err);
      setError(err.message || "Unable to connect to the backend. Please ensure the server is running.");
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout pageTitle="Current Meteorology">
      <WeatherBackground 
        condition={weather?.condition || 'Clear'} 
        isNight={isNight} 
      />
      
      <div className="relative z-10 space-y-8">
        <AnimatePresence mode="wait">
          {error && !weather ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="border-rose-500/30 bg-rose-500/10 backdrop-blur-md rounded-[2.5rem]">
                <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                  <div className="p-4 bg-rose-500/20 rounded-full text-rose-400">
                    <AlertCircle className="w-12 h-12" />
                  </div>
                  <div>
                    <h3 className="font-bold text-2xl tracking-tight text-white">Data Connection Interrupted</h3>
                    <p className="text-rose-400/80 mt-2 max-w-md">{error}</p>
                  </div>
                  <button 
                    onClick={getData}
                    className="mt-4 flex items-center gap-2 px-6 py-3 bg-rose-500 text-white rounded-2xl font-bold hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retry Connection
                  </button>
                </CardContent>
              </Card>
              <WeatherAdminPanel onDataAdded={getData} />
            </motion.div>
          ) : weather ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
            >
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2">
                  <CurrentWeather data={weather} />
                </div>
                <div>
                  <WeatherDetails data={weather} />
                </div>
              </div>
              
              <div className="pt-10 border-t border-white/10">
                <h3 className="text-sm font-bold text-white/40 uppercase tracking-[0.3em] mb-8 px-2">Data Administration</h3>
                <WeatherAdminPanel onDataAdded={getData} />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
}
