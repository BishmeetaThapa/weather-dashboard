"use client";

import { useEffect, useState, useCallback } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/weather/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { fetchWeather, WeatherData } from "@/lib/weatherApi";
import { WeatherAdminPanel } from "@/components/weather/WeatherAdminPanel";
import {
  CloudRain,
  Wind,
  Droplets,
  Sun,
  MapPin,
  Clock,
  AlertCircle
} from "lucide-react";

export default function DashboardPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWeather("Kathmandu"); // Defaulting to Kathmandu for now
      setWeather(data);
    } catch (err: any) {
      console.error("Failed to fetch weather:", err);
      // If 404/No data, we show the admin panel to add it.
      if (err.message.includes("No weather data found")) {
        setError("No weather data found. Please add data using the admin panel below.");
      } else {
        setError("Failed to connect to the backend. Please check if the server is running.");
      }
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getData();
    const interval = setInterval(getData, 5 * 60 * 1000); // Poll every 5 mins
    return () => clearInterval(interval);
  }, [getData]);

  if (loading && !weather && !error) {
    return (
      <MainLayout pageTitle="Loading Weather Overview...">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout pageTitle="Weather Overview">
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
            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                label="Temperature"
                value={Math.round(weather.temperature)}
                unit="°C"
                icon={Sun}
                trend={{ value: 2, isUp: true }}
                color="amber"
              />
              <StatCard
                label="Humidity"
                value={weather.humidity}
                unit="%"
                icon={Droplets}
                trend={{ value: 5, isUp: false }}
                color="blue"
              />
              <StatCard
                label="Wind Speed"
                value={weather.wind.speed}
                unit="km/h"
                icon={Wind}
                trend={{ value: 1, isUp: true }}
                color="emerald"
              />
              <StatCard
                label="Cloudiness"
                value={weather.clouds.all}
                unit="%"
                icon={CloudRain}
                color="rose"
              />
            </div>

            {/* Charts and Details Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Chart */}
              <Card className="lg:col-span-2">
                <CardContent className="p-8 text-center flex flex-col items-center justify-center h-full space-y-4">
                  <div className="p-4 bg-gray-50 rounded-full">
                    <Sun className="w-12 h-12 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Live Temperature Tracking</h3>
                    <p className="text-gray-500">Real-time data from your local database.</p>
                  </div>
                </CardContent>
              </Card>

              {/* Weather Card */}
              <Card className="bg-blue-600 border-none shadow-xl shadow-blue-200 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Sun className="w-40 h-40" />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-200" />
                    <span className="text-sm font-medium text-blue-100 uppercase tracking-wider">{weather.city}, {weather.country}</span>
                  </div>
                  <CardTitle className="text-white text-3xl font-bold mt-2">{weather.city}</CardTitle>
                </CardHeader>
                <CardContent className="mt-4">
                  <div className="flex items-center gap-4">
                    <span className="text-6xl font-black">{Math.round(weather.temperature)}°</span>
                    <div className="space-y-1">
                      <p className="text-lg font-semibold">{weather.description}</p>
                      <p className="text-blue-100 text-sm flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  <div className="mt-12 pt-6 border-t border-blue-500/50 space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-blue-200">Feels Like</span>
                      <span className="font-semibold text-white">{weather.feels_like ? Math.round(weather.feels_like) + '°C' : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-blue-200">Cloudiness</span>
                      <span className="font-semibold text-white">{weather.clouds.all}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Show Admin Panel even with data, at bottom, for updates */}
            <div className="pt-8 border-t border-gray-100">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Database Management</h3>
              <WeatherAdminPanel onDataAdded={getData} />
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
