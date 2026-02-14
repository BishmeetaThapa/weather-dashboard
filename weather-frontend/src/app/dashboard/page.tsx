"use client";

import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/weather/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { fetchWeather, WeatherData, DEFAULT_LOCATION, formatTemperature } from "@/lib/weatherApi";
import {
  CloudRain,
  Wind,
  Droplets,
  Sun,
  MapPin,
  Clock,
} from "lucide-react";

export default function DashboardPage() {
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

    // Real-time updates: Poll every 5 minutes
    const interval = setInterval(getData, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <MainLayout pageTitle="Loading Weather Overview...">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (!weather) return null;

  return (
    <MainLayout pageTitle="Weather Overview">
      <div className="space-y-8">
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
          {/* Main Chart - Temporarily disabled until backend provides hourly data */}
          <Card className="lg:col-span-2">
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">Temperature chart will be available when backend provides hourly data</p>
            </CardContent>
          </Card>

          <Card className="bg-blue-600 border-none shadow-xl shadow-blue-200 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Sun className="w-40 h-40" />
            </div>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-200" />
                <span className="text-sm font-medium text-blue-100 uppercase tracking-wider">{weather.city}, {weather.country}</span>
              </div>
              <CardTitle className="text-white text-3xl font-bold mt-2">{weather.city}, {weather.country}</CardTitle>
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

        {/* Current Weather Summary - 7-day forecast disabled until backend provides daily data */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Current Weather</h2>
          </div>
          <Card className="text-center">
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm font-semibold text-gray-500">Today</p>
              <div className="mx-auto bg-blue-50 w-16 h-16 rounded-lg flex items-center justify-center">
                <Sun className="w-8 h-8 text-amber-500" />
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-gray-900">{weather.description}</p>
                <div className="space-x-2">
                  <span className="text-lg font-bold text-gray-900">{Math.round(weather.temperature)}°C</span>
                  {weather.temp_min && weather.temp_max && (
                    <span className="text-sm font-medium text-gray-400">
                      H: {Math.round(weather.temp_max)}° L: {Math.round(weather.temp_min)}°
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}