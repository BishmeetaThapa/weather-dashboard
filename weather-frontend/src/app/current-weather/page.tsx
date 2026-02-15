"use client";

import { useEffect, useState, useCallback } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatCard } from "@/components/weather/StatCard";
import { fetchWeather, WeatherData, DEFAULT_LOCATION } from "@/lib/weatherApi";
import { WeatherAdminPanel } from "@/components/weather/WeatherAdminPanel";
import {
  Sun,
  Wind,
  Droplets,
  Eye,
  Thermometer,
  ArrowDown,
  ArrowUp,
  MapPin,
  Clock,
  AlertCircle
} from "lucide-react";

export default function CurrentWeatherPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWeather("Kathmandu"); // Defaulting to Kathmandu
      setWeather(data);
    } catch (err: any) {
      console.error("Failed to fetch weather:", err);
      if (err.message.includes("No weather data found")) {
        setError("No weather data found. Please add data using the admin panel.");
      } else {
        setError("Unable to connect to the backend. Please ensure the server is running.");
      }
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  if (loading && !weather && !error) {
    return (
      <MainLayout pageTitle="Loading Current Weather...">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout pageTitle="Current Weather">
      <div className="space-y-8">

        {/* Error / Empty State Handling */}
        {error && !weather && (
          <div className="space-y-6">
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="p-6 flex items-center gap-4 text-amber-800">
                <AlertCircle className="w-8 h-8" />
                <div>
                  <h3 className="font-bold text-lg">No Data Available</h3>
                  <p>{error}</p>
                </div>
              </CardContent>
            </Card>
            <WeatherAdminPanel onDataAdded={getData} />
          </div>
        )}

        {weather && (
          <>
            {/* Main Status Hero */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 overflow-hidden border-none shadow-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white p-8">
                <div className="flex flex-col md:flex-row justify-between gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-blue-100">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-medium uppercase tracking-widest">{weather.city}, {weather.country}</span>
                      </div>
                      <h2 className="text-5xl font-black">{weather.description}</h2>
                      <p className="text-blue-100 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Updated as of {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-8xl font-black tracking-tighter">{Math.round(weather.temperature)}°</span>
                      <span className="text-2xl font-bold text-blue-200">C</span>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <ArrowUp className="w-5 h-5 text-emerald-400" />
                        <span className="font-bold text-xl">{weather.temp_max ? Math.round(weather.temp_max) + '°' : 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ArrowDown className="w-5 h-5 text-rose-400" />
                        <span className="font-bold text-xl">{weather.temp_min ? Math.round(weather.temp_min) + '°' : 'N/A'}</span>
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
                        <p className="text-lg font-bold text-gray-900">{weather.sunrise || '06:42 AM'}</p>
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
                        <p className="text-lg font-bold text-gray-900">{weather.sunset || '05:18 PM'}</p>
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
              <StatCard label="Feels Like" value={weather.feels_like ? Math.round(weather.feels_like) : Math.round(weather.temperature)} unit="°C" icon={Thermometer} color="rose" />
              <StatCard label="Wind Speed" value={weather.wind.speed} unit="km/h" icon={Wind} color="amber" />
              <StatCard label="Humidity" value={weather.humidity} unit="%" icon={Droplets} color="blue" />
              <StatCard label="Cloudiness" value={weather.clouds.all} unit="%" icon={Eye} color="emerald" />
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
