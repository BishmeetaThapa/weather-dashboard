"use client";

import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatCard } from "@/components/weather/StatCard";
import { fetchWeather, WeatherData, DEFAULT_LOCATION } from "@/lib/weatherApi";
import {
  Sun,
  Wind,
  Droplets,
  Eye,
  Thermometer,
  ArrowDown,
  ArrowUp,
  MapPin,
  Clock
} from "lucide-react";

export default function CurrentWeatherPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchWeather();
        setWeather(data);
      } catch (error) {
        console.error("Failed to fetch weather:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  if (loading) {
    return (
      <MainLayout pageTitle="Loading Current Weather...">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (!weather) return null;

  return (
    <MainLayout pageTitle="Current Weather">
      <div className="space-y-8">
        {/* Main Status Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 overflow-hidden border-none shadow-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white p-8">
            <div className="flex flex-col md:flex-row justify-between gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-blue-100">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium uppercase tracking-widest">{DEFAULT_LOCATION.name}</span>
                  </div>
                  <h2 className="text-5xl font-black">{weather.current.condition}</h2>
                  <p className="text-blue-100 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Updated as of {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-8xl font-black tracking-tighter">{Math.round(weather.current.temp)}°</span>
                  <span className="text-2xl font-bold text-blue-200">C</span>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <ArrowUp className="w-5 h-5 text-emerald-400" />
                    <span className="font-bold text-xl">{Math.round(weather.daily.temperature_2m_max[0])}°</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowDown className="w-5 h-5 text-rose-400" />
                    <span className="font-bold text-xl">{Math.round(weather.daily.temperature_2m_min[0])}°</span>
                  </div>
                </div>
              </div>

              <div className="relative flex-1 flex items-center justify-center md:justify-end">
                <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full transform scale-75"></div>
                <Sun className="w-64 h-64 text-amber-400 relative z-10 drop-shadow-2xl" />
              </div>
            </div>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Solar Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-amber-50 text-amber-600">
                    <Sun className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Sunrise</p>
                    <p className="text-lg font-bold text-gray-900">06:42 AM</p>
                  </div>
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase">4h ago</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
                    <Sun className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Sunset</p>
                    <p className="text-lg font-bold text-gray-900">05:18 PM</p>
                  </div>
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase">in 2h</p>
              </div>

              <div className="pt-8 border-t border-gray-100">
                <div className="flex justify-between items-end mb-4">
                  <p className="text-sm font-bold text-gray-900">Daylight</p>
                  <p className="text-sm font-bold text-blue-600 font-mono">10h 36m</p>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 w-3/4"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Feels Like" value={Math.round(weather.current.temp)} unit="°C" icon={Thermometer} color="rose" />
          <StatCard label="Wind Speed" value={weather.current.windSpeed} unit="km/h" icon={Wind} color="amber" />
          <StatCard label="Humidity" value={weather.current.humidity} unit="%" icon={Droplets} color="blue" />
          <StatCard label="Visibility" value="10" unit="km" icon={Eye} color="emerald" />
        </div>
      </div>
    </MainLayout>
  );
}